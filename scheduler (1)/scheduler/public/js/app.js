// Global variables
let currentTasks = [];
let notificationPermission = false;

// Add alarm sound
function playAlarm() {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    console.log('🔔 Alarm sound played!');
  } catch (error) {
    console.log('Alarm sound played (fallback)');
  }
}

// Utility functions
function formatDateTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date - now;
  
  if (diff < 0) {
    return `Overdue: ${date.toLocaleString()}`;
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `Today at ${date.toLocaleTimeString()}`;
  } else if (diff < 48 * 60 * 60 * 1000) {
    return `Tomorrow at ${date.toLocaleTimeString()}`;
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}

function getStatusBadge(task) {
  if (task.done) {
    return '<span class="status-badge status-completed">Completed</span>';
  } else if (new Date(task.endTime) < new Date()) {
    return '<span class="status-badge status-overdue">Overdue</span>';
  } else {
    return '<span class="status-badge status-pending">Pending</span>';
  }
}

function getCategoryIcon(category) {
  const icons = {
    work: '💼',
    personal: '👤',
    health: '🏥',
    learning: '📚',
    other: '📌'
  };
  return icons[category] || '📌';
}

function getPriorityIcon(priority) {
  const icons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴'
  };
  return icons[priority] || '🟡';
}

// API functions
async function fetchTasks() {
  try {
    const view = document.getElementById("viewType").value;
    const category = document.getElementById("categoryFilter").value;
    
    let url = `/api/tasks?view=${view}`;
    if (category) {
      url += `&category=${category}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showNotification('Error loading tasks', 'error');
    return [];
  }
}

async function createTask(taskData) {
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    showNotification('Error creating task', 'error');
    throw error;
  }
}

async function updateTask(taskId, taskData) {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    showNotification('Error updating task', 'error');
    throw error;
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE"
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting task:', error);
    showNotification('Error deleting task', 'error');
    throw error;
  }
}

async function toggleTask(taskId) {
  try {
    const response = await fetch(`/api/tasks/${taskId}/toggle`, {
      method: "PATCH"
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling task:', error);
    showNotification('Error updating task status', 'error');
    throw error;
  }
}

// UI functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add notification styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;
  
  if (type === 'error') {
    notification.style.background = '#f56565';
  } else if (type === 'success') {
    notification.style.background = '#48bb78';
  } else {
    notification.style.background = '#667eea';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Search Algorithm: Linear search for tasks by title or description
function searchTasks() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = currentTasks.filter(task =>
    (task.title && task.title.toLowerCase().includes(query)) ||
    (task.description && task.description.toLowerCase().includes(query))
  );
  renderTasks(filtered);
}

// Render a list of tasks
function renderTasks(tasks) {
  const container = document.getElementById("tasksContainer");
  container.innerHTML = "";
  if (tasks.length === 0) {
    container.innerHTML = "<div style='text-align:center;color:#888;'>No tasks found.</div>";
  } else {
    tasks.forEach(task => container.appendChild(renderTask(task)));
  }
  updateStats(tasks);
  highlightNextTask(tasks);
}

// Greedy Scheduling: Find the next task due (earliest endTime)
function getNextTask(tasks) {
  return tasks.reduce((earliest, task) => {
    const end = new Date(task.endTime || task.time);
    if (!earliest) return task;
    const earliestEnd = new Date(earliest.endTime || earliest.time);
    return end < earliestEnd ? task : earliest;
  }, null);
}

// Highlight the next task in the UI
function highlightNextTask(tasks) {
  const next = getNextTask(tasks);
  if (!next) return;
  const el = document.querySelector(`.task[data-task-id='${next._id}']`);
  if (el) el.style.boxShadow = '0 0 0 3px #48bb78, 0 5px 15px rgba(0,0,0,0.1)';
}

// Validation Algorithm: Check if a task is valid
function validateTask(task) {
  if (!task.title || !task.startTime || !task.endTime) return false;
  if (new Date(task.startTime) >= new Date(task.endTime)) return false;
  return true;
}

// updateStats now takes a parameter
function updateStats(tasks = currentTasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.done).length;
  const pending = total - completed;
  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = pending;
  document.getElementById("taskCount").textContent = `(${total})`;
}

function renderTask(task) {
  const taskElement = document.createElement("div");
  taskElement.className = `task ${task.priority} ${task.done ? 'done' : ''}`;
  taskElement.dataset.taskId = task._id;
  
  const statusBadge = getStatusBadge(task);
  const categoryIcon = getCategoryIcon(task.category);
  const priorityIcon = getPriorityIcon(task.priority);
  
  // Handle backward compatibility - use time if startTime/endTime not available
  const startTime = task.startTime || task.time;
  const endTime = task.endTime || task.time;
  
  taskElement.innerHTML = `
    <div class="task-header">
      <div class="task-title">
        <span class="priority-indicator priority-${task.priority}"></span>
        ${task.title}
      </div>
      <div class="task-actions">
        <button onclick="toggleTaskStatus('${task._id}')" title="${task.done ? 'Mark as pending' : 'Mark as completed'}">
          <i class="fas fa-${task.done ? 'undo' : 'check'}"></i>
        </button>
        <button onclick="editTask('${task._id}')" title="Edit task">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteTaskConfirm('${task._id}')" title="Delete task">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
    <div class="task-meta">
      <div class="task-time">
        <i class="fas fa-play"></i> ${startTime ? formatDateTime(startTime) : 'Not set'} <br>
        <i class="fas fa-stop"></i> ${endTime ? formatDateTime(endTime) : 'Not set'}
      </div>
      <div class="task-category">
        ${categoryIcon} ${task.category}
      </div>
    </div>
    <div style="margin-top: 10px;">
      ${statusBadge}
      <span style="margin-left: 10px; font-size: 0.8rem; color: #666;">
        ${priorityIcon} ${task.priority} priority
      </span>
    </div>
  `;
  return taskElement;
}

async function loadTasks() {
  const container = document.getElementById("tasksContainer");
  container.innerHTML = '<div class="loading">Loading tasks...</div>';
  
  try {
    currentTasks = await fetchTasks();
    
    renderTasks(currentTasks);
  } catch (error) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #f56565;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
        <p>Error loading tasks. Please try again.</p>
      </div>
    `;
  }
}

// Debounce Algorithm: Prevents a function from running too often
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Binary Search Algorithm: Find a task by exact title in a sorted array
function binarySearch(tasks, targetTitle) {
  let left = 0, right = tasks.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midTitle = tasks[mid].title.toLowerCase();
    if (midTitle === targetTitle.toLowerCase()) return tasks[mid];
    if (midTitle < targetTitle.toLowerCase()) left = mid + 1;
    else right = mid - 1;
  }
  return null;
}

// Duplicate Detection Algorithm: Prevent adding duplicate tasks
function isDuplicateTask(newTask, tasks) {
  return tasks.some(task =>
    task.title.toLowerCase() === newTask.title.toLowerCase() &&
    new Date(task.startTime || task.time).getTime() === new Date(newTask.startTime).getTime()
  );
}

// Priority Queue (Min-Heap) for alarms (for future use)
class PriorityQueue {
  constructor() { this.heap = []; }
  insert(task) {
    this.heap.push(task);
    this._bubbleUp(this.heap.length - 1);
  }
  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._sinkDown(0);
    }
    return min;
  }
  _bubbleUp(idx) {
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (new Date(element.endTime || element.time) >= new Date(this.heap[parentIdx].endTime || this.heap[parentIdx].time)) break;
      this.heap[idx] = this.heap[parentIdx];
      this.heap[parentIdx] = element;
      idx = parentIdx;
    }
  }
  _sinkDown(idx) {
    const length = this.heap.length;
    const element = this.heap[idx];
    while (true) {
      let leftIdx = 2 * idx + 1, rightIdx = 2 * idx + 2;
      let swap = null;
      if (leftIdx < length && new Date(this.heap[leftIdx].endTime || this.heap[leftIdx].time) < new Date(element.endTime || element.time)) {
        swap = leftIdx;
      }
      if (rightIdx < length && new Date(this.heap[rightIdx].endTime || this.heap[rightIdx].time) < new Date((swap === null ? element : this.heap[leftIdx]).endTime || (swap === null ? element : this.heap[leftIdx]).time)) {
        swap = rightIdx;
      }
      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      this.heap[swap] = element;
      idx = swap;
    }
  }
}

// Task management functions
async function addTask(event) {
  event.preventDefault();
  const title = document.getElementById("titleInput").value.trim();
  const description = document.getElementById("descriptionInput").value.trim();
  const startTime = document.getElementById("startTimeInput").value;
  const endTime = document.getElementById("endTimeInput").value;
  const priority = document.getElementById("priorityInput").value;
  const category = document.getElementById("categoryInput").value;
  const reminder = document.getElementById("reminderInput").checked;
  const type = document.getElementById("viewType").value;
  const taskData = { title, description, startTime, endTime, priority, category, reminder, type };
  if (!validateTask(taskData)) {
    showNotification('Please fill in all required fields and ensure start time is before end time.', 'error');
    return;
  }
  if (isDuplicateTask(taskData, currentTasks)) {
    showNotification('A task with the same title and start time already exists.', 'error');
    return;
  }
  try {
    await createTask(taskData);
    document.getElementById("taskForm").reset();
    document.getElementById("priorityInput").value = "medium";
    document.getElementById("categoryInput").value = "other";
    document.getElementById("reminderInput").checked = true;
    showNotification('Task created successfully!', 'success');
    loadTasks();
  } catch (error) {
    showNotification('Failed to create task', 'error');
  }
}

async function toggleTaskStatus(taskId) {
  try {
    await toggleTask(taskId);
    showNotification('Task status updated!', 'success');
    loadTasks();
  } catch (error) {
    showNotification('Failed to update task status', 'error');
  }
}

async function deleteTaskConfirm(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await deleteTask(taskId);
      showNotification('Task deleted successfully!', 'success');
      loadTasks();
    } catch (error) {
      showNotification('Failed to delete task', 'error');
    }
  }
}

// Modal functions
function openEditModal(taskId) {
  const task = currentTasks.find(t => t._id === taskId);
  if (!task) return;
  document.getElementById("editTaskId").value = taskId;
  document.getElementById("editTitleInput").value = task.title;
  document.getElementById("editDescriptionInput").value = task.description || '';
  document.getElementById("editStartTimeInput").value = task.startTime ? task.startTime.slice(0, 16) : '';
  document.getElementById("editEndTimeInput").value = task.endTime ? task.endTime.slice(0, 16) : '';
  document.getElementById("editPriorityInput").value = task.priority;
  document.getElementById("editCategoryInput").value = task.category;
  document.getElementById("editReminderInput").checked = task.reminder;
  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

async function editTask(taskId) {
  openEditModal(taskId);
}

async function saveEditTask(event) {
  event.preventDefault();
  const taskId = document.getElementById("editTaskId").value;
  const title = document.getElementById("editTitleInput").value.trim();
  const description = document.getElementById("editDescriptionInput").value.trim();
  const startTime = document.getElementById("editStartTimeInput").value;
  const endTime = document.getElementById("editEndTimeInput").value;
  const priority = document.getElementById("editPriorityInput").value;
  const category = document.getElementById("editCategoryInput").value;
  const reminder = document.getElementById("editReminderInput").checked;
  const taskData = { title, description, startTime, endTime, priority, category, reminder };
  if (!validateTask(taskData)) {
    showNotification('Please fill in all required fields and ensure start time is before end time.', 'error');
    return;
  }
  try {
    await updateTask(taskId, taskData);
    closeEditModal();
    showNotification('Task updated successfully!', 'success');
    loadTasks();
  } catch (error) {
    showNotification('Failed to update task', 'error');
  }
}

// Notification system
function setupNotifications() {
  if (!notificationPermission) return;
  currentTasks.forEach(task => {
    if (task.reminder && !task.done) {
      const endTime = task.endTime || task.time;
      if (endTime) {
        const end = new Date(endTime);
        const now = new Date();
        const timeUntilEnd = end.getTime() - now.getTime();
        if (timeUntilEnd > 0) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("⏰ Task Ended", {
                body: `${task.title} has ended!`,
                icon: "/favicon.ico"
              });
            }
            playAlarm();
          }, timeUntilEnd);
        }
      }
    }
  });
}

// Notification permission functions
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    updateNotificationButton(permission);
    
    if (permission === 'granted') {
      notificationPermission = true;
      showNotification('Notifications enabled! You will receive alerts when tasks end.', 'success');
      setupNotifications(); // Re-setup notifications for current tasks
    } else if (permission === 'denied') {
      notificationPermission = false;
      showNotification('Notifications are disabled. You can enable them in your browser settings.', 'error');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    showNotification('Could not request notification permission.', 'error');
  }
}

function updateNotificationButton(permission) {
  const btn = document.getElementById('notificationBtn');
  if (!btn) return;
  
  btn.classList.remove('granted', 'denied');
  
  if (permission === 'granted') {
    btn.innerHTML = '<i class="fas fa-bell"></i> Notifications Enabled';
    btn.classList.add('granted');
    btn.disabled = true;
  } else if (permission === 'denied') {
    btn.innerHTML = '<i class="fas fa-bell-slash"></i> Notifications Blocked';
    btn.classList.add('denied');
  } else {
    btn.innerHTML = '<i class="fas fa-bell"></i> Enable Notifications';
  }
}

function checkNotificationPermission() {
  const permission = Notification.permission;
  updateNotificationButton(permission);
  
  if (permission === 'granted') {
    notificationPermission = true;
  } else {
    notificationPermission = false;
  }
  
  return permission;
}

// Event listeners
window.onload = async () => {
  // Check notification permission status
  checkNotificationPermission();
  
  // Set up event listeners
  document.getElementById("taskForm").addEventListener("submit", addTask);
  document.getElementById("editForm").addEventListener("submit", saveEditTask);
  
  // Modal close functionality
  document.querySelector(".close").addEventListener("click", closeEditModal);
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("editModal");
    if (event.target === modal) {
      closeEditModal();
    }
  });
  
  // Load initial tasks
  loadTasks();
  
  // Auto-refresh every 30 seconds
  setInterval(loadTasks, 30000);
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.oninput = debounce(searchTasks, 200);
  }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

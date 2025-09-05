# AIML-A Project Hub & Tools

This workspace contains a central **Project Hub UI** that launches several independent, full-stack applications. To make the hub's buttons work, you must run each application's server simultaneously.

---

## Quick Start: How to Run Everything

To run the entire suite, you must start **seven** servers in separate terminals. Follow these steps carefully.

### Terminal 1: Main Project Hub (UI) - Port 3000

This is the main user interface.
```sh
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\main-hub"
npm install
npm start
```
✅ **Your UI is now running at `http://localhost:3000`**

---

### Terminal 2: Run the Algorithm Analyzer

This runs the server for the "Algorithm Analyzer" tool.
```sh
# 1. Navigate to the analyzer's frontend directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\algorithmanalyser"

# 2. Install dependencies (only needed once)
npm install

# 3. Start the server
npm run dev
```
✅ **The Analyzer tool is now running at `http://localhost:3001`**

---

### Terminal 3: Run the Smart Resume Optimizer

This runs the Python server for the "Resume Optimizer" tool.
```sh
# 1. Navigate to the optimizer's directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\resumeoptimiser"

# 2. Activate virtual environment
venv\Scripts\activate

# 3. Install dependencies (only needed once)
pip install -r requirements.txt

# 4. Start the server
python main.py
```
✅ **The Resume Optimizer is now running at `http://localhost:5000`**

---

### Terminals 4 & 5: Run the Student Q&A Platform

This tool requires two servers (backend and frontend).

**In Terminal 4 (Backend):**
```sh
# 1. Navigate to the Q&A project directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\projectQ&A\project"

# 2. Start the backend server
npm run server
```
✅ **The Q&A backend is now running (check terminal for port, likely 8000).**

**In Terminal 5 (Frontend):**
```sh
# 1. Navigate to the Q&A project directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\projectQ&A\project"

# 2. Start the frontend server
npm run dev
```
✅ **The Q&A frontend is now running at `http://localhost:5173`**

### 📊 CGPA Calculator
The **CGPA Calculator** module helps students calculate their **Cumulative Grade Point Average** quickly and accurately.
- **Input:** Subject grades and credits for one or more semesters.
- **Output:** Overall CGPA calculated using weighted averages.
- **Features:**
  - Supports multiple semesters
  - Handles both percentage and grade-based inputs
  - Instant calculation with a clean, responsive UI
- **Purpose:** Part of the all-in-one student productivity suite.

## 🖥️ How to Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
2. **Install dependencies**
   ```bash
   npm install
3. **Start the development server:**
   ```bash
   npm run dev

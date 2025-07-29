const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api' 
  : 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private static getAuthHeadersForFormData(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Authentication
  static async register(userData: { username: string; email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token
      localStorage.setItem('authToken', data.token);
      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  static async login(credentials: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token
      localStorage.setItem('authToken', data.token);
      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  static async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get user');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  static logout() {
    localStorage.removeItem('authToken');
  }

  // Questions
  static async getQuestions(params: {
    page?: number;
    limit?: number;
    tags?: string;
    search?: string;
    sortBy?: string;
  } = {}) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== '') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const response = await fetch(`${API_BASE_URL}/questions?${queryString}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch questions');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  static async createQuestion(questionData: {
    title: string;
    content: string;
    tags: string[];
  }, files?: File[]) {
    try {
      const formData = new FormData();
      formData.append('title', questionData.title);
      formData.append('content', questionData.content);
      formData.append('tags', JSON.stringify(questionData.tags));

      if (files) {
        files.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: this.getAuthHeadersForFormData(),
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create question');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  static async voteQuestion(questionId: string, voteType: 'up' | 'down') {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}/vote`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ voteType })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to vote');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Answers
  static async getAnswers(questionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/answers/question/${questionId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch answers');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  static async createAnswer(answerData: { questionId: string; content: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/answers`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(answerData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create answer');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  static async voteAnswer(answerId: string, voteType: 'up' | 'down') {
    try {
      const response = await fetch(`${API_BASE_URL}/answers/${answerId}/vote`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ voteType })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to vote');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Tags
  static async getTags() {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tags');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  static async getSuggestions(query: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/tags/suggestions?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get suggestions');
      }

      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
}

export default ApiService;
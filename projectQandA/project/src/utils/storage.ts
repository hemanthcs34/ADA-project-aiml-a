import { Question, Answer, User, Tag } from '../types';

const STORAGE_KEYS = {
  QUESTIONS: 'qa_questions',
  USERS: 'qa_users',
  CURRENT_USER: 'qa_current_user',
  TAGS: 'qa_tags'
};

export class StorageService {
  static getQuestions(): Question[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return data ? JSON.parse(data) : [];
  }

  static saveQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }

  static getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  static getTags(): Tag[] {
    const data = localStorage.getItem(STORAGE_KEYS.TAGS);
    return data ? JSON.parse(data) : [];
  }

  static saveTags(tags: Tag[]): void {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  }

  static initializeData(): void {
    const questions = this.getQuestions();
    const users = this.getUsers();

    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'student1',
          email: 'student1@university.edu',
          reputation: 150,
          joinDate: new Date('2024-01-15')
        },
        {
          id: '2',
          username: 'student2',
          email: 'student2@university.edu',
          reputation: 89,
          joinDate: new Date('2024-02-20')
        },
        {
          id: '3',
          username: 'student3',
          email: 'student3@university.edu',
          reputation: 203,
          joinDate: new Date('2024-01-10')
        }
      ];
      this.saveUsers(defaultUsers);
    }

    if (questions.length === 0) {
      const defaultQuestions: Question[] = [
        {
          id: '1',
          title: 'How to implement binary search in JavaScript?',
          content: 'I need help understanding the binary search algorithm and implementing it in JavaScript. Can someone provide a clear example with explanation?',
          author: users[0] || { id: '1', username: 'student1', email: 'student1@university.edu', reputation: 150, joinDate: new Date() },
          tags: ['javascript', 'algorithms', 'binary-search'],
          upvotes: 12,
          downvotes: 2,
          score: 10,
          answers: [
            {
              id: '1',
              questionId: '1',
              content: 'Here\'s a simple implementation of binary search:\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n```',
              author: users[1] || { id: '2', username: 'student2', email: 'student2@university.edu', reputation: 89, joinDate: new Date() },
              upvotes: 8,
              downvotes: 0,
              score: 8,
              createdAt: new Date('2024-03-15T10:30:00'),
              updatedAt: new Date('2024-03-15T10:30:00'),
              isAccepted: true
            }
          ],
          createdAt: new Date('2024-03-15T09:00:00'),
          updatedAt: new Date('2024-03-15T09:00:00')
        },
        {
          id: '2',
          title: 'React hooks vs class components',
          content: 'What are the advantages of using React hooks over class components? When should I use each approach? I\'m working on a project and trying to decide which pattern to follow.',
          author: users[1] || { id: '2', username: 'student2', email: 'student2@university.edu', reputation: 89, joinDate: new Date() },
          tags: ['react', 'hooks', 'components'],
          upvotes: 15,
          downvotes: 1,
          score: 14,
          answers: [
            {
              id: '2',
              questionId: '2',
              content: 'React hooks offer several advantages:\n\n1. **Simpler code**: No need for class syntax\n2. **Better reusability**: Custom hooks can be shared\n3. **Easier testing**: Functions are easier to test than classes\n4. **Better performance**: React can optimize functional components better\n\nUse hooks for new projects, but class components are still valid for existing codebases.',
              author: users[2] || { id: '3', username: 'student3', email: 'student3@university.edu', reputation: 203, joinDate: new Date() },
              upvotes: 12,
              downvotes: 1,
              score: 11,
              createdAt: new Date('2024-03-14T15:30:00'),
              updatedAt: new Date('2024-03-14T15:30:00')
            }
          ],
          createdAt: new Date('2024-03-14T14:20:00'),
          updatedAt: new Date('2024-03-14T14:20:00')
        },
        {
          id: '3',
          title: 'How to optimize database queries in MongoDB?',
          content: 'I\'m working on a project with MongoDB and my queries are running slowly. What are some best practices for optimizing MongoDB queries? Any specific indexing strategies?',
          author: users[2] || { id: '3', username: 'student3', email: 'student3@university.edu', reputation: 203, joinDate: new Date() },
          tags: ['mongodb', 'database', 'optimization', 'indexing'],
          upvotes: 8,
          downvotes: 0,
          score: 8,
          answers: [],
          createdAt: new Date('2024-03-13T11:15:00'),
          updatedAt: new Date('2024-03-13T11:15:00')
        }
      ];
      this.saveQuestions(defaultQuestions);
    }

    const tags = this.getTags();
    if (tags.length === 0) {
      const defaultTags: Tag[] = [
        { name: 'javascript', count: 25, color: '#f7df1e' },
        { name: 'react', count: 18, color: '#61dafb' },
        { name: 'algorithms', count: 15, color: '#ff6b6b' },
        { name: 'python', count: 22, color: '#3776ab' },
        { name: 'css', count: 12, color: '#1572b6' },
        { name: 'html', count: 10, color: '#e34c26' },
        { name: 'nodejs', count: 8, color: '#339933' },
        { name: 'database', count: 7, color: '#336791' }
      ];
      this.saveTags(defaultTags);
    }
  }
}
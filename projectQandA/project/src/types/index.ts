export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  joinDate: Date;
}

export interface Question {
  id: string;
  _id?: string; // Add this line to support MongoDB _id
  title: string;
  content: string;
  author?: User;
  tags: string[];
  upvotes: number;
  downvotes: number;
  score: number;
  answers?: Answer[];
  createdAt: Date;
  updatedAt: Date;
  attachments?: FileAttachment[];
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: User;
  upvotes: number;
  downvotes: number;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  isAccepted?: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Tag {
  name: string;
  count: number;
  color: string;
}
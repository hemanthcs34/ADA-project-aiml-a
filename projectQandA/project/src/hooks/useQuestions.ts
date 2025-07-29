import { useState, useEffect } from 'react';
import { Question, Answer, User, Tag } from '../types';
// import { StorageService } from '../utils/storage';
import { MaxHeap, HashMap, Trie } from '../utils/dataStructures';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'newest' | 'oldest'>('score');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Initialize data structures
  const [heap] = useState(() => new MaxHeap<Question>((a, b) => a.score - b.score));
  const [tagMap] = useState(() => new HashMap<string, Question[]>());
  const [trie] = useState(() => new Trie());

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, tagFilter, searchQuery, sortBy]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setQuestions(data.questions || []);
      // Optionally set tags from backend if available
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const buildTagMap = (questionList: Question[]) => {
    questionList.forEach(question => {
      question.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(question);
      });
    });
  };

  const buildTrie = (questionList: Question[]) => {
    questionList.forEach(question => {
      // Add question titles and content words to trie
      const words = [...question.title.split(' '), ...question.content.split(' ')];
      words.forEach(word => {
        if (word.length > 2) {
          trie.insert(word);
        }
      });
      
      // Add tags to trie
      question.tags.forEach(tag => trie.insert(tag));
    });
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Apply tag filter using HashMap
    if (tagFilter.length > 0) {
      const taggedQuestions = new Set<Question>();
      tagFilter.forEach(tag => {
        const questionsWithTag = tagMap.get(tag) || [];
        questionsWithTag.forEach(q => taggedQuestions.add(q));
      });
      filtered = filtered.filter(q => taggedQuestions.has(q));
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting using heap
    if (sortBy === 'score') {
      // Use heap for score-based sorting
      const sortedHeap = new MaxHeap<Question>((a, b) => a.score - b.score);
      filtered.forEach(q => sortedHeap.insert(q));
      
      const sorted: Question[] = [];
      while (sortedHeap.size() > 0) {
        sorted.push(sortedHeap.extractMax()!);
      }
      filtered = sorted;
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    setFilteredQuestions(filtered);
  };

  const getSuggestions = (query: string): string[] => {
    if (query.length < 2) return [];
    return trie.getSuggestions(query).slice(0, 5);
  };

  const addQuestion = async (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'score' | 'answers'>) => {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...questionData,
          tags: JSON.stringify(questionData.tags),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      // After adding, fetch the updated list from backend
      await fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const addAnswer = async (questionId: string, content: string) => {
    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          content,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add answer');
      }
      // After adding, fetch the updated list from backend
      await fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const voteQuestion = async (questionId: string, vote: 'up' | 'down') => {
    try {
      // Send vote to backend (implement this if not already)
      await fetch(`/api/questions/${questionId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType: vote }),
      });
      // Fetch updated questions from backend
      await fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const voteAnswer = async (questionId: string, answerId: string, vote: 'up' | 'down') => {
    try {
      // Send vote to backend (implement this if not already)
      await fetch(`/api/answers/${answerId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType: vote }),
      });
      // Fetch updated questions from backend
      await fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTagCounts = (questionList: Question[]) => {
    const tagCounts = new HashMap<string, number>();
    
    questionList.forEach(question => {
      question.tags.forEach(tag => {
        const currentCount = tagCounts.get(tag) || 0;
        tagCounts.set(tag, currentCount + 1);
      });
    });

    const updatedTags = tags.map(tag => ({
      ...tag,
      count: tagCounts.get(tag.name) || 0
    }));

    setTags(updatedTags);
  };

  const login = (username: string, email: string) => {
    const user = {
      id: Date.now().toString(),
      username,
      email,
      reputation: 0,
      joinDate: new Date()
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return {
    questions: filteredQuestions,
    tags,
    currentUser,
    tagFilter,
    searchQuery,
    sortBy,
    suggestions,
    setTagFilter,
    setSearchQuery,
    setSortBy,
    getSuggestions,
    addQuestion,
    addAnswer,
    voteQuestion,
    voteAnswer,
    login,
    logout
  };
};
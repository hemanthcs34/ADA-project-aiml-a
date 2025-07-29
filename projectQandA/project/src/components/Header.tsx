import React, { useState } from 'react';
import { Search, User, LogOut, Plus, BookOpen } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType | null;
  onLogin: (username: string, email: string) => void;
  onLogout: () => void;
  onAskQuestion: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions: string[];
  onGetSuggestions: (query: string) => string[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onAskQuestion,
  searchQuery,
  onSearchChange,
  suggestions,
  onGetSuggestions
}) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', email: '' });

  const handleSearch = (query: string) => {
    onSearchChange(query);
    const newSuggestions = onGetSuggestions(query);
    setShowSuggestions(query.length > 1 && newSuggestions.length > 0);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username && loginForm.email) {
      onLogin(loginForm.username, loginForm.email);
      setShowLoginForm(false);
      setLoginForm({ username: '', email: '' });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">StudyHub Q&A</h1>
          </div>

          <div className="flex-1 max-w-lg mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions, tags, or topics..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSuggestions(searchQuery.length > 1)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      onSearchChange(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <button
                  onClick={onAskQuestion}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Ask Question</span>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">{currentUser.username}</span>
                    <span className="text-sm text-gray-500">({currentUser.reputation} rep)</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowLoginForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Login to StudyHub</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
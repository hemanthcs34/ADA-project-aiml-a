import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { QuestionCard } from './components/QuestionCard';
import { QuestionForm } from './components/QuestionForm';
import { useQuestions } from './hooks/useQuestions';

function App() {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  
  const {
    questions,
    tags,
    currentUser,
    tagFilter,
    searchQuery,
    sortBy,
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
  } = useQuestions();

  const handleTagToggle = (tag: string) => {
    setTagFilter(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAskQuestion = () => {
    if (currentUser) {
      setShowQuestionForm(true);
    }
  };

  const handleAddAnswer = (questionId: string, content: string) => {
    if (currentUser) {
      addAnswer(questionId, content);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onLogin={login}
        onLogout={logout}
        onAskQuestion={handleAskQuestion}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        suggestions={getSuggestions(searchQuery)}
        onGetSuggestions={getSuggestions}
      />
      
      <div className="flex">
        <Sidebar
          tags={tags}
          selectedTags={tagFilter}
          onTagToggle={handleTagToggle}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {tagFilter.length > 0 
                  ? `Questions tagged: ${tagFilter.join(', ')}`
                  : searchQuery
                  ? `Search results for: "${searchQuery}"`
                  : 'All Questions'
                }
              </h1>
              <div className="text-sm text-gray-500">
                {questions.length} question{questions.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🤔</div>
                <div className="text-gray-500 text-lg mb-4">
                  {searchQuery || tagFilter.length > 0 
                    ? 'No questions match your search criteria'
                    : 'Be the first to ask a question!'
                  }
                </div>
                {currentUser && (
                  <button
                    onClick={handleAskQuestion}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    🚀 Ask the First Question
                  </button>
                )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {!currentUser && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">👋</span>
                      <div>
                        <p className="text-yellow-800 font-medium">Welcome to StudyHub Q&A!</p>
                        <p className="text-yellow-700 text-sm">Login to ask questions and help other students by answering their questions.</p>
                      </div>
                    </div>
                  </div>
                )}
                {questions.map(question => (
                  <QuestionCard
                    key={question._id || question.id}
                    question={question}
                    currentUser={currentUser}
                    onVote={voteQuestion}
                    onVoteAnswer={voteAnswer}
                    onAddAnswer={handleAddAnswer}
                    expanded={expandedQuestion === (question._id || question.id)}
                    onToggleExpanded={() => setExpandedQuestion(
                      expandedQuestion === (question._id || question.id) ? null : (question._id || question.id)
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {currentUser && (
        <QuestionForm
          isOpen={showQuestionForm}
          onClose={() => setShowQuestionForm(false)}
          onSubmit={addQuestion}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;
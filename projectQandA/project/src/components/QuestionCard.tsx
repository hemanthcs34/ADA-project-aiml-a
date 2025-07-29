import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Calendar, User, FileText } from 'lucide-react';
import { Question, Answer, User as UserType } from '../types';

interface QuestionCardProps {
  question: Question;
  currentUser: UserType | null;
  onVote: (questionId: string, vote: 'up' | 'down') => void;
  onVoteAnswer: (questionId: string, answerId: string, vote: 'up' | 'down') => void;
  onAddAnswer: (questionId: string, content: string) => void;
  expanded?: boolean;
  onToggleExpanded?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentUser,
  onVote,
  onVoteAnswer,
  onAddAnswer,
  expanded = false,
  onToggleExpanded
}) => {
  const [newAnswer, setNewAnswer] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    // Block answers that look like logs or code
    if (/POST \/api\/answers|headers:|body:|\{\s*content:/.test(newAnswer)) {
      alert('Please enter a real answer, not logs or code!');
      return;
    }
    if (newAnswer.trim() && currentUser) {
      onAddAnswer(question._id || question.id, newAnswer.trim());
      setNewAnswer('');
      setShowAnswerForm(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 
            className={`text-lg font-semibold text-gray-900 mb-2 ${onToggleExpanded ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
            onClick={onToggleExpanded}
          >
            {question.title}
            {!expanded && (
              <span className="ml-2 text-sm text-blue-600 font-normal">
                (Click to view details and add answer)
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{question.author ? question.author.username : 'Anonymous'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(question.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{(question.answers || []).length} answers</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {(question.tags || []).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onVote(question._id || question.id, 'up')}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-green-50 transition-colors"
            disabled={!currentUser}
          >
            <ThumbsUp className="h-4 w-4 text-green-600" />
            <span className="text-sm">{question.upvotes}</span>
          </button>
          <button
            onClick={() => onVote(question._id || question.id, 'down')}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            disabled={!currentUser}
          >
            <ThumbsDown className="h-4 w-4 text-red-600" />
            <span className="text-sm">{question.downvotes}</span>
          </button>
          <div className="text-sm font-medium text-gray-700">
            Score: {question.score}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t pt-4">
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700">{question.content}</p>
          </div>

          {question.attachments && question.attachments.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Attachments:</h4>
              <div className="space-y-2">
                {question.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{attachment.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">
              Answers {(question.answers || []).length}
            </h4>
            
            {(question.answers || []).map((answer: Answer) => (
              <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{answer.author ? answer.author.username : 'Anonymous'}</span>
                    <span>•</span>
                    <span>{formatDate(answer.createdAt)}</span>
                    {answer.isAccepted && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        ✓ Accepted
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onVoteAnswer(question.id, answer.id, 'up')}
                      className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                      disabled={!currentUser}
                    >
                      <ThumbsUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs">{answer.upvotes}</span>
                    </button>
                    <button
                      onClick={() => onVoteAnswer(question.id, answer.id, 'down')}
                      className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      disabled={!currentUser}
                    >
                      <ThumbsDown className="h-3 w-3 text-red-600" />
                      <span className="text-xs">{answer.downvotes}</span>
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                </div>
              </div>
            ))}

            {currentUser && (
              <div className="mt-4">
                {!showAnswerForm ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm mb-3">
                      💡 Know the answer? Help your fellow students by sharing your knowledge!
                    </p>
                    <button
                      onClick={() => setShowAnswerForm(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      ✍️ Write an Answer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitAnswer} className="space-y-3">
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Write your answer..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      required
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Submit Answer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAnswerForm(false);
                          setNewAnswer('');
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
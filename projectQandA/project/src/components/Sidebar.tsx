import React from 'react';
import { Filter, Tag as TagIcon, TrendingUp } from 'lucide-react';
import { Tag } from '../types';

interface SidebarProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  sortBy: 'score' | 'newest' | 'oldest';
  onSortChange: (sort: 'score' | 'newest' | 'oldest') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-screen sticky top-0 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sort by:</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'score' | 'newest' | 'oldest')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="score">Highest Score</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <TagIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
        </div>
        
        <div className="space-y-2">
          {tags.map(tag => (
            <button
              key={tag.name}
              onClick={() => onTagToggle(tag.name)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedTags.includes(tag.name)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{tag.name}</span>
                <span className="text-xs text-gray-500">{tag.count}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-900">Quick Stats</h3>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div>Total Questions: {tags.reduce((sum, tag) => sum + tag.count, 0)}</div>
          <div>Active Tags: {tags.length}</div>
          <div>Most Popular: {tags.length > 0 ? tags[0].name : 'None'}</div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 overflow-x-auto py-4 scrollbar-hide">
          {loading ? (
            <div className="flex space-x-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-6 py-2.5 rounded-lg font-body font-semibold text-sm transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                  selectedCategory === 'all'
                    ? 'bg-secondary text-white shadow-lg'
                    : 'bg-white text-black border-2 border-gray-300 hover:border-secondary'
                }`}
              >
                All Items
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-6 py-2.5 rounded-lg font-body font-semibold text-sm transition-all duration-300 flex items-center space-x-2 whitespace-nowrap transform hover:scale-105 ${
                    selectedCategory === c.id
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-white text-black border-2 border-gray-300 hover:border-secondary'
                  }`}
                >
                  <span className="text-lg">{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;

import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-white shadow-md border-b-2 border-gray-200 md:hidden">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-lg mr-3 transition-all duration-300 font-body font-semibold text-sm ${
              activeCategory === category.id
                ? 'bg-secondary text-white shadow-lg'
                : 'bg-white text-black border-2 border-gray-300 hover:border-secondary'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;

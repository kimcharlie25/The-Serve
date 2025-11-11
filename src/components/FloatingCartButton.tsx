import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onCartClick }) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-8 right-8 bg-secondary hover:bg-accent-dark text-white p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-40 md:hidden border-2 border-white"
    >
      <div className="relative">
        <ShoppingCart className="h-7 w-7" />
        <span className="absolute -top-3 -right-3 bg-black text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center font-body animate-bounce">
          {itemCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;

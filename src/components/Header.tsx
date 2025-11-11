import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200"
          >
            {loading ? (
              <div className="w-16 h-12 bg-gray-300 rounded animate-pulse" />
            ) : (
              <img 
                src={siteSettings?.site_logo || "/logo.jpg"} 
                alt={siteSettings?.site_name || "The Serve"}
                className="w-16 h-12 rounded object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <h1 className="text-2xl font-heading font-bold text-black tracking-wide">
              {loading ? (
                <div className="w-24 h-6 bg-gray-300 rounded animate-pulse" />
              ) : (
                ""
              )}
            </h1>
          </button>

          <button 
            onClick={onCartClick}
            className="relative bg-secondary hover:bg-accent-dark text-white p-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

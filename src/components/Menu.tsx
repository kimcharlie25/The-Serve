import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);
      
      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <main className="pb-16">
      {/* Event Catering Section */}
      <div className="text-center mb-16">
        <div className="w-full bg-secondary p-6 sm:p-8">
          <h3 className="text-2xl sm:text-4xl font-heading font-bold text-black mb-6 mt-8">
            PERFECT ADDITION TO YOUR SPECIAL DAY!
          </h3>
          
          <p className="text-sm sm:text-base font-body text-gray-900 mb-6">
            Birthdays, Wedding, Reunions, School Events, Corporate Events, Small Gathering etc.
          </p>
          
          
            <p className="text-base sm:text-lg font-body font-semibold text-black mb-4">
              Inclusions:
            </p>
            <ul className="space-y-2 text-left max-w-2xl mx-auto font-body text-gray-900 text-sm sm:text-base mb-8">
              <li>• Coffee Cart Set-up</li>
              <li>• Menu Board</li>
              <li>• Custom Event Signage</li>
              <li>• Customized Claiming Stub (to be provided before the event starts)</li>
            </ul>
            <div className="border-t border-black/20 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8 max-w-4xl mx-auto">
              <div className="text-left md:text-center">
                <p className="text-base sm:text-lg font-body font-semibold text-black mb-4">
                  ADDITIONALS:
                </p>
                <ul className="space-y-2 font-body text-gray-900 text-sm sm:text-base md:inline-block md:text-left">
                  <li>+ 1 Hour - P500</li>
                  <li>+ 10 Cups - P1,000</li>
                </ul>
              </div>

              <div className="text-left md:text-center">
                <p className="text-base sm:text-lg font-body font-semibold text-black mb-4">
                  TRANSPORTATION FEE:
                </p>
                <ul className="space-y-2 font-body text-gray-900 text-sm sm:text-base md:inline-block md:text-left">
                  <li>Nearby Areas (Bulacan) - FREE</li>
                  <li>Other Areas - starts at P1,000<br/><span className="text-xs">(depends on location)</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category === category.id);
        
        if (categoryItems.length === 0) return null;
        
        return (
          <section key={category.id} id={category.id} className="mb-20">
            <div className="flex items-center mb-10 pb-4 border-b-2 border-secondary">
              <span className="text-4xl mr-4">{category.icon}</span>
              <h3 className="text-4xl font-heading font-bold text-black">{category.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryItems.map((item) => {
                const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    quantity={cartItem?.quantity || 0}
                    onUpdateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
      </div>
      </main>
    </>
  );
};

export default Menu;

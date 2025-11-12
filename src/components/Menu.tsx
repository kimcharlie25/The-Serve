import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useSiteSettings } from '../hooks/useSiteSettings';
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
  const { siteSettings } = useSiteSettings();
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
      {/* Hero Image Section */}
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-gray-200">
        <img 
          src={siteSettings?.hero_image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=80"} 
          alt={siteSettings?.site_name || "The Serve"} 
          className="w-full h-full object-cover"
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

      {/* Gallery Section */}
      {siteSettings?.gallery_images && siteSettings.gallery_images.length > 0 && (
        <section className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-black mb-4">Gallery</h2>
            <p className="text-gray-700 font-body text-lg">Moments from our events and celebrations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {siteSettings.gallery_images.map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 group">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}
      </main>

      {/* Bottom Banner Section */}
      {siteSettings?.bottom_banner_image && (
        <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-gray-200">
          <img 
            src={siteSettings.bottom_banner_image} 
            alt="Bottom Banner" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );
};

export default Menu;

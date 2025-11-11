import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart, 
  quantity, 
  onUpdateQuantity 
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn => 
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);
      
      if (quantity === 0) {
        return prev.filter(a => a.id !== addOn.id);
      }
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group border-2 border-transparent hover:border-secondary h-full flex flex-col ${!item.available ? 'opacity-60' : ''}`}>
        {/* Image Container */}
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
            <div className="text-7xl opacity-10 text-gray-400">🍽️</div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl">
                SALE
              </div>
            )}
            {item.popular && (
              <div className="bg-secondary text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl">
                ⭐ POPULAR
              </div>
            )}
          </div>
          
          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-black text-sm font-bold px-6 py-3 rounded-full">
                UNAVAILABLE
              </span>
            </div>
          )}
          
          {item.isOnDiscount && item.discountPrice && (
            <div className="absolute bottom-4 right-4 bg-secondary text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg">
              {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-xl font-heading font-bold text-black leading-tight flex-1 pr-2">{item.name}</h4>
            {item.variations && item.variations.length > 0 && (
              <div className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap font-body font-medium">
                {item.variations.length} sizes
              </div>
            )}
          </div>
          
          <div className={`text-sm mb-6 leading-relaxed font-body ${!item.available ? 'text-gray-400' : 'text-gray-700'}`}>
            {!item.available ? 'Currently Unavailable' : item.description.split('\n').map((line, index) => (
              <p key={index} className="mb-1">
                {line}
              </p>
            ))}
          </div>
          
          {/* Pricing Section */}
          <div className="flex items-center justify-between mb-5 mt-auto">
            <div className="flex-1">
              {item.isOnDiscount && item.discountPrice ? (
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-black font-heading">
                      ₱{item.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-base text-gray-500 line-through font-body">
                      ₱{item.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-secondary font-body font-semibold">
                    Save ₱{(item.basePrice - item.discountPrice).toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-black font-heading">
                  ₱{item.basePrice.toFixed(2)}
                </div>
              )}
              
              {item.variations && item.variations.length > 0 && (
                <div className="text-xs text-gray-500 mt-2 font-body">
                  Starting price
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0">
              {!item.available ? (
                <button
                  disabled
                  className="bg-gray-300 text-gray-600 px-6 py-3 rounded-xl cursor-not-allowed font-body font-semibold text-sm"
                >
                  Unavailable
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-secondary hover:bg-accent-dark text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-body font-bold text-sm shadow-lg"
                >
                  {item.variations?.length || item.addOns?.length ? 'Customize' : 'Add'}
                </button>
              ) : (
                <div className="flex items-center space-x-2 bg-secondary/20 rounded-xl p-1.5 border-2 border-secondary">
                  <button
                    onClick={handleDecrement}
                    className="p-2 hover:bg-secondary/30 rounded-lg transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-black" />
                  </button>
                  <span className="font-bold text-black min-w-[32px] text-center font-body">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2 hover:bg-secondary/30 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-black" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons indicator */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg font-body">
              <span>+</span>
              <span>{item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''} available</span>
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="text-2xl font-heading font-bold text-black">Customize {item.name}</h3>
                <p className="text-sm text-gray-600 mt-1 font-body">Choose your preferences</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-heading font-bold text-black text-lg mb-4">Choose Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedVariation?.id === variation.id
                            ? 'border-secondary bg-secondary/10 shadow-md'
                            : 'border-gray-200 hover:border-secondary/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-secondary focus:ring-secondary"
                          />
                          <span className="font-body font-semibold text-black">{variation.name}</span>
                        </div>
                        <span className="text-black font-heading font-bold">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-8">
                  <h4 className="font-heading font-bold text-black text-lg mb-4">Add-ons</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-6">
                      <h5 className="text-sm font-body font-bold text-gray-700 mb-3 capitalize">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-secondary/50 hover:bg-gray-50 transition-all duration-300"
                          >
                            <div className="flex-1">
                              <span className="font-body font-semibold text-black">{addOn.name}</span>
                              <div className="text-sm text-gray-600 font-body">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Free'}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-2 bg-secondary/20 rounded-xl p-1.5 border-2 border-secondary">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-secondary/30 rounded-lg transition-colors duration-200"
                                  >
                                    <Minus className="h-4 w-4 text-black" />
                                  </button>
                                  <span className="font-bold text-black min-w-[28px] text-center font-body">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-secondary/30 rounded-lg transition-colors duration-200"
                                  >
                                    <Plus className="h-4 w-4 text-black" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="flex items-center space-x-1 px-5 py-2 bg-secondary hover:bg-accent-dark text-white rounded-xl transition-all duration-300 text-sm font-body font-bold shadow-lg"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t-2 border-gray-200 pt-6 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-body font-bold text-gray-700">Total:</span>
                  <span className="text-3xl font-heading font-bold text-black">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-secondary hover:bg-accent-dark text-white py-4 rounded-xl transition-all duration-300 font-body font-bold text-lg flex items-center justify-center space-x-3 shadow-lg transform hover:scale-105"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Add to Cart - ₱{calculatePrice().toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;

import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-4xl font-heading font-bold text-black mb-3">Your cart is empty</h2>
          <p className="text-gray-600 font-body text-lg mb-8">Start adding some delicious items!</p>
          <button
            onClick={onContinueShopping}
            className="bg-secondary hover:bg-accent-dark text-white px-8 py-4 rounded-xl transition-all duration-300 font-body font-bold text-lg shadow-lg transform hover:scale-105"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors duration-200 font-body font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Continue Shopping</span>
        </button>
        <h1 className="text-4xl font-heading font-bold text-black">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-gray-600 hover:text-black transition-colors duration-200 font-body font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border-2 border-gray-100">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-6 ${index !== cartItems.length - 1 ? 'border-b-2 border-gray-100' : ''} hover:bg-gray-50 transition-colors duration-200`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-heading font-bold text-black mb-2">{item.name}</h3>
                {item.selectedVariation && (
                  <p className="text-sm text-gray-600 font-body mb-1">Size: <span className="font-semibold">{item.selectedVariation.name}</span></p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-sm text-gray-600 font-body mb-2">
                    Add-ons: <span className="font-semibold">{item.selectedAddOns.map(addOn => 
                      addOn.quantity && addOn.quantity > 1 
                        ? `${addOn.name} x${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}</span>
                  </p>
                )}
                <p className="text-lg font-body font-bold text-secondary">₱{item.totalPrice.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center space-x-6 ml-6">
                <div className="flex items-center space-x-3 bg-secondary/20 rounded-xl p-2 border-2 border-secondary">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-secondary/30 rounded-lg transition-colors duration-200"
                  >
                    <Minus className="h-5 w-5 text-black" />
                  </button>
                  <span className="font-bold text-black min-w-[40px] text-center font-body text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-secondary/30 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5 text-black" />
                  </button>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <p className="text-2xl font-heading font-bold text-black">₱{(item.totalPrice * item.quantity).toFixed(2)}</p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-gray-400 hover:text-black hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-secondary">
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
          <span className="text-2xl font-heading font-bold text-gray-700">Total:</span>
          <span className="text-4xl font-heading font-bold text-black">₱{parseFloat(getTotalPrice() || 0).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-secondary hover:bg-accent-dark text-white py-5 rounded-xl transition-all duration-300 transform hover:scale-105 font-body font-bold text-xl shadow-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

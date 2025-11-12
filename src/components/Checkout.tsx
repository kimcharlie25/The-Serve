import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const formattedDate = bookingDate ? new Date(bookingDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';
    
    const orderDetails = `
🛒 The Serve BOOKING

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
📅 Booking Date: ${formattedDate}
🕐 Time: ${bookingTime}


📋 ORDER DETAILS:
${cartItems.map(item => {
  let itemDetails = `• ${item.name}`;
  if (item.selectedVariation) {
    itemDetails += ` (${item.selectedVariation.name})`;
  }
  if (item.selectedAddOns && item.selectedAddOns.length > 0) {
    itemDetails += ` + ${item.selectedAddOns.map(addOn => 
      addOn.quantity && addOn.quantity > 1 
        ? `${addOn.name} x${addOn.quantity}`
        : addOn.name
    ).join(', ')}`;
  }
  itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
  return itemDetails;
}).join('\n')}

💰 TOTAL: ₱${totalPrice}

💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
📸 Payment Screenshot: Please attach your payment receipt screenshot

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing The Serve! ☕
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/theservebrewandbake?text=${encodedMessage}`;
    
    window.open(messengerUrl, '_blank');
    
  };

  const isDetailsValid = customerName && contactNumber && bookingDate && bookingTime;

  if (step === 'details') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center mb-10">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors duration-200 font-body font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-4xl font-heading font-bold text-black ml-8">Booking Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-black mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-body font-semibold text-black">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-sm text-gray-600 font-body">Size: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-gray-600 font-body">
                        Add-ons: {item.selectedAddOns.map(addOn => addOn.name).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 font-body">₱{item.totalPrice} x {item.quantity}</p>
                  </div>
                  <span className="font-heading font-bold text-black text-lg">₱{item.totalPrice * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-heading font-bold text-gray-700">Total:</span>
                <span className="text-3xl font-heading font-bold text-black">₱{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-black mb-6">Customer Information</h2>
            
            <form className="space-y-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-body font-semibold text-black mb-2">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200 font-body"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-body font-semibold text-black mb-2">Contact Number *</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200 font-body"
                  placeholder="09XX XXX XXXX"
                  required
                />
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-sm font-body font-semibold text-black mb-2">Booking Date *</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200 font-body"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 font-body">Select the date for your booking</p>
              </div>

              {/* Booking Time */}
              <div>
                <label className="block text-sm font-body font-semibold text-black mb-2">Booking Time *</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200 font-body"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 font-body">Select your preferred time</p>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-body font-semibold text-black mb-2">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200 font-body"
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-4 rounded-xl font-body font-bold text-lg transition-all duration-300 transform shadow-lg ${
                  isDetailsValid
                    ? 'bg-secondary text-white hover:bg-accent-dark hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center mb-10">
        <button
          onClick={() => setStep('details')}
          className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors duration-200 font-body font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Details</span>
        </button>
        <h1 className="text-4xl font-heading font-bold text-black ml-8">Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
          <h2 className="text-2xl font-heading font-bold text-black mb-6">Choose Payment Method</h2>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-3 font-body ${
                  paymentMethod === method.id
                    ? 'border-secondary bg-secondary text-white shadow-lg'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-secondary'
                }`}
              >
                <span className="text-2xl">💳</span>
                <span className="font-semibold">{method.name}</span>
              </button>
            ))}
          </div>

          {/* Payment Details with QR Code */}
          {selectedPaymentMethod && (
            <div className="bg-secondary/20 rounded-xl p-6 mb-6 border-2 border-secondary">
              <h3 className="font-body font-bold text-black mb-4">Payment Details</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-1 font-body font-semibold">{selectedPaymentMethod.name}</p>
                  <p className="font-mono text-black font-bold">{selectedPaymentMethod.account_number}</p>
                  <p className="text-sm text-gray-700 mb-3 font-body">Account Name: {selectedPaymentMethod.account_name}</p>
                  <p className="text-2xl font-heading font-bold text-black">Amount: ₱{totalPrice}</p>
                </div>
                <div className="flex-shrink-0">
                  <img 
                    src={selectedPaymentMethod.qr_code_url} 
                    alt={`${selectedPaymentMethod.name} QR Code`}
                    className="w-36 h-36 rounded-xl border-2 border-secondary shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                    }}
                  />
                  <p className="text-xs text-gray-600 text-center mt-2 font-body">Scan to pay</p>
                </div>
              </div>
            </div>
          )}

          {/* Reference Number */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
            <h4 className="font-body font-bold text-black mb-2">📸 Payment Proof Required</h4>
            <p className="text-sm text-gray-800 font-body">
              After making your payment, please take a screenshot of your payment receipt and attach it when you send your order via Messenger. This helps us verify and process your order quickly.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
          <h2 className="text-2xl font-heading font-bold text-black mb-6">Final Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-secondary/20 rounded-xl p-4 border-2 border-secondary">
              <h4 className="font-body font-bold text-black mb-3">Booking Details</h4>
              <p className="text-sm text-gray-800 font-body"><span className="font-semibold">Name:</span> {customerName}</p>
              <p className="text-sm text-gray-800 font-body"><span className="font-semibold">Contact:</span> {contactNumber}</p>
              <p className="text-sm text-gray-800 font-body">
                <span className="font-semibold">Date:</span> {bookingDate ? new Date(bookingDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Not selected'}
              </p>
              <p className="text-sm text-gray-800 font-body"><span className="font-semibold">Time:</span> {bookingTime || 'Not selected'}</p>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h4 className="font-body font-semibold text-black">{item.name}</h4>
                  {item.selectedVariation && (
                    <p className="text-sm text-gray-600 font-body">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-sm text-gray-600 font-body">
                      Add-ons: {item.selectedAddOns.map(addOn => 
                        addOn.quantity && addOn.quantity > 1 
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 font-body">₱{item.totalPrice} x {item.quantity}</p>
                </div>
                <span className="font-heading font-bold text-black text-lg">₱{item.totalPrice * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t-2 border-gray-200 pt-6 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-heading font-bold text-gray-700">Total:</span>
              <span className="text-3xl font-heading font-bold text-black">₱{totalPrice}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-5 rounded-xl font-body font-bold text-xl transition-all duration-300 transform bg-secondary text-white hover:bg-accent-dark hover:scale-105 shadow-lg"
          >
            Confirm Booking via Messenger
          </button>
          
          <p className="text-xs text-gray-600 text-center mt-4 font-body">
            You'll be redirected to Facebook Messenger to confirm your booking. Don't forget to attach your payment screenshot!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

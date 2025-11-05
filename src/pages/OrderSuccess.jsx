import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get the latest order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) {
      const latestOrder = orders[orders.length - 1];
      setOrderDetails(latestOrder);
    } else {
      // If no order found, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (!orderDetails) {
    return (
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        {/* Order Details Card */}
       

        {/* Payment Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-green-800 font-medium">Payment Successful</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your payment has been processed successfully. You will receive an email confirmation shortly.
          </p>
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center">
          <button
            onClick={handleContinueShopping}
            className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}

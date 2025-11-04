import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectTotalPrice, selectDiscountPercentage, selectDiscountedTotal, removeFromCart, updateQuantity, applyDiscount, removeDiscount } from '../redux/cartSlice';

export default function Cart() {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const discountPercentage = useSelector(selectDiscountPercentage);
  const discountedTotal = useSelector(selectDiscountedTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value);
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      dispatch(applyDiscount(couponCode.trim().toUpperCase()));
      setCouponApplied(true);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeDiscount());
    setCouponCode('');
    setCouponApplied(false);
  };

  return (
    <main className="flex-grow p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8">Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="bg-zinc-950 rounded-lg shadow-md p-6 md:p-8 text-center">
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
            <p className="text-gray-500 mt-2">Add some delicious coffee to get started!</p>
            <a
              href="/products"
              className="inline-block mt-4 bg-brown-600 text-white py-2 px-6 rounded-md hover:bg-brown-700 transition-colors duration-200"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-zinc-900 rounded-lg shadow-md p-4 flex items-center space-x-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm md:text-lg font-semibold truncate">{item.title}</h3>
                    <p className="text-cyan-500 text-xs md:text-sm">{item.category}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <label htmlFor={`quantity-${item.id}`} className="text-xs md:text-sm font-medium">Qty:</label>
                      <input
                        type="number"
                        id={`quantity-${item.id}`}
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-12 md:w-16 px-1 md:px-2 py-1 border border-gray-300 rounded-md text-center text-xs md:text-sm"
                      />
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-800 hover:text-red-600 text-xs md:text-sm font-medium bg-slate-200 p-1 md:p-2 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-green-600 flex-shrink-0">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Order Summary - Below */}
            <div className="w-full">
              <div className="bg-zinc-900 rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Summary :</h3>

                {/* Coupon Code Section */}
                <div className="mb-4">
                  <label htmlFor="coupon" className="block text-sm font-medium mb-2">Have a coupon?</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={couponApplied}
                    />
                    {!couponApplied ? (
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {couponApplied && discountPercentage > 0 && (
                    <p className="text-green-500 text-sm mt-1">Coupon applied! {discountPercentage}% discount</p>
                  )}
                </div>

                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount ({discountPercentage}%):</span>
                      <span>-${((totalPrice * discountPercentage) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{discountedTotal > 50 ? 'FREE' : '$9.99'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${(discountedTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${(discountedTotal + discountedTotal * 0.08 + (discountedTotal > 50 ? 0 : 9.99)).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mx-auto block bg-slate-50 text-slate-900 py-1 px-3 rounded-md hover:bg-lime-600 transition-colors duration-200 text-sm font-semibold mt-4"
                >
                  Proceed to checkout!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

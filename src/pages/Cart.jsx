// src/pages/Cart.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  selectCartItems,
  selectTotalPrice,
  removeCart,
  updateCart,
  fetchCart,
} from "../redux/cartSlice";
import { selectAuthUser } from "../redux/authSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const user = useSelector(selectAuthUser);

  // Fetch cart on mount if authenticated
  useEffect(() => {
    if (user) {
      dispatch(fetchCart()).catch((err) => {
        console.error("Failed to load cart:", err);
      });
    }
  }, [user, dispatch]);

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value);
    if (quantity > 0) {
      dispatch(updateCart({ cartId: id, quantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeCart(id));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <main className="flex-grow p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="bg-zinc-950 rounded-lg shadow-md p-6 md:p-8 text-center">
            <p className="text-orange-200 text-lg">Your cart is empty!! 🛒</p>
            <p className="text-gray-500 mt-2">Add some awesome products to get started!</p>
            <Link
              to="/products"
              className="inline-block mt-4 bg-brown-600 hover:bg-neutral-800 text-white py-2 px-6 rounded-md transition-colors duration-200"
            >
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.cartId}-${item.productId}-${index}`}
                  className="bg-zinc-900 rounded-lg shadow-md p-4 flex items-center space-x-4"
                >
                  <img
                    src={item.thumbnail || "/fallback.png"}
                    alt={item.title}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm md:text-lg font-semibold truncate">{item.title}</h3>
                    <p className="text-cyan-500 text-xs md:text-sm">{item.category}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <label htmlFor={`quantity-${item.cartId}`} className="text-xs md:text-sm font-medium">
                        Qty:
                      </label>
                      <input
                        type="number"
                        id={`quantity-${item.cartId}`}
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.cartId, e.target.value)}
                        className="w-12 md:w-16 px-1 md:px-2 py-1 border border-gray-300 rounded-md text-center text-xs md:text-sm"
                      />
                      <button
                        onClick={() => handleRemoveItem(item.cartId)}
                        className="text-red-800 hover:text-red-600 text-xs md:text-sm font-medium bg-slate-200 p-1 md:p-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-green-600 flex-shrink-0">
                    ₹{Number(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full">
              <div className="bg-zinc-900 rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Summary :</h3>
                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{totalPrice > 50 ? "FREE" : "₹9.99"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>₹{(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>
                      ₹{(totalPrice + totalPrice * 0.08 + (totalPrice > 50 ? 0 : 9.99)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleCheckout}
                    className="bg-slate-50 text-slate-900 py-2 px-6 rounded-md hover:bg-lime-600 transition-colors duration-200 text-sm font-semibold"
                  >
                    Proceed to checkout!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

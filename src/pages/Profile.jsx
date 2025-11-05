import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

export default function Profile() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = wishlistItems.slice(startIndex, endIndex);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product }));
    toast.success('Added to cart!');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Load user details from localStorage
    const storedDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    setUserDetails(prev => ({ ...prev, ...storedDetails }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reload from localStorage to revert changes
    const storedDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    setUserDetails(prev => ({ ...prev, ...storedDetails }));
    setIsEditing(false);
  };

  return (
    <main className="flex-grow p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">My Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Details */}
          <div className="bg-zinc-900 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-neutral-200 text-slate-700 py-2 px-4 rounded-md hover:bg-blue-700 hover:text-slate-100 transition-colors duration-200"
                >
                  Edit
                </button>
              )}
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={userDetails.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={userDetails.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </form>

            {isEditing && (
              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="bg-zinc-900 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6">My Wishlist</h3>
            {wishlistItems.length === 0 ? (
              <p className="text-gray-400">Your wishlist is empty.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {currentItems.map((item) => (
                    <div key={item.id} className="border border-gray-700 rounded-md p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md mx-auto sm:mx-0"
                        />
                        <div className="flex-grow text-center sm:text-left min-h-[3rem] flex flex-col justify-center">
                          <h4 className="font-semibold line-clamp-2">{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.category}</p>
                          <p className="text-teal-200 font-bold">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 justify-center sm:justify-start items-center">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-xs whitespace-nowrap"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors duration-200 text-xs whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-700 text-white hover:bg-zinc-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

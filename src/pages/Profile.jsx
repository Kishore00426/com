// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_BASE_URL from "../config/api";
import { logout } from "../redux/authSlice";

// ✔️ Backend cart API
import { addToCart, fetchCart } from "../redux/cartSlice";

// Wishlist
import { removeFromWishlistAsync, selectWishlistItems } from "../redux/wishlistSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const reduxUser = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector(selectWishlistItems);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  // Wishlist pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = wishlistItems.slice(startIndex, startIndex + itemsPerPage);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        let json;
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          json = await res.json();
        } else {
          throw new Error("Invalid server response");
        }

        console.log("Profile API response:", json);

        const user = json?.data?.user ?? json?.user ?? json;

        console.log("Extracted user:", user);

        setUserDetails({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: user?.address || "",
          city: user?.city || "",
          zipCode: user?.zipCode ?? user?.zip_code ?? ""
        });

      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // Form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userDetails.name.trim() || !userDetails.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json?.message || "Update failed");
      } else {
        toast.success("Profile updated");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (reduxUser) {
      setUserDetails({
        name: reduxUser.name || "",
        email: reduxUser.email || "",
        phone: reduxUser.phone || "",
        address: reduxUser.address || "",
        city: reduxUser.city || "",
        zipCode: reduxUser.zipCode ?? reduxUser.zip_code ?? ""
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logged out");
  };

  // ✔️ Updated — Move wishlist item to backend cart
  const handleAddToCart = async (item) => {
    try {
      await dispatch(addToCart({ productId: item.productId, quantity: 1 })).unwrap();

      dispatch(removeFromWishlistAsync(item.wishlistId));

      // Refresh cart from backend
      dispatch(fetchCart());

      toast.success("Moved to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">My Profile</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing((s) => !s)}
              className="bg-neutral-200 text-slate-700 py-2 px-4 rounded-md hover:bg-neutral-300"
            >
              {isEditing ? "Editing" : "Edit"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-zinc-900 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={userDetails.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={userDetails.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </form>

            {isEditing && (
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  {saving ? "Saving..." : "Save"}
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
                  {currentItems.map((item) => {
                    const title = item.title || item.name || "Untitled product";
                    const thumbnail =
                      item.productImages?.[0]?.image_url ||
                      item.image_url ||
                      "/placeholder.jpg";
                    const category =
                      item.category ||
                      item.categoryName ||
                      item.category_id ||
                      "Uncategorized";
                    const price = Number(item.price) || 0;

                    return (
                      <div
                        key={item.id}
                        className="border border-gray-700 rounded-md p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                          <img
                            src={
                              thumbnail
                                ? `http://localhost:5000/uploads/${thumbnail}`
                                : "/fallback.png"
                            }
                            alt={title}
                            className="w-16 h-16 object-cover rounded-md mx-auto sm:mx-0"
                          />

                          <div className="flex-grow text-center sm:text-left min-h-[3rem] flex flex-col justify-center">
                            <h4 className="font-semibold line-clamp-2">
                              {title}
                            </h4>
                            <p className="text-sm text-gray-400">{category}</p>
                            <p className="text-teal-200 font-bold">
                              ₹{price.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 justify-center sm:justify-start items-center">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 text-xs"
                            >
                              Move to Cart
                            </button>

                            <button
                              onClick={() =>
                                dispatch(removeFromWishlistAsync(item.wishlistId))
                              }
                              className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-zinc-700 text-white"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50"
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

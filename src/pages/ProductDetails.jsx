import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync, selectWishlistItems } from '../redux/wishlistSlice';
import Loader from '../components/Loader';
import API_BASE_URL from "../config/api";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const wishlistItems = useSelector(selectWishlistItems);
  const user = useSelector((state) => state.auth.user);
  const isInWishlist = (id) => wishlistItems.some(item => item.productId === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product details');

        const json = await response.json();
        const data = json.data;

        // Map backend images to full URLs
        const images = data.images.map(img => ({
          original: `${API_BASE_URL}${img.original}`,
          preview: `${API_BASE_URL}${img.preview}`,
          thumbnail: `${API_BASE_URL}${img.thumbnail}`,
        }));

        setProduct({
          ...data,
          images
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    setQuantity(Math.max(1, parseInt(value) || 1));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity }));
    toast.success(`Added ${quantity} x ${product.title} to cart!`);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    const wishlistItem = wishlistItems.find(item => item.productId === product.id);

    if (wishlistItem) {
      dispatch(removeFromWishlistAsync(wishlistItem.wishlistId));
      toast.success(`${product.title} removed from wishlist!`);
    } else {
      dispatch(addToWishlistAsync(product.id));
      toast.success(`${product.title} added to wishlist!`);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          <Loader />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500">Error: {error}</div>
          <Link to="/products" className="text-blue-500 hover:underline mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto text-center">
          Product not found
        </div>
      </main>
    );
  }

  const selectedImage = product.images[selectedImageIndex];

  return (
    <main className="flex-grow p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/products" className="text-blue-500 hover:underline mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="bg-zinc-950 rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">

            {/* LEFT SIDE IMAGE */}
            <div className="md:w-1/2 relative">
              {/* MAIN IMAGE */}
              <img
                src={selectedImage.original}
                alt={product.title}
                className="w-full h-96 object-contain bg-black cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 p-2 rounded-full ${isInWishlist(product.id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                  }`}
              >
                ♥
              </button>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto p-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.thumbnail}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border ${selectedImageIndex === index ? "border-white border-2" : "border-transparent"
                      }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT SIDE DETAILS */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

              <p className="text-sm text-cyan-500 mb-2">
                Category : {product.categories?.join(", ") ?? "N/A"}
              </p>

              <p className="text-slate-300 mb-4">{product.description}</p>

              <div className="mb-4">
                <p className="text-2xl font-bold text-teal-200">
                  ₹{Number(product.price).toFixed(2)}
                </p>

                {product.discount > 0 && (
                  <p className="text-yellow-400 text-sm">
                    Discount: {Number(product.discount)}%
                  </p>
                )}
              </div>

              <p className="text-sky-400 font-semibold mb-2">
                Brand: {product.brand}
              </p>

              <p className="text-green-400 mb-2">
                {product.availableStock > 0 ? "In Stock" : "Out of Stock"}
              </p>
              <p className="text-sm text-gray-300 mb-4">
                Available Stock: {product.availableStock}
              </p>

              <div className="font-semibold text-emerald-400 mb-4">
                Warranty: {product.warrantyInfo}
              </div>

              <div className="flex items-center justify-between mb-4">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.availableStock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-16 px-2 py-1 border rounded"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-zinc-300 text-slate-900 py-3 px-4 rounded hover:bg-slate-50"
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>

        {isLightboxOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setIsLightboxOpen(false)}
          >
            <img
              src={selectedImage.original}
              className="max-h-[90%] max-w-[90%] object-contain"
              alt="Fullscreen preview"
            />
          </div>
        )}

      </div>
    </main>
  );
}

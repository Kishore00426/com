import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '../redux/wishlistSlice';
import Loader from '../components/Loader';
import ProductFilters from '../components/ProductFilters';
import AddToCartButton from '../components/AddToCartButton';
// import HeartIcon from "../components/HeartIcon";

import API_BASE_URL from "../config/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const isInWishlist = (id) => wishlistItems.some(item => item.id === id);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://com-backend-5gg9.onrender.com/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();

        setProducts(data.data);
        setFilteredProducts(data.data);

        // Backend returns category IDs (numbers)
        const uniqueCategories = [...new Set(data.data.flatMap(p => p.categories))];
        setCategories(uniqueCategories);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const applyFilters = (products, searchTerm, selectedCategory, sortBy) => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter using numeric category IDs
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.categories?.includes(Number(selectedCategory))
      );
    }

    // Sorting (rating removed because backend doesn't support)
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'name':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  useEffect(() => {
    const filtered = applyFilters(products, searchTerm, selectedCategory, sortBy);
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);


  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    dispatch(addToCart({ product, quantity }));
    toast.success(`Added ${quantity} x ${product.title} to cart!`);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      dispatch(removeFromWishlist(product.id));
      toast.success(`${product.title} removed from wishlist!`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`${product.title} added to wishlist!`);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
  };

  if (loading) {
    return (
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">Our Products</h2>
          <Loader />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">Our Products</h2>
          <div className="text-center text-red-600">Error: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">Our Products</h2>

        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          clearFilters={clearFilters}
          filteredCount={filteredProducts.length}
          totalCount={products.length}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-neutral-900 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 relative"
            >
              <img
                src={
                  product.images?.length
                    ? `${API_BASE_URL}${product.images[0].preview}`
                    : "/no-image.png"
                }
                alt={product.title}
                className="w-full h-48 object-contain"
              />


              {/* Wishlist Button */}
              <button
                onClick={() => handleWishlistToggle(product)}
                className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${isInWishlist(product.id)
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                ♥
              </button>

              <div className="p-6">
                <Link
                  to={`/products/${product.id}`}
                  className="text-xl font-semibold hover:text-slate-600 transition-colors block mb-2 truncate"
                >
                  {product.title}
                </Link>

                <p className="text-sm text-cyan-500 mb-2">
                  Category: {product.categories?.join(", ")}
                </p>

                <p className="text-slate-300 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-2xl font-bold text-teal-200 mb-4">
                  ₹{Number(product.price).toFixed(2)}
                </p>

                <AddToCartButton product={product} quantity={quantities[product.id] || 1} />

              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

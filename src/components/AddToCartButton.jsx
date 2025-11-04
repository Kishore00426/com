import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const AddToCartButton = ({ product, quantity = 1, className = '' }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`Added ${quantity} x ${product.title} to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full bg-zinc-300 text-slate-900 py-2 px-4 rounded-md hover:bg-slate-50 focus:outline-none transition-colors duration-200 ${className}`}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;

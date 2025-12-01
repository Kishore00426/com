import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../redux/cartSlice";
import { selectAuthUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddToCartButton = ({ product, quantity = 1 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  const handleAdd = async () => {
    if (!user) {
      toast.error("Please log in to add items to cart.");
      return navigate("/login");
    }

    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      await dispatch(fetchCart());
      toast.success(`Added ${quantity} x ${product.title} to cart!`);
    } catch (err) {
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-zinc-300 text-black px-4 py-2 rounded"
    >
      Add to Cart
    </button>
  );
};


export default AddToCartButton;

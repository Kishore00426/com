import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(form)).unwrap();
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate("/profile");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <main className="flex-grow p-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-zinc-900 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        {/* Register link */}
        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;

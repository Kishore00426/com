// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await dispatch(
        register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        })
      ).unwrap();

      toast.success("Registration successful!");
      navigate("/profile");
    } catch (err) {
      toast.error(err || "Registration failed");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/profile"); // redirect if already logged in
    }
  }, [user, navigate]);

  return (
    <main className="flex-grow p-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-zinc-900 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name & Email */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Passwords */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Address Fields */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </main>
  );
}

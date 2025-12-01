// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../config/api";

// =======================================================
// GET CART ITEMS
// =======================================================
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart`, {
        withCredentials: true,
      });
      return res.data.cart; // backend returns cart array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================================================
// ADD TO CART (backend)
// =======================================================
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue, dispatch }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/cart/add`,
        { productId, quantity },
        { withCredentials: true }
      );

      // After adding — refresh cart
      dispatch(fetchCart());
      return { productId, quantity };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================================================
// UPDATE QUANTITY
// =======================================================
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ cartId, quantity }, { rejectWithValue }) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/cart/update`,
        { cartId, quantity },
        { withCredentials: true }
      );
      return { cartId, quantity };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================================================
// REMOVE ITEM
// =======================================================
export const removeCart = createAsyncThunk(
  "cart/removeCart",
  async (cartId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart/remove/${cartId}`, {
        withCredentials: true,
      });
      return cartId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================================================
// CLEAR CART
// =======================================================
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart/clear`, {
        withCredentials: true,
      });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================================================
// SLICE
// =======================================================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // backend cart items
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD TO CART
      .addCase(addToCart.fulfilled, () => {})

      // UPDATE QUANTITY
      .addCase(updateCart.fulfilled, (state, action) => {
        const { cartId, quantity } = action.payload;
        const item = state.items.find((i) => i.cartId === cartId);
        if (item) item.quantity = quantity;
      })

      // REMOVE ITEM
      .addCase(removeCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.cartId !== action.payload);
      })

      // CLEAR CART
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

// ===================================================================
// SELECTORS (IMPORTANT!)
// ===================================================================

// All cart items
export const selectCartItems = (state) => state.cart.items;

// Count of items in cart (sum of quantities)
export const selectTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

// Just the number of products in cart (not quantity)
export const selectCartCount = (state) => state.cart.items.length;

// Total price
export const selectTotalPrice = (state) =>
  state.cart.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

export default cartSlice.reducer;

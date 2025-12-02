// src/redux/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../config/api";

// =======================================================
// FETCH ORDERS
// =======================================================
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("Not authenticated");
      }

      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data; // backend returns orders array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================================================
// CREATE ORDER
// =======================================================
export const createNewOrder = createAsyncThunk(
  "orders/createNewOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth?.token;
      
      console.log("Auth state:", state.auth);
      console.log("Token:", token);
      
      if (!token) {
        return rejectWithValue("Not authenticated - no token found");
      }

      console.log("Frontend sending orderData:", orderData);

      const res = await axios.post(
        `${API_BASE_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Backend response:", res.data);
      return res.data; // { success, orderId, message }
    } catch (err) {
      console.log("Backend error response:", err.response?.data);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================================================
// FETCH SINGLE ORDER
// =======================================================
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("Not authenticated");
      }

      const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data; // single order
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================================================
// SLICE
// =======================================================
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: false,
    successMessage: null,
  },
  reducers: {
    // Clear success message
    clearOrderSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    // Clear error message
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ORDERS
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE ORDER
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.successMessage = action.payload.message || "Order created successfully";
        state.currentOrder = action.payload;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // FETCH ORDER BY ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// =======================================================
// SELECTORS
// =======================================================
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersSuccess = (state) => state.orders.success;
export const selectOrdersSuccessMessage = (state) => state.orders.successMessage;

export const { clearOrderSuccess, clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;

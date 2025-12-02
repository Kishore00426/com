import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../config/api';

// =======================================================
// ADD TO WISHLIST
// =======================================================
export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.token;
      if (!token) {
        return rejectWithValue('Not authenticated');
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/wishlist/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { productId, success: res.data.success };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// =======================================================
// REMOVE FROM WISHLIST
// =======================================================
export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.token;
      if (!token) {
        return rejectWithValue('Not authenticated');
      }

      await axios.delete(
        `${API_BASE_URL}/api/wishlist/${wishlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return wishlistId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// =======================================================
// FETCH WISHLIST
// =======================================================
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.token;
      if (!token) {
        return rejectWithValue('Not authenticated');
      }

      const res = await axios.get(
        `${API_BASE_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Helper function to load wishlist from localStorage (fallback)
const loadWishlistFromStorage = () => {
  try {
    const savedWishlist = localStorage.getItem('wishlistItems');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
    return [];
  }
};

// Helper function to save wishlist to localStorage (fallback)
const saveWishlistToStorage = (wishlistItems) => {
  try {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlistFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    // Local-only actions (for offline support)
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (!existingItem) {
        state.items.push(product);
      }
      saveWishlistToStorage(state.items);
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveWishlistToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    // FETCH WISHLIST
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ADD TO WISHLIST
    builder.addCase(addToWishlistAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToWishlistAsync.fulfilled, (state, action) => {
      state.loading = false;
      // Item will be fetched fresh from DB
    });
    builder.addCase(addToWishlistAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // REMOVE FROM WISHLIST
    builder.addCase(removeFromWishlistAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter(item => item.wishlistId !== action.payload);
      saveWishlistToStorage(state.items);
    });
    builder.addCase(removeFromWishlistAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.items.some(item => item.productId === productId);
export const selectWishlistLoading = (state) => state.wishlist.loading;

export default wishlistSlice.reducer;

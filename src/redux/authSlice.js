import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  registerUser,
  loginUser,
  fetchProfile,
  AUTH_URL,
} from "../services/authService";

// Load saved data from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

// ---------------------
// Async Thunks
// ---------------------

export const register = createAsyncThunk(
  "auth/register",
  async (body, thunkAPI) => {
    const res = await registerUser(body);
    if (!res.success) return thunkAPI.rejectWithValue(res.message);

    return res.data; // { user, token }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    const res = await loginUser({ email, password });
    if (!res.success) return thunkAPI.rejectWithValue(res.message);

    return res.data; // { user, token }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;

    const res = await fetchProfile(token);
    if (!res.success) return thunkAPI.rejectWithValue(res.message);

    return res.data; // user object
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ token, userDetails }, thunkAPI) => {
    try {
      const res = await axios.put(`${AUTH_URL}/update`, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data.success)
        return thunkAPI.rejectWithValue(res.data.message);

      return res.data.data; // updated user
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

// ---------------------
// Slice
// ---------------------

const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // LOGIN
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // GET PROFILE
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // UPDATE PROFILE
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// ---------------------
export const { logout } = authSlice.actions;

// ✅ Added selector — fixes your AddToCartButton/Header/Profile
export const selectAuthUser = (state) => state.auth.user;

export default authSlice.reducer;

// src/services/authService.js
import axios from "axios";
import API_BASE_URL from "../config/api";

export const AUTH_URL = `${API_BASE_URL}/api/auth`;

// ------------------------
// REGISTER USER
// ------------------------
export const registerUser = async ({ name, email, password, phone, address, city, zipCode }) => {
  try {
    const res = await axios.post(`${AUTH_URL}/register`, {
      name,
      email,
      password,
      phone,
      address,
      city,
      zipCode,
    });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

// ------------------------
// LOGIN USER
// ------------------------
export const loginUser = async ({ email, password }) => {
  try {
    const res = await axios.post(`${AUTH_URL}/login`, { email, password });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

// ------------------------
// FETCH PROFILE
// ------------------------
export const fetchProfile = async (token) => {
  try {
    const res = await axios.get(`${AUTH_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

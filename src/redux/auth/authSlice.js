import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    jwt: localStorage.getItem("jwt") || null,
    user: null,
    status: "idle",
    error: null,
    twoFactorRequired: false,
  },
  reducers: {
    logout: (state) => {
      state.jwt = null;
      state.user = null;
      localStorage.removeItem("jwt");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.jwt = action.payload.jwt;
        localStorage.setItem("jwt", action.payload.jwt);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.twoFactorRequired) {
          state.twoFactorRequired = true;
        } else {
          state.jwt = action.payload.jwt;
          localStorage.setItem("jwt", action.payload.jwt);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
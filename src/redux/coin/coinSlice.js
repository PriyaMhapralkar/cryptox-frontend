import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchCoins = createAsyncThunk(
  "coin/fetchCoins",
  async ({ category = "all", page = 0, size = 20 }) => {
    const res = await axiosInstance.get(
      `/coins?category=${category}&page=${page}&size=${size}`
    );
    return res.data;
  }
);

export const fetchCoinCount = createAsyncThunk("coin/fetchCoinCount", async () => {
  const res = await axiosInstance.get("/coins/count");
  return res.data;
});

export const fetchCoinChart = createAsyncThunk(
  "coin/fetchCoinChart",
  async ({ coinId, days = 1 }) => {
    const res = await axiosInstance.get(`/coins/${coinId}/chart?days=${days}`);
    return res.data;
  }
);

const coinSlice = createSlice({
  name: "coin",
  initialState: {
    coins: [],
    status: "idle",
    category: "all",
    page: 0,
    pageSize: 20,
    totalCoins: 0,
    btcChart: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 0;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coins = action.payload;
      })
      .addCase(fetchCoinCount.fulfilled, (state, action) => {
        state.totalCoins = action.payload;
      })
      .addCase(fetchCoinChart.fulfilled, (state, action) => {
        state.btcChart = action.payload;
      });
  },
});

export const { setCategory, setPage } = coinSlice.actions;
export default coinSlice.reducer;
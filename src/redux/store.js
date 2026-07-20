import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import coinReducer from "./coin/coinSlice";
import { injectStore } from "./storeRegistry";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    coin: coinReducer,
  },
});

injectStore(store);
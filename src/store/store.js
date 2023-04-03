import { configureStore } from "@reduxjs/toolkit";
import ketReducer from "./keySlice";
import loginSlice from "./loginSlice.js";

export default configureStore({
  reducer: {
    key: ketReducer,
    login: loginSlice,
  },
});

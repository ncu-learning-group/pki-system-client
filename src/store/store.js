import { configureStore } from "@reduxjs/toolkit";
import ketReducer from "./keySlice";
import loginSlice from "./loginSlice.js";
import messagesSlice from "./messagesSlice.js";

export default configureStore({
  reducer: {
    key: ketReducer,
    login: loginSlice,
    message: messagesSlice,
  },
});

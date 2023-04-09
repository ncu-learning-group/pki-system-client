import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    firstIn: false,
    userId: "",
    userName: "",
    isAdmin: true,
  },
  reducers: {
    setFirstIn: (state, action) => {
      state.firstIn = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { setFirstIn, setUserId, setUserName, setIsAdmin } =
  loginSlice.actions;

export default loginSlice.reducer;

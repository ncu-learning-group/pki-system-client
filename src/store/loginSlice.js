import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    firstIn: false,
    userName: "",
  },
  reducers: {
    setFirstIn: (state, action) => {
      state.firstIn = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { setFirstIn, setUserName } = loginSlice.actions;

export default loginSlice.reducer;

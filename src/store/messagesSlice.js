import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
  name: "login",
  initialState: {
    messages: ["Sample1", "Sample2"],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { setMessages } = messagesSlice.actions;

export default messagesSlice.reducer;

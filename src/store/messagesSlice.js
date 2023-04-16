import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
  name: "login",
  initialState: {
    messages: ["Sample1", "Sample2"],
    informationBoardType: "ALL",
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setInformationBoardType: (state, action) => {
      state.informationBoardType = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { setMessages, setInformationBoardType } = messagesSlice.actions;

export default messagesSlice.reducer;

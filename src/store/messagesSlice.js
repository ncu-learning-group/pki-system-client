import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
  name: "message",
  initialState: {
    texts: ["Sample1", "Sample2"],
    pictures: ["default-image.jpg", "default-image.jpg"],
    informationBoardType: "ALL",
  },
  reducers: {
    setTexts: (state, action) => {
      state.texts = action.payload;
    },
    setPictures: (state, action) => {
      state.pictures = action.payload;
    },
    setInformationBoardType: (state, action) => {
      state.informationBoardType = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { setTexts, setPictures, setInformationBoardType } =
  messagesSlice.actions;

export default messagesSlice.reducer;

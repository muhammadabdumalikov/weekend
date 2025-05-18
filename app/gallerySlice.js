import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [],
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setImages: (state, action) => {
      state.images = action.payload;
    },
  },
});

export const { setImages } = gallerySlice.actions;
export default gallerySlice.reducer;

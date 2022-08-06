import { createSlice } from "@reduxjs/toolkit";

export const pickSlice = createSlice({
  name: "pick",
  initialState: {
    ready: false,
  },
  reducers: {
    ready: (state) => {
      state.ready = true;
    },
    unready: (state) => {
      state.ready = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ready, unready } = pickSlice.actions;

export default pickSlice.reducer;

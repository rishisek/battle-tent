import { createSlice } from "@reduxjs/toolkit";

export const pickSlice = createSlice({
  name: "pick",
  initialState: {
    ready: false,
    confirm: false,
  },
  reducers: {
    ready: (state) => {
      state.ready = true;
    },
    confirm: (state) => {
      state.confirm = true;
    },
    pick: (state) => {
      state.confirm = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ready, confirm, pick } = pickSlice.actions;

export default pickSlice.reducer;

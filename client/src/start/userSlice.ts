import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "pick",
  initialState: {
    username: "",
  },
  reducers: {
    setStateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStateUsername } = userSlice.actions;

export default userSlice.reducer;

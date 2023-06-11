import { configureStore } from "@reduxjs/toolkit";
import pickReducer from "pick/pickSlice";
import userReducer from "start/userSlice";

const store = configureStore({
  reducer: {
    pick: pickReducer,
    user: userReducer
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

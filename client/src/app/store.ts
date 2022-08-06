import { configureStore } from "@reduxjs/toolkit";
import pickReducer from "../pick/pickSlice";

const store = configureStore({
  reducer: {
    pick: pickReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

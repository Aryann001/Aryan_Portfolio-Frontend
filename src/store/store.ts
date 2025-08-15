import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/reducers/userReducers";
import loadingReducer from "@/reducers/loadingReducer";
import projectReducer from "@/reducers/productsReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    projects: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

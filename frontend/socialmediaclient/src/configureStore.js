import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./features/auth";
import postsReducer from "./features/posts";
import userpostsReducer from "./features/userposts";
import notificationsReducer from "./features/notifications";
import localforage from "localforage";

const persistConfig = {
  key: "root",
  storage: localforage,
  whitelist: ["auth", "posts", "userposts", "notifications"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  userposts: userpostsReducer,
  notifications: notificationsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

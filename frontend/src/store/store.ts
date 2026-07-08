// store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userReducer from "./slice/user-slice";
import cartReducer from './slice/cartSlice'
import wishlistReducer from './slice/wishlistSlice'
import checkoutReducer from './slice/checkoutSlice'
// --- persist config ---
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "isEmailVerified", "isLoggedIn"],
};
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ['items'],
};
const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};
const checkoutPersistConfig={
  key:"checkout",
  storage
}


const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig,checkoutReducer)
// --- store setup ---
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,//No persist Reducer wrapper
    user: persistedUserReducer,
  cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    checkout:persistedCheckoutReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

// --- for RTK Query auto refetchonfocus,refetchOnReconnect ---
setupListeners(store.dispatch);

// --- persist store ---
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

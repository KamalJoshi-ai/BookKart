import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  _id: string;
 products:string[];
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<any>) => {
      state.items = action.payload;
    },

  addToWishlist: (state, action: PayloadAction<string>) => {
  const productId = action.payload

  const existing = state.items.find(item =>
    item.products.includes(productId)
  )

  if (!existing) {
    state.items.push({
      _id: crypto.randomUUID(),
      products: [productId]
    })
  }
},

removeFromWishlist: (state, action: PayloadAction<string>) => {
  state.items.forEach((item) => {
    item.products = item.products.filter(
      (product) => product !== action.payload
    );
  });
},
    clearWishlist: () => initialState,
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
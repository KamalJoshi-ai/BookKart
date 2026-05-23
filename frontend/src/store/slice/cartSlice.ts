import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
    _id:string,
  user: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
}

const initialState: CartState = {
    _id:"",
  user: "",
  items: [],
  createdAt: "",
  updatedAt: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload };
    },

    addToCart: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload };
    },

    clearCart: () => initialState,
  },
});

export const { setCart, addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// checkout steps
export type CheckoutStep = "cart" | "address" | "payment";


// state interface
export interface CheckoutState {
  orderId: string | null;
  orderAmount: number;
  step: CheckoutStep;
}


// initial state
const initialState: CheckoutState = {
  orderId: null,
  orderAmount: 0,
  step: "cart",
};


const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {

    // set order id
    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },

    // set order amount
    setOrderAmount: (state, action: PayloadAction<number>) => {
      state.orderAmount = action.payload;
    },

    // change checkout step
    setCheckoutStep: (state, action: PayloadAction<CheckoutStep>) => {
      state.step = action.payload;
    },

    // reset checkout
    resetCheckout: (state) => {
      state.orderId = null;
      state.orderAmount = 0;
      state.step = "cart";
    },

  },
});


export const {
  setOrderId,
  setOrderAmount,
  setCheckoutStep,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
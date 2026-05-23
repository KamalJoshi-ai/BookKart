import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserState {
  user: any | null;
  isEmailVerified: boolean;
  isLoginDialogOpen: boolean;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isEmailVerified: false,
  isLoginDialogOpen: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    closeLoginDialog: (state) => {
      state.isLoginDialogOpen = false;
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    logout: () => initialState,
    toggleLoginDialog: (state) => {
      state.isLoginDialogOpen = !state.isLoginDialogOpen;
    },
    authStatus: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
  },
});

export const { setUser, setEmailVerified, logout, toggleLoginDialog, authStatus, closeLoginDialog } =
  userSlice.actions;
export default userSlice.reducer;
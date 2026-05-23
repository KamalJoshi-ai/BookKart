"use client";

import BookLoader from "@/lib/BookLoader";
import { store,persistor } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {Toaster} from "react-hot-toast"
import AuthCheck from "@/store/Provider/authProvider";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>      
        <PersistGate loading={<BookLoader/>} persistor={persistor}>
        <Toaster />
        <AuthCheck>
             {children}
        </AuthCheck>
           
        </PersistGate>
    </Provider>
    );
};

"use client";

import { useVerifyAuthQuery } from "../api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { authStatus, logout, setEmailVerified, setUser } from "../slice/user-slice";
import BookLoader from "@/lib/BookLoader";
import { usePathname } from "next/navigation";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  // Query to verify auth with backend
  const { data, error, isLoading } = useVerifyAuthQuery(undefined,{refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
    });

  const protectedRoutes = ['/checkout', '/account', '/seller', '/book-sell'];
  const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    const publicRoutes = ['/reset-password', '/login', '/signup', '/forgot-password'];
    const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

    // Skip auth check for public routes
    if (isPublicRoute) {
      setIsCheckingAuth(false);
      return;
    }

    // Query finished - save user or logout
    if (data) {
      dispatch(setUser(data?.data?.user));
      dispatch(setEmailVerified(data?.data?.user?.isVerified));
      dispatch(authStatus(true));
    } else if (error) {
      dispatch(logout());
    }

    setIsCheckingAuth(false);
  }, [ data, error, pathname, dispatch]);

  // Show loader while checking auth only on protected routes
  if (isProtectedRoute && (isCheckingAuth || isLoading)) {
    return <BookLoader />;
  }

  return <>{children}</>;
}
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { 
  Search, 
  ShoppingCart, 
  User, 
  ChevronRight, 
  ChevronDown, 
  LogOut, 
  Package, 
  Heart, 
  Store, 
  FileText, 
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { useGetCartQuery, useLogoutMutation } from "@/store/api";
import { toggleLoginDialog, logout } from "@/store/slice/user-slice";
import { clearCart, setCart } from "@/store/slice/cartSlice";
import { clearWishlist } from "@/store/slice/wishlistSlice";
import { resetCheckout } from "@/store/slice/checkoutSlice";
import { RootState, AppDispatch } from "@/store/store";
import AuthPage from "./AuthPage";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const isLoginOpen = useSelector((state: RootState) => state.user.isLoginDialogOpen);
  const cartCount = useSelector((state: RootState) => state.cart?.items?.length || 0);

  const { data: cartData } = useGetCartQuery(user?._id, { skip: !user?._id });
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/books?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/books");
    }
  };

  const handleLogOut = async () => {
    try {
      await logoutApi(undefined).unwrap();
      dispatch(logout());
      dispatch(clearCart());
      dispatch(clearWishlist());
      dispatch(resetCheckout());
      setIsMenuOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const handleProtectedNavigation = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      dispatch(toggleLoginDialog());
    }
    setIsMenuOpen(false);
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-1.5 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo matching Image 2 */}
          <Link href="/" className="flex flex-col shrink-0">
            <span className="font-extrabold text-2xl tracking-tight text-gray-900 font-sans">
              BookKart<span className="text-red-500">.</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium -mt-1 tracking-widest">
              books for you
            </span>
          </Link>
        </div>

        {/* Center: Search Bar matching Image 2 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden sm:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, or subjects..."
              className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Actions matching Image 2 */}
        <div className="flex items-center gap-4">
          
          {/* Yellow Sell Used Book Button */}
          <Link href="/book-sell" className="hidden sm:block">
            <button className="bg-[#ffe500] hover:bg-yellow-400 text-gray-900 font-bold text-xs px-5 py-2.5 rounded-lg shadow-xs transition cursor-pointer">
              Sell Used Book
            </button>
          </Link>

          {/* User Account / Login Button */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold text-xs py-1 px-2 rounded-md hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {initial}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">My Account</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
            ) : (
              <button
                onClick={() => dispatch(toggleLoginDialog())}
                className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 font-semibold text-xs py-1.5 px-3 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}

            {/* Dropdown Menu matching Image 2 EXACTLY */}
            {isMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-xs font-mono">
                
                {/* Header User Box */}
                <div className="px-5 py-3.5 flex items-center gap-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="py-1">
                  <button
                    onClick={() => handleProtectedNavigation("/account/profile")}
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 text-gray-700 transition"
                  >
                    <span className="flex items-center gap-3 font-medium text-xs">
                      <User className="w-4 h-4 text-gray-500" /> My Profile
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => handleProtectedNavigation("/account/orders")}
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 text-gray-700 transition"
                  >
                    <span className="flex items-center gap-3 font-medium text-xs">
                      <Package className="w-4 h-4 text-gray-500" /> My Orders
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => handleProtectedNavigation("/seller/dashboard")}
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 text-gray-700 transition"
                  >
                    <span className="flex items-center gap-3 font-medium text-xs">
                      <Store className="w-4 h-4 text-gray-500" /> Seller Dashboard
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => handleProtectedNavigation("/account/wishlist")}
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 text-gray-700 transition"
                  >
                    <span className="flex items-center gap-3 font-medium text-xs">
                      <Heart className="w-4 h-4 text-gray-500" /> Wishlist
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => {
                      router.push("/terms-of-use");
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 text-gray-700 transition"
                  >
                    <span className="flex items-center gap-3 font-medium text-xs">
                      <FileText className="w-4 h-4 text-gray-500" /> Terms & Conditions
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => {
                      router.push("/how-it-works");
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 text-gray-700 transition"
                  >
                    <span className="flex items-center gap-3 font-medium text-xs">
                      <HelpCircle className="w-4 h-4 text-gray-500" /> Help & Support
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={handleLogOut}
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between hover:bg-red-50 text-gray-700 transition"
                  >
                    <span className="flex items-center gap-3 font-medium text-xs text-gray-700">
                      <LogOut className="w-4 h-4 text-gray-500" /> Logout
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Cart Link matching Image 2 */}
          <Link
            href="/checkout/cart"
            className="flex items-center gap-1.5 font-semibold text-xs text-gray-700 hover:text-blue-600 transition"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>

        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="p-2 bg-gray-100 border-t border-gray-200 sm:hidden">
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-3 py-1.5 border border-gray-300">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors..."
            className="w-full text-xs text-gray-800 focus:outline-none"
          />
          <button type="submit" className="text-gray-500">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Auth Modal */}
      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={() => dispatch(toggleLoginDialog())} />
    </header>
  );
}

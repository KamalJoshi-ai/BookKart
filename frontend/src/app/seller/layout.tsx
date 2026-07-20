"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  IndianRupee,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import { useLogoutMutation } from "@/store/api";
import { logout, toggleLoginDialog } from "@/store/slice/user-slice";
import { clearCart } from "@/store/slice/cartSlice";
import { clearWishlist } from "@/store/slice/wishlistSlice";
import { resetCheckout } from "@/store/slice/checkoutSlice";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NoData from "../components/NoData";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  {
    label: "Overview",
    href: "/seller/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Listings",
    href: "/seller/listings",
    icon: BookOpen,
  },
  {
    label: "Orders",
    href: "/seller/orders",
    icon: ShoppingBag,
  },
  {
    label: "Earnings",
    href: "/seller/earnings",
    icon: IndianRupee,
  },
];

function SidebarContent({
  pathname,
  user,
  onLogout,
  onClose,
}: {
  pathname: string;
  user: any;
  onLogout: () => void;
  onClose?: () => void;
}) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "S";

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      {/* Header Seller Box */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center gap-4">
        {user?.profilePicture ? (
          <img
            src={String(user.profilePicture)}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/20 shadow-xs"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
            {initial}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Seller Panel</p>
          <p className="text-lg font-bold text-gray-900 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1.5 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between font-bold text-xs px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
              <ChevronRight className={cn("h-3.5 w-3.5", isActive ? "text-white" : "text-gray-400")} />
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold text-xs gap-2"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [logoutMutation] = useLogoutMutation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation(undefined).unwrap();
      dispatch(logout());
      dispatch(clearCart());
      dispatch(clearWishlist());
      dispatch(resetCheckout());
      router.push("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  if (!user) {
    return (
      <NoData
        message="Please login to access seller panel."
        description="You need to be logged in to manage your listings and orders."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  if (user.role !== "seller") {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 flex flex-col items-center justify-center">
        <NoData
          message="Seller Access Required"
          description="Please upgrade your account to Seller status in your Profile to access the Seller Dashboard."
          imageUrl="/images/login.jpg"
        />
        <Link
          href="/account/profile"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#2874f0] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
        >
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20">
            <SidebarContent
              pathname={pathname}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </aside>

        {/* Mobile Topbar */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 border border-gray-200 rounded-xl shadow-xs mb-2">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 border-none bg-transparent">
                <SidebarContent
                  pathname={pathname}
                  user={user}
                  onLogout={handleLogout}
                  onClose={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <span className="text-sm font-bold text-gray-900">
              {navItems.find((i) => i.href === pathname)?.label ?? "Seller Panel"}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}

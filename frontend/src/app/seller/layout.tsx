"use client";

import Link from "next/link";
import { useLogoutMutation } from "@/store/api";
import { logout } from "@/store/slice/user-slice";
import { clearCart } from "@/store/slice/cartSlice";
import { clearWishlist } from "@/store/slice/wishlistSlice";
import { resetCheckout } from "@/store/slice/checkoutSlice";
import { RootState } from "@/store/store";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  IndianRupee,
  LogOut,
  Menu,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toggleLoginDialog } from "@/store/slice/user-slice";
import NoData from "../components/NoData";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    href: "/seller/dashboard",
    icon: LayoutDashboard,
    color: "from-purple-700 to-purple-800",
  },
  {
    label: "My Listings",
    href: "/seller/listings",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Orders",
    href: "/seller/orders",
    icon: ShoppingBag,
    color: "from-orange-500 to-amber-500",
  },
  {
    label: "Earnings",
    href: "/seller/earnings",
    icon: IndianRupee,
    color: "from-pink-500 to-rose-500",
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
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg ">
      <div className="flex h-[60px] items-center px-6">
        <span className="text-2xl font-semibold text-white">Seller Panel</span>
      </div>

      <section className="py-4 ">
        <div className="px-6 py-2 flex items-center gap-4 ">
          {user?.profilePicture ? (
            <img
              src={String(user.profilePicture)}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center ring-2 ring-white/30">
              <span className="text-white text-lg font-semibold">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-xl font-semibold text-white">{user?.name}</p>
            <p className="text-purple-200 text-sm">{user?.email}</p>
          </div>
        </div>
      </section>

      <Separator className="bg-white/20" />

      <nav className="grid items-start px-2 py-2 text-sm font-medium mt-2">
        {navItems.map(({ label, href, icon: Icon, color }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center font-semibold text-[18px] gap-4 rounded-lg px-3 py-3 mb-2 transition-all",
                isActive
                  ? `bg-gradient-to-r ${color} text-white`
                  : "text-purple-100 hover:bg-purple-500",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <Button variant="secondary" className="w-full gap-2" onClick={onLogout}>
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
      window.location.reload();
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
    <>
      <NoData
        message="Please change to seller role in profile."
        description="You need to be a seller to access Seller Dashboard."
        imageUrl="/images/login.jpg"
      />

      <div className="mb-8 flex justify-center">
        <Link
          href="/account/profile"
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white"
        >
          Go to Profile
        </Link>
      </div>
    </>
  );
}
   

  return (
    <div className="flex flex-col lg:flex-row w-[90%] mx-auto py-10 gap-6">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[320px] shrink-0">
        <div className="sticky top-6 h-180">
          <SidebarContent
            pathname={pathname}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center gap-3 mb-2">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full p-2 bg-white border-none shadow-xl"
          >
            <div className="h-full">
              <SidebarContent
                pathname={pathname}
                user={user}
                onLogout={handleLogout}
                onClose={() => setMobileOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-lg font-semibold text-gray-800">
          {navItems.find((i) => i.href === pathname)?.label ?? "Seller Panel"}
        </span>
      </div>

      <main className="flex-1 min-w-0 bg-white rounded-lg p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}

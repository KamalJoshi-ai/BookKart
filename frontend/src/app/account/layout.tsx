"use client";

import Link from "next/link";
import { useLogoutMutation } from "@/store/api";
import { logout, toggleLoginDialog } from "@/store/slice/user-slice";
import { RootState } from "@/store/store";
import { Heart, LogOut, ShoppingCart, User, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "My Profile",
    href: "/account/profile",
    icon: User,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Orders",
    href: "/account/orders",
    icon: ShoppingCart,
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
    color: "from-red-500 to-pink-500",
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
    <div className="flex flex-col h-full bg-gradient-to-br from-violet-500 to-purple-700 rounded-md">
      {/* Header */}
      <div className="flex h-15 items-center px-6">
        <Link href="/" onClick={onClose}>
          <span className="text-2xl font-semibold text-white">
            Your Account
          </span>
        </Link>
      </div>

      {/* User Info */}
      <section className="py-4">
        <div className="px-6 py-2 flex items-center gap-4">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
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

      <Separator className="bg-white/30" />

      {/* Nav */}
      <nav className="grid items-start px-2 py-2 text-sm font-medium mt-2">
        {navigation.map(({ title, href, icon: Icon, color }) => {
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
              {title}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto p-4">
        <Button variant="secondary" className="w-full gap-2" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}




export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
    const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);

   const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };


   
if (!user) {
    return (
      <NoData
        message="Please login to access your account."
        description="You need to be logged in to view your account."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  const [logoutMutation] = useLogoutMutation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await logoutMutation(undefined).unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

 

  return (
    <div className="flex flex-col lg:flex-row w-[90%] mx-auto py-10 gap-6">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[320px] flex-shrink-0">
        <div className="sticky top-6 h-[720px]">
          <SidebarContent
            pathname={pathname}
            user={user}
            onLogout={handleLogOut}
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
            className="w-full  shadow-xl"
          >
            <div className="h-full">
              <SidebarContent
                pathname={pathname}
                user={user}
                onLogout={handleLogOut}
                onClose={() => setMobileOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-lg font-semibold text-gray-800">
          {navigation.find((i) => i.href === pathname)?.title ?? "My Account"}
        </span>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-white rounded-lg p-4 lg:p-6">
        {children}
      </main>
      
    </div>
  );
}

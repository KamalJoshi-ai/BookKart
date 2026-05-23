"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  BookLock,
  ChevronRight,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  Menu,
  Package,
  PiggyBank,
  ShoppingCart,
  User,
  SearchIcon,
} from "lucide-react";
import { useGetCartQuery, useLogoutMutation } from "@/store/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoginDialog, logout } from "@/store/slice/user-slice"; 
import { clearCart} from "@/store/slice/cartSlice"; 
import { resetCheckout} from "@/store/slice/checkoutSlice"; 
import { clearWishlist} from "@/store/slice/wishlistSlice"; 
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RootState, AppDispatch } from "@/store/store";
import AuthPage from "./AuthPage";
import toast from "react-hot-toast";
import { setCart } from "@/store/slice/cartSlice";

const Header = () => {

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const isLoginOpen = useSelector((state: RootState) => state.user.isLoginDialogOpen,);
  const cartCount = useSelector((state: RootState) => state.cart?.items?.length || 0,);
  
  const { data: cartData } = useGetCartQuery(user?._id, { skip: !user });
  const [logoutApi] = useLogoutMutation();



  const handleSearch = () => {
    const trimmed =searchRef?.current?.value?.trim() ?? "";
    if (trimmed) {
      router.push(`/books?search=${trimmed}`);
    } else {
      router.push(`/books`);
    }
  };

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

  
    const handleLogOut = async () => {
      try {
        await logoutApi(undefined).unwrap();
        dispatch(logout());
        dispatch(clearCart());
        dispatch(clearWishlist());
        dispatch(resetCheckout());
        setIsDropdownOpen(false);
       window.location.reload()
        router.push("/");
      } catch (error) {
        toast.error("Failed to logout");
      }
    };

  const handleProtectedNavigation = (href: string) => {
    if (user) router.push(href);
    else dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

 
 

  const menuItems = [
    user ? {
          content: 
            <div className="flex items-center space-x-3 p-3 border-b">
              
                {  user.profilePicture ?
                 
  <img
    src={user.profilePicture}
    alt={user.name}
    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
  />

: (
  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center ring-2 ring-gray-200">
    <span className="text-white text-lg font-semibold">
      {user.name[0].toUpperCase()}
    </span>
  </div>
)}
              
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

            </div>
          
        }
      : {
          icon: <Lock className="h-4 w-4" />,
          label: "Login / Sign Up",
          onClick: handleLoginClick,
        },

    {
      icon: <User className="h-4 w-4" />,
      label: "My Profile",
      onClick: () => handleProtectedNavigation("/account/profile"),
    },

    {
      icon: <Package className="h-4 w-4" />,
      label: "My Orders",
      onClick: () => handleProtectedNavigation("/account/orders"),
    },
    {
      icon: <PiggyBank className="h-4 w-4" />,
      label: "Seller Dashboard",
      onClick: () => handleProtectedNavigation("/seller/dashboard"),
    },
    {
      icon: <Heart className="h-4 w-4" />,
      label: "Wishlist",
      onClick: () => handleProtectedNavigation("/account/wishlist"),
    },
    {
      icon: <BookLock className="h-4 w-4" />,
      label: "Terms & Conditions",
      href: "/terms-of-use",
    },
    {
      icon: <HelpCircle className="h-4 w-4" />,
      label: "Help & Support",
      href: "/how-it-works",
    },
    user && {
      icon: <LogOut className="h-4 w-4" />,
      label: "Logout",
      onClick: handleLogOut,
    },
  ].filter(Boolean);

  const MenuItems = ({ className = "" }) => (
    <div className={`flex flex-col ${className}`}>
      {menuItems.map((item: any, i) =>
        item.content ? (
          <div key={i}>{item.content}</div>
        ) : item.href ? (
          <Link
            href={item.href}
            key={i}
            className="flex items-center gap-3 px-4 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
          </Link>
        ) : (
          <button
            key={i}
            onClick={item.onClick}
            className="flex items-center gap-3 px-4 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
          </button>
        ),
      )}
    </div>
  );

   useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData]);


  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Desktop */}
      <div className="hidden lg:flex container mx-auto items-center justify-between px-8 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/web-logo.png"
            alt="Logo"
            width={100}
            height={40}
          />
        </Link>

        {/* Search */}
         {/* value prop makes the input controlled  */}
        <div className="relative w-[40%]">
          <Input
            placeholder="Search books, authors, or subjects..."
            className="pr-10 text-gray-700 border-gray-300"
           ref={searchRef}
              onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
         
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            onClick={handleSearch}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          {/* Sell Button */}
          <Link href="/book-sell">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow-sm">
              Sell Used Book
            </Button>
          </Link>

          {/* Account Dropdown */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-700 hover:text-black transition"
              >
              {user ? (
  user.profilePicture ? (
    <img
      src={user.profilePicture}
      alt={user.name}
      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
    />
  ) : 
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center ring-2 ring-gray-200">
      <span className="text-white text-sm font-semibold">
        {user.name[0].toUpperCase()}
      </span>
    </div>
  
) : (
  <User className="w-6 h-6 text-gray-600" />
)}
              
                <span className="font-medium">My Account</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-72 p-2 shadow-lg rounded-xl">
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>


          {/* Cart */}
          <Link
            href="/checkout/cart"
            className="relative flex items-center gap-2 text-gray-700 hover:text-black transition"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">Cart</span>
            {/*  Fixed — dynamic cart count from Redux */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>



      </div>

      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />

      {/* Mobile */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3 text-muted-foreground">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 p-4 overflow-y-auto shadow-lg text-muted-foreground"
          >
            <Image
              src="/images/web-logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="mb-4"
            />
            <MenuItems />
          </SheetContent>
        </Sheet>

        <Link href="/">
          <Image
            src="/images/web-logo.png"
            alt="Logo"
            width={100}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        <Link href="/checkout/cart" className="relative transition">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-6 w-6" />
          </Button>
          {/*  Fixed — dynamic cart count */}
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      
    </header>
  );
};

export default Header;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Heart, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Filter 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetProductsQuery, useAddToCartMutation, useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/store/api";
import { filters } from "@/lib/Constant";
import BookLoader from "@/lib/BookLoader";
import { RootState } from "@/store/store";
import { toggleLoginDialog } from "@/store/slice/user-slice";
import { addToCart } from "@/store/slice/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slice/wishlistSlice";
import toast from "react-hot-toast";

export default function Page() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");

  const user = useSelector((state: RootState) => state.user.user);
  const wishlist = useSelector((state: RootState) => state.wishlist?.items || []);

  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();

  const bookPerPage = 12;
  const { data, isLoading, isFetching } = useGetProductsQuery({
    page: currentPage,
    limit: bookPerPage,
    search,
    condition: selectedCondition,
    classType: selectedType,
    category: selectedCategory,
    sort: sortOption,
  });

  const paginatedBooks = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const toggleFilter = (section: string, item: string) => {
    const updateFilter = (prev: string[]) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];
    switch (section) {
      case "condition": setSelectedCondition(updateFilter); break;
      case "classType": setSelectedType(updateFilter); break;
      case "category": setSelectedCategory(updateFilter); break;
    }
    setCurrentPage(1);
  };

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const handleAddToCart = async (e: React.MouseEvent, book: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      dispatch(toggleLoginDialog());
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const result = await addToCartMutation({
        productId: book._id,
        quantity: 1,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(addToCart(result.data));
        toast.success("Added to Cart!");
      } else {
        dispatch(addToCart({ _id: book._id, title: book.title, price: book.finalPrice || book.price, image: book.images?.[0], quantity: 1 }));
        toast.success("Added to Cart!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Please login to add items to cart");
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      dispatch(toggleLoginDialog());
      toast.error("Please login to add to wishlist");
      return;
    }

    const isSaved = wishlist.some((item: any) => item.products?.includes(bookId));

    if (isSaved) {
      dispatch(removeFromWishlist(bookId));
      try { await removeWishlistMutation(bookId).unwrap(); } catch {}
      toast.success("Removed from Wishlist");
    } else {
      dispatch(addToWishlist(bookId));
      try { await addToWishlistMutation(bookId).unwrap(); } catch {}
      toast.success("Added to Wishlist!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <nav className="mb-1 flex items-center gap-2 text-xs text-gray-500">
              <Link href="/" className="text-blue-600 hover:underline font-semibold">Home</Link>
              <span>/</span>
              <span className="font-semibold text-gray-700">Books Catalogue</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Explore Used & Refurbished Books
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500">Sort By:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-44 border border-gray-300 bg-white text-gray-800 text-xs font-semibold rounded-lg h-9 shadow-xs">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 text-gray-800 text-xs">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Books */}
        <div className="grid gap-6 md:grid-cols-[260px_1fr] items-start">
          
          {/* FILTER SIDEBAR */}
          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" /> Filters
              </h2>
              {(selectedCondition.length > 0 || selectedType.length > 0 || selectedCategory.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedCondition([]);
                    setSelectedType([]);
                    setSelectedCategory([]);
                  }}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <Accordion type="multiple" className="space-y-1">
              {Object.entries(filters).map(([key, values]) => (
                <AccordionItem key={key} value={key} className="border-b border-gray-100 py-1">
                  <AccordionTrigger className="text-xs font-bold text-gray-800 uppercase tracking-wider py-2 hover:no-underline">
                    {key}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-1 space-y-1.5 pl-1">
                      {values.map((value) => {
                        const id = `${key}-${value}`;
                        const checked =
                          key === "condition"
                            ? selectedCondition.includes(value)
                            : key === "classType"
                            ? selectedType.includes(value)
                            : selectedCategory.includes(value);

                        return (
                          <div key={value} className="flex items-center space-x-2 text-xs text-gray-600">
                            <input
                              id={id}
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleFilter(key, value)}
                              className="h-4 w-4 rounded-xs border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={id} className="cursor-pointer select-none hover:text-blue-600">
                              {value}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* BOOKS GRID */}
          <div>
            {isLoading ? (
              <BookLoader />
            ) : paginatedBooks.length ? (
              <div className="space-y-6">
                <div className="relative">
                  {isFetching && (
                    <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-xs flex justify-center items-center">
                      <BookLoader />
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedBooks.map((book: any) => {
                      const price = book.finalPrice || book.price;
                      const originalPrice = book.price > price ? book.price : Math.round(price * 1.4);
                      const discount = calculateDiscount(originalPrice, price);
                      const img = book.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600";
                      const isWishlisted = wishlist.some((item: any) => item.products?.includes(book._id));

                      return (
                        <div
                          key={book._id}
                          className="group relative flex flex-col justify-between p-3.5 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-all duration-300"
                        >
                          <Link href={`/books/${book._id}`} className="block space-y-3">
                            {/* Image Box */}
                            <div className="relative w-full aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2">
                              <img
                                src={img}
                                alt={book.title}
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Green Discount Tag Top Left */}
                              {discount > 0 && (
                                <span className="absolute top-2 left-2 bg-[#00897b] text-white font-bold text-[10px] px-2 py-0.5 rounded-xs shadow-xs">
                                  {discount}% off
                                </span>
                              )}

                              {/* Wishlist Heart Top Right */}
                              <button
                                onClick={(e) => handleWishlistToggle(e, book._id)}
                                className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-xs hover:bg-white transition ${
                                  isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
                                }`}
                              >
                                <Heart className="w-4 h-4 fill-current" />
                              </button>
                            </div>

                            {/* Book Info */}
                            <div className="space-y-1">
                              <h3 className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-[11px] text-gray-500 truncate">{book.author || "Curated Author"}</p>
                            </div>
                          </Link>

                          {/* Footer Price & Cart Row */}
                          <div className="pt-2 border-t border-gray-100 flex items-end justify-between mt-3">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-black text-gray-900">₹{price}</span>
                                {originalPrice > price && (
                                  <span className="text-[11px] text-gray-400 line-through">₹{originalPrice}</span>
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                                Free Delivery
                              </span>
                            </div>

                            {/* Cart Icon Button */}
                            <button
                              onClick={(e) => handleAddToCart(e, book)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white transition cursor-pointer"
                              title="Add to Cart"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="h-8 px-3 text-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`h-8 w-8 text-xs font-bold ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white border text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="h-8 px-3 text-xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-12 text-center text-gray-500 font-medium border border-gray-200 rounded-xl">
                No books found matching selected filters.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

"use client"
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "@/store/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromWishlist } from "@/store/slice/wishlistSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function WishlistPage() {
  const user = useSelector((state: RootState) => state.user.user);
  const { data, isLoading } = useGetWishlistQuery(undefined);
  
  const [removeWishlistFromMutation] = useRemoveFromWishlistMutation();
  const dispatch = useDispatch();
  const products = data?.data?.products || [];

  const handleRemove = async (productId: string) => {
    dispatch(removeFromWishlist(productId));
    try {
      const result = await removeWishlistFromMutation(productId).unwrap();
      toast.success(result.message || "Removed from wishlist");
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-pink-100">Books you love, saved for later</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-98 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-pink-100">Books you love, saved for later</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <Heart className="w-16 h-16 text-gray-300" />
            <p className="text-xl font-semibold text-gray-500">Wishlist is empty</p>
            <p className="text-gray-400">Save books you like and find them here</p>
            <Link href="/books">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                Browse Books
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
        <p className="text-pink-100">{products.length} book{products.length > 1 ? "s" : ""} saved</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <Card key={product._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative">
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              {/* Remove button */}
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <CardContent className="p-4 space-y-2">
              <p className="font-bold text-gray-800 line-clamp-1">{product.title}</p>
              <p className="text-sm text-gray-500">{product.author}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg text-gray-800">₹{product.finalPrice}</p>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                  {product.condition}
                </span>
              </div>
              <Link href={`/books/${product._id}`}>
                <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white mt-2">
                  View Book
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


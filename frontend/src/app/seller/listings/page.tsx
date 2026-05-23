"use client";

import {
  useGetSellerListingsQuery,
  useDeleteProductBySellerIdMutation,
} from "@/store/api";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SellerListings() {
  const { data, isLoading, isError } = useGetSellerListingsQuery();
  const [deleteProduct] = useDeleteProductBySellerIdMutation();
  const router = useRouter();
  const products = data?.data?.products ?? [];

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Book deleted successfully");
    } catch {
      toast.error("Failed to delete book");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">
          Failed to load listings. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} books listed
          </p>
        </div>
        <Link href="/book-sell">
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4" />
            Add Book
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-gray-500">No books listed yet</p>
          <Link href="/book-sell">
            <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4" />
              Add your first book
            </Button>
          </Link>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-50">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => router.push(`/books/${product._id}`)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  No Image
                </div>
              )}
              {/* Condition Badge */}
              <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-white/90 text-gray-600 font-medium shadow-sm">
                {product.condition}
              </span>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-medium text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 truncate">{product.author}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-semibold text-violet-600">
                  ₹{product.finalPrice}
                </span>
                <span className="text-xs text-gray-400">
                  {product.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                <Link
                  href={`/book-sell?edit=${product._id}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full gap-2 text-sm">
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="gap-2 text-sm text-red-500 hover:bg-red-50 hover:border-red-200"
                  onClick={() => handleDelete(product._id)}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

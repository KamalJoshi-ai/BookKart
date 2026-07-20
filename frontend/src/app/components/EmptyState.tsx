"use client";

import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "No Items Found",
  description = "No products found matching your search or filters.",
  actionText = "Browse Books",
  actionHref = "/books",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-6 shadow-xs">
      <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2874f0] mb-4">
        {icon || <ShoppingBag className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-5">{description}</p>
      
      {onAction ? (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-[#2874f0] text-white font-bold text-xs uppercase rounded-xs hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5"
        >
          {actionText} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ) : (
        <Link href={actionHref}>
          <button className="px-6 py-2.5 bg-[#2874f0] text-white font-bold text-xs uppercase rounded-xs hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5">
            {actionText} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      )}
    </div>
  );
}

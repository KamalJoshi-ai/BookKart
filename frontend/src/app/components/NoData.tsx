"use client";

import Image from "next/image";
import React from "react";

interface NoDataProps {
  imageUrl: string;
  message: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
}

const NoData: React.FC<NoDataProps> = ({
  imageUrl,
  message,
  description,
  buttonText,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-10">
      
      {/* Image */}
      <div className="relative w-52 h-52 mb-6">
        <Image
          src={imageUrl || '/images/logo.png'}
          alt="No data"
            width={250}
            height={250}
          className="object-contain"
        />
      </div>

      {/* Message */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {message}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-gray-500 max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Button */}
      {buttonText && onClick && (
        <button
          onClick={onClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default NoData;
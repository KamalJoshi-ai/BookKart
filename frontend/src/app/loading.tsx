
"use client";

export default function BookLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">

        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"></div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-gray-800">
            Loading books
          </p>
          <p className="text-xs text-gray-500">
            Please wait while we fetch the latest titles
          </p>
        </div>

      </div>
    </div>
  );
}

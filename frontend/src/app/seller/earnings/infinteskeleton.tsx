import { useState, useEffect } from "react";

export default function InfiniteSkeleton() {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setCount((prev) => prev + 5); // add more skeletons
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div className="flex items-center space-x-4 p-4 bg-gray-200 rounded-lg animate-pulse">
      <div className="w-16 h-16 bg-gray-300 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
      ))}
    </div>
  );
}

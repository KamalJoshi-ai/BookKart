// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2">Page Not Found</h2>
      <p className="max-w-md mb-6">
        Sorry, we couldn’t find the page you requested. Let’s get you back on track.
      </p>
      <Link href="/" className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-200 transition">
        Return Home
      </Link>
    </section>
  );
}

'use client';

import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";

function GamesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-red-600 px-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-7xl font-bold text-white tracking-tight">
          Games
        </h1>
        <p className="text-2xl text-white/90 max-w-2xl">
          Let the games begin!
        </p>
        <Link
          href="/"
          className="mt-8 flex h-14 items-center justify-center rounded-xl bg-white px-8 text-lg font-semibold text-red-600 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
        >
          ← Back to Home
        </Link>
      </main>
    </div>
  );
}

export default function Games() {
  return (
    <ProtectedRoute>
      <GamesPage />
    </ProtectedRoute>
  );
}


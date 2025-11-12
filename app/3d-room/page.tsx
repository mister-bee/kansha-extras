'use client';

import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";

function Room3DPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 px-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-7xl font-bold text-white tracking-tight">
          3D Room
        </h1>
        <p className="text-2xl text-white/90 max-w-2xl">
          Explore your 3D space
        </p>
        <Link
          href="/"
          className="mt-8 flex h-14 items-center justify-center rounded-xl bg-white px-8 text-lg font-semibold text-teal-600 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
        >
          ← Back to Home
        </Link>
      </main>
    </div>
  );
}

export default function Room3D() {
  return (
    <ProtectedRoute>
      <Room3DPage />
    </ProtectedRoute>
  );
}


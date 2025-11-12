'use client';

import Link from "next/link";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <main className="flex flex-col items-center justify-center gap-12 px-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white tracking-tight mb-3">
            Kansha Extras
          </h1>
          <p className="text-zinc-400 text-lg">
            Welcome back, <span className="text-white font-semibold">{user}</span>!
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <Link
            href="/marble-jar"
            className="flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 text-xl font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
          >
            Marble Jar
          </Link>
          <Link
            href="/3d-room"
            className="flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 text-xl font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
          >
            3D Room
          </Link>
          <Link
            href="/games"
            className="flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-8 text-xl font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
          >
            Games
          </Link>
        </div>

        <button
          onClick={logout}
          className="mt-4 rounded-xl bg-zinc-700/50 border border-zinc-600 px-6 py-3 text-zinc-300 font-medium transition-all hover:bg-zinc-700 hover:text-white hover:border-zinc-500"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}

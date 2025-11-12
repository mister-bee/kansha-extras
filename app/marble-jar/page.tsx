'use client';

import Link from "next/link";
import MarbleJarSimulation from "./MarbleJarSimulation";
import ProtectedRoute from "../components/ProtectedRoute";

function MarbleJarPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 px-8 py-12">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Marble Jar
        </h1>
        <MarbleJarSimulation />
        <Link
          href="/"
          className="mt-4 flex h-12 items-center justify-center rounded-xl bg-white px-8 text-lg font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
        >
          ← Back to Home
        </Link>
      </main>
    </div>
  );
}

export default function MarbleJar() {
  return (
    <ProtectedRoute>
      <MarbleJarPage />
    </ProtectedRoute>
  );
}


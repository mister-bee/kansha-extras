'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = login(username, password);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid credentials. Try password: "password"');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-zinc-800/50 p-8 shadow-2xl backdrop-blur-sm border border-zinc-700/50">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-zinc-400 text-center mb-8">
            Sign in to access Kansha Extras
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl bg-zinc-900/50 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Enter your username"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-zinc-900/50 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/50 px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Demo credentials: any username with password{' '}
              <code className="rounded bg-zinc-700 px-2 py-1 text-zinc-300 font-mono text-xs">
                password
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

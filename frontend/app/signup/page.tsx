'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, login } from '@/lib/api';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      // Create the account
      await signUp({ email, password });

      // Automatically log in
      const loginResponse = await login({ email, password });

      // Store token
      localStorage.setItem('access_token', loginResponse.access_token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl text-yellow-500 mb-4">✝</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
          <p className="text-slate-600">Join us today</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-700 text-white py-3 rounded-md font-semibold hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <span>👤</span>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-slate-500">or</div>

        {/* Sign In Link */}
        <p className="text-center text-slate-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-yellow-600 hover:text-yellow-500 font-semibold">
            Sign In
          </Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-slate-300 text-sm">
        © 2025 Funeral Director Management System. All rights reserved.
      </footer>
    </div>
  );
}

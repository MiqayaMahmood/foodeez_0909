'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import Image from 'next/image';
import SEO from '@/components/seo/SEO';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Forgot password"
        description="Request a password reset link for your Foodeez account."
        url="https://foodeez.ch/auth/forgot-password"
        canonical="https://foodeez.ch/auth/forgot-password"
        noindex
        nofollow
        type="website"
      />
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/Logo/LogoFoodeezMain.svg"
              alt="Foodeez Logo"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </div>
            <Link
              href="/auth/signin"
              className="inline-block text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Return to sign in
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="py-2.5"
            >
              Send reset link
            </Button>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 
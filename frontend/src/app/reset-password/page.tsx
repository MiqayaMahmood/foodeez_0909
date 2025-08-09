'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import Image from 'next/image';
import Link from 'next/link';
import SEO from '@/components/seo/SEO';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/Logo/LogoFoodeezMain.svg"
                alt="Foodeez Logo"
                width={120}
                height={120}
                className="mx-auto"
              />
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Request new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/Logo/LogoFoodeezMain.svg"
              alt="Foodeez Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
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
              Your password has been reset successfully. Redirecting to sign in...
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New password
                </label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm new password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="py-2.5"
            >
              Reset password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <>
      <SEO
        title="Reset password"
        description="Reset your Foodeez account password."
        url="https://foodeez.ch/reset-password"
        canonical="https://foodeez.ch/reset-password"
        noindex
        nofollow
        type="website"
      />
      <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
    </>
  );
}
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SEO from '@/components/seo/SEO';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification link may have expired or already been used.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
        return 'There was a problem completing the sign in process. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in with your original method.';
      case 'EmailSignin':
        return 'The email could not be sent. Please try again later.';
      case 'CredentialsSignin':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

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
              priority
            />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href={`/auth/signin${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <>
      <SEO
        title="Authentication error"
        description="An authentication error occurred."
        url="https://foodeez.ch/auth/error"
        canonical="https://foodeez.ch/auth/error"
        noindex
        nofollow
        type="website"
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <AuthErrorContent />
      </Suspense>
    </>
  );
}
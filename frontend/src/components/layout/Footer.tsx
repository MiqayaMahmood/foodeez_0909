"use client";

import Link from "next/link";
import { useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { SocialLinks } from "../core/SocialLinks";
import Image from "next/image";
import { toast } from 'react-hot-toast';

export default function Footer() {
  const socialLinks = {
    facebook: "https://facebook.com/foodeez.ch",
    instagram: "https://facebook.com/foodeez.ch",
    whatsapp: "https://facebook.com/foodeez.ch",
    twitter: "https://facebook.com/foodeez.ch",
    tiktok: "https://facebook.com/@foodeez.ch",
  };

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (!response.ok || data.success === false) {
        const errorMessage = data?.message || 'Subscription failed. Please try again.';
        toast.error(errorMessage);
        return;
      }
  
      toast.success(data.message || 'Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Top Section - Help banner */}
        <div className=" border-2 border-white text-white rounded-xl p-8 mb-12 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Help millions to find the right Place & Food to enjoy
            </h3>
            <p className="">Join our community and share your experiences</p>
          </div>
          {/* <Link
            href="/signup"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-primary font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Share your experience
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link> */}
          <div className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-primary font-medium rounded-full hover:bg-gray-100 transition-colors">
            Share your experience
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand and About */}
          <div className="lg:col-span-2">
            <div className="">
              <Image
                src="/Logo/LogoFoodeezWhite.svg"
                alt="Foodeez Logo"
                height={144}
                width={144}
                className="w-36 h-36"
              />
            </div>
            <p className="mb-6 max-w-md">
              First tourist-focused food discovery platform for Switzerland,
              especially with support for specific food preferences.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5" />
                <div>
                  <p>8154 Oberglatt, Switzerland</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <p>+41 76 408 94 30</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <p>info@foodeez.ch</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <SocialLinks {...socialLinks} size="xl" variant="default" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq">FAQs</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/food-journey">Share your food journey</Link>
              </li>
              <li>
                <Link href="/">Be a Foodeez Explorer</Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-5">
              Are you on foodeez? No!
            </h3>

            <ul className="space-y-3">
              <li>
                <Link href="#" className="font-medium">
                  Register Now
                </Link>
              </li>
              <li>
                <Link href="#">Contact Us</Link>
              </li>
              <li>
                <Link href="#">Advertise </Link>
              </li>
              <li>
                <Link href="#">Subscribe</Link>
              </li>
            </ul>
            {/* Newsletter */}
          <div className="mt-10">
            <h3 className="text-lg lg:text-xl font-semibold mb-5 text-text">Newsletter</h3>
            <p className="mb-4 text-text">
              Be the part of foodeez, to get the updates, blogs, new restaurants
              & foods and offers.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 text-primary border border-gray-400 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Subscribe"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </div>
          </div>
        </div>

        {/* Horizontal divider */}
        <div className="h-px bg-white my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm md:text-base lg:text-lg mb-4 md:mb-0">
            © {new Date().getFullYear()} Foodeez. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <main className=" px-6 lg:px-0 py-10 lg:py-20 text-gray-800">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold text-primary mb-8"
      >
        Terms & Conditions
      </motion.h1>

      <p className="text-gray-600 mb-12">
        Last Updated: <strong>January 2025</strong>
      </p>

      <div className="space-y-10 leading-relaxed text-base md:text-lg">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Welcome to <strong>Foodeez</strong>! By using our platform, you agree
            to comply with these Terms & Conditions. If you do not agree, please
            discontinue using our services immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">2. Eligibility</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must be at least 16 years old to create an account.</li>
            <li>
              Businesses registering must be legally authorized to operate in
              Switzerland.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">3. Our Services</h2>
          <p>
            Foodeez connects food lovers with restaurants, cafés, and food
            businesses across Switzerland. We also provide marketing and premium
            visibility tools to help businesses grow.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">4. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate and truthful information when registering.</li>
            <li>Use Foodeez only for lawful purposes.</li>
            <li>Avoid spam, fake reviews, or fraudulent activities.</li>
            <li>Respect the intellectual property rights of others.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">5. Business Listings</h2>
          <p>
            Businesses are responsible for keeping their details, menus, and
            opening hours up-to-date. Foodeez may suspend or remove listings that
            are misleading or inappropriate.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">6. Reviews & Content</h2>
          <p>
            Users may post reviews based on genuine experiences. Offensive,
            abusive, or fake reviews may be removed at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>
            Foodeez is a discovery platform and does not own or operate any
            restaurants. We are not responsible for food quality, pricing, or
            delivery. Any disputes must be resolved with the business directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">8. Governing Law</h2>
          <p>
            These Terms are governed by Swiss law. Any disputes will be handled
            in the courts of Switzerland.
          </p>
        </section>
      </div>
    </main>
  );
}

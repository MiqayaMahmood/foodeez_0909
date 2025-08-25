"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <main className="px-6 lg:px-0 py-10 lg:py-20 text-gray-800">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold text-primary mb-8"
      >
        Privacy Policy
      </motion.h1>

      <p className="text-gray-600 mb-12">
        Last Updated: <strong>January 2025</strong>
      </p>

      <div className="space-y-10 leading-relaxed text-base md:text-lg">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>For Users:</strong> Name, email, location data.</li>
            <li><strong>For Businesses:</strong> Business name, address, contact details, menus, and photos.</li>
            <li><strong>Automatically:</strong> Device data, cookies, browsing activity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">2. How We Use Information</h2>
          <p>
            We use your data to connect food lovers with restaurants, improve our
            services, and personalize your experience. We may also send relevant
            promotions (with opt-out options).
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">3. Sharing of Information</h2>
          <p>
            We do not sell personal data. We may share information with hosting
            providers, analytics platforms, and payment processors. Information
            may be shared with legal authorities when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">4. Cookies & Tracking</h2>
          <p>
            Foodeez uses cookies to remember preferences, analyze traffic, and
            improve our platform. Users can disable cookies in browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">5. Data Retention</h2>
          <p>
            We retain your information as long as your account is active. You may
            request deletion of your data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">6. Security</h2>
          <p>
            We use encryption and secure servers to protect your data. However,
            no system is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">7. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request corrections to inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Opt out of marketing communications.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">8. Contact Us</h2>
          <p>
            For privacy-related inquiries, reach us at:{" "}
            <a
              href="mailto:support@foodeez.ch"
              className="font-semibold text-secondary hover:underline"
            >
              support@foodeez.ch
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

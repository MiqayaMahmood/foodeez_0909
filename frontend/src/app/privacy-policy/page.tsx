export default function PrivacyPolicyPage() {
  return (
    <main className="px-6 l py-10 lg:py-20 text-gray-800">
      <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8">
        Privacy Policy
      </h1>
      <p className="text-gray-600 mb-12">
        Effective Date:&nbsp;
        <span className="font-semibold">30.08.2025</span> <br />
        Last Updated:&nbsp;
        <span className="font-semibold">30.08.2025</span>
      </p>

      <div className="space-y-10 leading-relaxed text-base md:text-lg">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Foodeez (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;) respects
            your privacy. This Privacy Policy explains how we collect, use, and
            protect your personal data in compliance with the Swiss Federal Act
            on Data Protection (FADP) and the GDPR.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">2. Data We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span className="font-semibold">Account Data:</span> Name, email,
              login credentials (if you sign up).
            </li>
            <li>
              <span className="font-semibold">Location Data:</span> If you grant
              permission, your approximate or precise location for
              recommendations.
            </li>
            <li>
              <span className="font-semibold">Usage Data:</span> Device details,
              IP address, interactions, cookies.
            </li>
            <li>
              <span className="font-semibold">Business Data:</span> Information
              about restaurants collected from publicly available sources.
            </li>
            <li>
              <span className="font-semibold">User Content:</span> Reviews,
              ratings, and feedback.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">3. How We Use Your Data</h2>
          <p>
            To provide and personalize our Services.&nbsp; To recommend
            businesses based on your preferences and location.&nbsp; To
            communicate updates, notices, or offers.&nbsp; To maintain security
            and prevent misuse.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">4. Data Sharing</h2>
          <p>
            We do not sell your personal data.&nbsp; Data may be shared with
            service providers (hosting, analytics, authentication).&nbsp;
            Aggregated, anonymized data may be shared for research or
            analytics.&nbsp; We may disclose information when legally required.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">5. Storage &amp; Security</h2>
          <p>
            Data is stored on secure servers located in Switzerland and/or the
            EU.&nbsp; We apply industry-standard security measures
            (encryption,&nbsp; access controls).
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">6. GDPR &amp; FADP Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, correct, or delete your data.</li>
            <li>Restrict or object to processing.</li>
            <li>Withdraw consent at any time.</li>
            <li>Request data portability.</li>
            <li>
              File a complaint with the Swiss Federal Data Protection and
              Information Commissioner (FDPIC) or your local EU authority.
            </li>
          </ul>
          <p className="mt-4">
            To exercise your rights, contact us at:&nbsp;
            <a
              href="mailto:info@foodeez.ch"
              className="text-secondary font-semibold hover:underline"
            >
              info@foodeez.ch
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">7. Cookies</h2>
          <p>
            Foodeez uses cookies for analytics, personalization, and security.
            You may disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">8. Policy Updates</h2>
          <p>
            We may update this Privacy Policy.&nbsp; The &quot;Last Updated&quot;
            date will indicate changes.
          </p>
        </section>
      </div>
    </main>
  );
}

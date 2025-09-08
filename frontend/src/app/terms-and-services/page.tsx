export default function TermsOfServicePage() {
  return (
    <main className="px-6 py-10 lg:py-20 text-gray-800">
      <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8">
        Terms of Service
      </h1>
      <p className="text-gray-600 mb-12">
        Effective Date: <strong>30.08.2025</strong> <br />
        Last Updated: <strong>30.08.2025</strong>
      </p>

      <div className="space-y-10 leading-relaxed text-base md:text-lg">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Welcome to Foodeez (“we,” “our,” “us”). These Terms of Service
            (“Terms”) govern your use of the Foodeez website, mobile applications,
            and services (“Services”). By accessing or using our Services, you
            agree to be bound by these Terms. If you do not agree, you must not
            use our Services.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">2. Eligibility</h2>
          <p>
            You must be at least 16 years old or have parental/guardian consent.
            You agree to comply with Swiss law and, if applicable, the General
            Data Protection Regulation (GDPR).
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">3. Description of Services</h2>
          <p>
            Foodeez provides an informational platform aggregating data about
            restaurants, cafes, and businesses from publicly available sources
            and user-generated reviews. We do not own, operate, or manage the
            businesses listed.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">4. User Responsibilities</h2>
          <p>
            You agree not to use Foodeez for unlawful, harmful, or misleading
            activities. You are solely responsible for the accuracy of any
            content you submit (reviews, ratings, comments). Foodeez may remove
            content that violates laws, third-party rights, or these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">5. Content & Intellectual Property</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Public Data:</strong> Business information is collected from publicly available sources and official APIs. We do not alter or falsify this information.</li>
            <li><strong>User Content:</strong> By submitting content, you grant Foodeez a non-exclusive, royalty-free license to use, display, and distribute it on our Services.</li>
            <li><strong>Foodeez Platform:</strong> The brand, platform, and design are protected intellectual property. Business logos, names, and trademarks belong to their owners.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">6. Disclaimer of Warranties</h2>
          <p>
            Foodeez provides information “as is” and “as available.” We do not
            guarantee accuracy, completeness, or timeliness of the information.
            Users should verify business details before making decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted under Swiss law, Foodeez shall not be
            liable for indirect, incidental, or consequential damages, or losses
            arising from reliance on data published on Foodeez.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">8. Termination</h2>
          <p>
            We may suspend or terminate access to our Services at our discretion,
            without notice, if you violate these Terms or applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">9. Governing Law & Jurisdiction</h2>
          <p>
            These Terms are governed by Swiss law. Any disputes shall be resolved
            exclusively in the courts of Zurich, Switzerland.
          </p>
        </section>
      </div>
    </main>
  );
}

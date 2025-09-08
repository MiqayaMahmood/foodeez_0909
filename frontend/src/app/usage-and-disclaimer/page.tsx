export default function DataUsageDisclaimerPage() {
    return (
      <main className="px-6 py-10 lg:py-20 text-gray-800">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8">
          Data Usage &amp; Disclaimer
        </h1>
        <p className="text-gray-600 mb-12">
          Effective Date:&nbsp;
          <span className="font-semibold">30.08.2025</span> <br />
          Last Updated:&nbsp;
          <span className="font-semibold">30.08.2025</span>
        </p>
  
        <div className="space-y-10 leading-relaxed text-base md:text-lg">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              1. Data Usage Declaration
            </h2>
            <p>
              Foodeez collects and displays information from:&nbsp; Publicly
              available platforms (official websites, business directories, social
              media).&nbsp; User submissions (reviews, ratings, feedback).&nbsp; We
              do not modify, manipulate, or falsify publicly sourced data.&nbsp;
              Summaries, scores, and rankings are automatically generated or based
              on aggregated user feedback.
            </p>
          </section>
  
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">2. Disclaimer</h2>
            <p>
              Foodeez is an informational platform only.&nbsp; We do not own,
              operate, or control the businesses listed.&nbsp; Information
              displayed is not guaranteed to be complete, accurate, or up to
              date.&nbsp; Recommendations and rankings are not endorsements.&nbsp;
              Users are responsible for verifying details before relying on them.
            </p>
          </section>
  
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              3. Liability Exclusion
            </h2>
            <p>
              Foodeez shall not be liable for:&nbsp; Errors, inaccuracies, or
              outdated business information.&nbsp; Damages arising from reliance on
              the Services.&nbsp; User-generated content, which represents the
              views of the authors, not Foodeez.
            </p>
          </section>
  
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">4. Business Rights</h2>
            <p>
              Businesses listed on Foodeez may request corrections, updates, or
              removal of their data by contacting us at:&nbsp;
              <a
                href="mailto:info@foodeez.ch"
                className="text-secondary font-semibold hover:underline"
              >
                info@foodeez.ch
              </a>
            </p>
          </section>
        </div>
      </main>
    );
  }
  
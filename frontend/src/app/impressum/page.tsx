export default function ImpressumPage() {
    return (
      <main className="px-6 py-10 lg:py-20 text-gray-800">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8">
          Impressum
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
              1. Service Provider
            </h2>
            <p>
              Foodeez is operated by:&nbsp; <br />
              <span className="font-semibold">Company Name:</span>&nbsp; MIQAYA
              Mahmood <br />
              <span className="font-semibold">Legal Form:</span>&nbsp; MIQAYA
              Mahmood <br />
              <span className="font-semibold">Registered Address:</span>&nbsp;
              Allmendstrasse 18,&nbsp; CH 8154 Oberglatt,&nbsp; Switzerland <br />
              <span className="font-semibold">Commercial Register Number:</span>
              &nbsp; <br />
              <span className="font-semibold">VAT Number:</span>&nbsp;
            </p>
          </section>
  
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              2. Contact Information
            </h2>
            <p>
              <span className="font-semibold">Email:</span>&nbsp;
              <a
                href="mailto:info@foodeez.ch"
                className="text-secondary font-semibold hover:underline"
              >
                info@foodeez.ch
              </a>
              <br />
              <span className="font-semibold">Telephone:</span>&nbsp; +41 76 408
              94 30 <br />
              <span className="font-semibold">Website:</span>&nbsp;
              <a
                href="https://www.foodeez.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary font-semibold hover:underline"
              >
                www.foodeez.ch
              </a>
            </p>
          </section>
  
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              3. Responsible Person for Content
            </h2>
            <p>
              <span className="font-semibold">Name:</span>&nbsp; Mahmood Rahman{" "}
              <br />
              <span className="font-semibold">Position:</span>&nbsp; Founder{" "}
              <br />
              <span className="font-semibold">Address:</span>&nbsp; Allmendstrasse
              18,&nbsp; CH 8154 Oberglatt
            </p>
          </section>
  
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">4. Disclaimer</h2>
            <p>
              Foodeez strives to provide accurate and up-to-date information, but
              no liability is assumed for completeness, accuracy, or timeliness.
              Foodeez contains links to external websites.&nbsp; We are not
              responsible for the content of linked external sites.&nbsp;
              Responsibility lies solely with the operators of those sites.
            </p>
          </section>
  
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              5. Intellectual Property Notice
            </h2>
            <p>
              All trademarks, business names, and logos displayed on Foodeez belong
              to their respective owners.&nbsp; The Foodeez brand, platform, and
              design are protected by copyright and intellectual property laws.
            </p>
          </section>
        </div>
      </main>
    );
  }
  
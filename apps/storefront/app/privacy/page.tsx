import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — bldr',
  description: 'Egyptian Personal Data Protection Law (PDPL Law 151/2020) compliance and student data privacy statement.',
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #E2E8F0', background: '#FFFFFF', padding: '16px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', textDecoration: 'none', letterSpacing: '-0.02em' }}>
            bldr<span style={{ color: '#2E6F5E' }}>.</span>
          </Link>
          <Link href="/products" style={{ fontSize: 13, fontWeight: 600, color: '#2E6F5E', textDecoration: 'none' }}>
            ← Back to Storefront
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: '40px auto', padding: '0 24px 60px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '40px 48px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Data Protection &amp; Privacy
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: '8px 0 16px', letterSpacing: '-0.03em' }}>
            Privacy Policy
          </h1>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 28 }}>
            Compliance with Egyptian Personal Data Protection Law (Law No. 151 of 2020) · Updated October 2026
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 14, lineHeight: 1.7, color: '#334155' }}>
            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>1. Scope &amp; Legal Framework</h2>
              <p style={{ margin: 0 }}>
                bldr Technologies LLC is committed to safeguarding personal data entrusted to us by students, parents, and partners. This policy outlines our collection, processing, and protection practices under the Egyptian Personal Data Protection Law (PDPL - Law No. 151 of 2020).
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>2. Information We Collect</h2>
              <p style={{ margin: '0 0 10px' }}>
                When you initiate an enrollment or checkout session, we collect:
              </p>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li><strong>Identity Data:</strong> Full Name, Student ID (if provided by brand LMS).</li>
                <li><strong>Contact Data:</strong> Email address, Egyptian mobile phone number (for WhatsApp/SMS payment notices).</li>
                <li><strong>Transaction Records:</strong> Order reference, billing amount in EGP, payment rail used, and timestamp.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>3. Security &amp; Cardholder Data Isolation</h2>
              <p style={{ margin: 0 }}>
                We do not store or process complete credit card numbers or CVV security codes on our infrastructure. Card payment data is collected directly by our PCI-DSS certified payment processors (Geidea and Paymob) using tokenized, encrypted client libraries under SAQ A / SAQ A-EP frameworks.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>4. Data Subject Rights</h2>
              <p style={{ margin: 0 }}>
                Under Egyptian Law 151/2020, you have the right to request access to your stored personal records, correct inaccurate details, or request deletion of non-accounting student logs by contacting <a href="mailto:privacy@bldrmanagement.com" style={{ color: '#2E6F5E', fontWeight: 600 }}>privacy@bldrmanagement.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

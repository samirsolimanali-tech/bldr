import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — bldr',
  description: 'Terms of service, billing policies, and merchant of record terms for bldr platform and checkout.',
};

export default function TermsPage() {
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
            Legal &amp; Compliance
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: '8px 0 16px', letterSpacing: '-0.03em' }}>
            Terms of Service
          </h1>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 28 }}>
            Effective Date: October 1, 2026 · Governed by the Laws of the Arab Republic of Egypt
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 14, lineHeight: 1.7, color: '#334155' }}>
            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>1. Merchant of Record (MoR) Relationship</h2>
              <p style={{ margin: 0 }}>
                bldr Technologies LLC (&quot;bldr&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is the sole Merchant of Record (MoR) for all financial transactions conducted across bldr-hosted payment links, checkout sessions, and branded educational ventures (including StudyHub Academy, Apex Classes, EL HESA Institute, and Career Hub). When you purchase a course, enrollment seat, or digital service, your payment is processed by bldr under our corporate acquiring licenses.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>2. Payment Processing &amp; Currencies</h2>
              <p style={{ margin: 0 }}>
                All transactions are denominated and billed in Egyptian Pounds (EGP) in minor units. Payments are securely acquired via our certified payment partners (Geidea, Paymob, and Fawry Pay). bldr adheres to PCI-DSS Level 1 compliance standards and does not store raw payment card data on our servers.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>3. Course Enrollment &amp; Delivery</h2>
              <p style={{ margin: 0 }}>
                Upon successful payment confirmation by the designated payment gateway, enrollment is granted automatically via authenticated server webhooks to the brand&apos;s learning management system (LMS). If you purchase via Fawry Kiosk reference code, access is granted upon physical cash deposit at an authorized Fawry retail terminal.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>4. Activation Codes &amp; Physical Vouchers</h2>
              <p style={{ margin: 0 }}>
                Prepaid activation codes issued through authorized learning centers, schools, or tutors entitle the bearer to access the specified course syllabus. Each activation code is single-use and cannot be redeemed more than once. Activation code redemptions represent zero-value financial transactions.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>5. Disputes &amp; Chargebacks</h2>
              <p style={{ margin: 0 }}>
                If you observe an unrecognized charge on your billing statement, please contact our support team at <a href="mailto:support@bldrmanagement.com" style={{ color: '#2E6F5E', fontWeight: 600 }}>support@bldrmanagement.com</a> before filing a bank dispute. Legitimate claims will be resolved directly under our Refund Policy.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

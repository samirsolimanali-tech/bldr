import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy — bldr',
  description: 'Official student refund guidelines, eligibility windows, and processing timelines.',
};

export default function RefundPolicyPage() {
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
            Consumer Protection
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: '8px 0 16px', letterSpacing: '-0.03em' }}>
            Refund &amp; Cancellation Policy
          </h1>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>
            Egyptian Consumer Protection Law No. 181 of 2018 · Updated October 2026
          </div>

          {/* Draft Legal Review Notice */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 16px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>
              DRAFT — PENDING FORMAL LEGAL COUNSEL REVIEW. Subject to compliance review under Egyptian Consumer Protection Law No. 181 of 2018 before commercial launch.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 14, lineHeight: 1.7, color: '#334155' }}>
            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>1. Standard Refund Window (14 Days)</h2>
              <p style={{ margin: 0 }}>
                In accordance with Egyptian Consumer Protection Law No. 181 of 2018, students are eligible for a refund on live course cohorts within fourteen (14) calendar days of initial payment, provided that fewer than 25% of live lectures or digital modules have been accessed.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>2. Non-Refundable Items</h2>
              <p style={{ margin: '0 0 10px' }}>
                The following offerings are non-refundable once redeemed or accessed:
              </p>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Prepaid scratch-card or digital activation codes once redeemed.</li>
                <li>Digital downloadable course materials and exam revision past-papers.</li>
                <li>1-on-1 private tutoring sessions completed or cancelled less than 24 hours in advance.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>3. Refund Execution &amp; Rails</h2>
              <p style={{ margin: 0 }}>
                Refunds are credited back to the original payment instrument used during checkout:
              </p>
              <ul style={{ margin: '8px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li><strong>Bank Cards:</strong> Returned to the issuing card within 5 to 14 business days, subject to Egyptian bank clearing cycles.</li>
                <li><strong>Mobile Wallets:</strong> Credited back to the originating mobile wallet within 24 to 48 hours.</li>
                <li><strong>Fawry Kiosk:</strong> Disbursed via Fawry cash-out voucher sent by SMS to the registered mobile number.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>4. How to Request a Refund</h2>
              <p style={{ margin: 0 }}>
                To request a refund, contact your brand&apos;s admissions coordinator or email <a href="mailto:refunds@bldrmanagement.com" style={{ color: '#2E6F5E', fontWeight: 600 }}>refunds@bldrmanagement.com</a> with your Order Reference Number and reason for cancellation. All requests are audited in the Central Financial Hub.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

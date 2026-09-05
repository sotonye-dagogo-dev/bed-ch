import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/layout/TrustBar';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Bedroom Chapters - how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16 px-4">
        <div className="container-custom max-w-3xl">
          <h1 className="text-3xl font-bold text-text mb-8">Privacy Policy</h1>
          <p className="text-text-muted mb-8">Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-text mb-4">1. Information We Collect</h2>
              <p className="text-text-muted mb-4">
                We collect the following types of information:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mb-4">
                <li><strong>Personal Information:</strong> Name, phone number, email address, delivery address</li>
                <li><strong>Order Information:</strong> Order history, payment method, delivery preferences</li>
                <li><strong>Usage Data:</strong> IP address, browser type, pages visited, referral source</li>
                <li><strong>Cookies:</strong> Session cookies for cart functionality, analytics cookies (Google Analytics, Meta Pixel, Hotjar)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">2. How We Use Your Information</h2>
              <p className="text-text-muted mb-4">
                We use your information for:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mb-4">
                <li>Processing and fulfilling orders</li>
                <li>Sending order confirmations and delivery updates via WhatsApp/SMS</li>
                <li>Improving our website and services</li>
                <li>Sending promotional communications (with your consent)</li>
                <li>Fraud prevention and security</li>
                <li>Compliance with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">3. Information Sharing</h2>
              <p className="text-text-muted mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mb-4">
                <li><strong>Payment Processors:</strong> Paystack for payment processing</li>
                <li><strong>Delivery Partners:</strong> Courier services for order delivery</li>
                <li><strong>Service Providers:</strong> Analytics providers (Google, Meta, Hotjar)</li>
                <li><strong>Legal Authorities:</strong> When required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">4. Data Security</h2>
              <p className="text-text-muted mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payments are processed through Paystack's secure PCI-DSS compliant infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">5. Data Retention</h2>
              <p className="text-text-muted mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Order records are kept for a minimum of 6 years for tax and accounting purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">6. Your Rights</h2>
              <p className="text-text-muted mb-4">
                Under Nigerian data protection law (NDPR), you have the right to:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mb-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure of your data</li>
                <li>Restrict processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-text-muted">
                To exercise these rights, contact us at privacy@bedroomchapters.ng or via WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">7. Cookies</h2>
              <p className="text-text-muted mb-4">
                We use cookies for:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mb-4">
                <li><strong>Essential:</strong> Session management, cart functionality</li>
                <li><strong>Analytics:</strong> Google Analytics (GA4), Meta Pixel, Hotjar</li>
              </ul>
              <p className="text-text-muted">
                You can manage cookie preferences through your browser settings. Disabling essential cookies may affect site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">8. Children's Privacy</h2>
              <p className="text-text-muted">
                Our Site is not directed to children under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">9. Changes to This Policy</h2>
              <p className="text-text-muted">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">10. Contact Us</h2>
              <p className="text-text-muted">
                If you have questions about this Privacy Policy or our data practices, contact us:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mt-2">
                <li>WhatsApp: <Link href={generateWhatsAppContactUrl()} className="text-primary hover:underline">Chat with us</Link></li>
                <li>Email: privacy@bedroomchapters.ng</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <TrustBar />
    </>
  );
}

function generateWhatsAppContactUrl(): string {
  const message = encodeURIComponent('Hello Bedroom Chapters! I have a question about your Privacy Policy.');
  return `https://wa.me/2348012345678?text=${message}`;
}
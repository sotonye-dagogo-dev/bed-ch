import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/layout/TrustBar';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Bedroom Chapters website and services.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16 px-4">
        <div className="container-custom max-w-3xl">
          <h1 className="text-3xl font-bold text-text mb-8">Terms of Service</h1>
          <p className="text-text-muted mb-8">Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-text mb-4">1. Acceptance of Terms</h2>
              <p className="text-text-muted">
                By accessing and using the Bedroom Chapters website ("the Site"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">2. Products and Pricing</h2>
              <p className="text-text-muted mb-4">
                All prices are in Nigerian Naira (₦) and include applicable taxes. We reserve the right to modify prices at any time without prior notice. Product images are for illustration purposes only and may differ from the actual product.
              </p>
              <p className="text-text-muted">
                While we strive to provide accurate product information, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">3. Orders and Payment</h2>
              <p className="text-text-muted mb-4">
                All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order for any reason, including but not limited to pricing errors or stock unavailability.
              </p>
              <p className="text-text-muted mb-4">
                We accept the following payment methods:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mb-4">
                <li>Card payments via Paystack (Visa, Mastercard, Verve)</li>
                <li>Bank transfer via Paystack</li>
                <li>USSD via Paystack</li>
                <li>Pay on Delivery (available in Lagos, Abuja & Port Harcourt for orders ≤₦50,000)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">4. Delivery</h2>
              <p className="text-text-muted mb-4">
                We offer the following delivery options:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mb-4">
                <li><strong>Standard Delivery:</strong> 3-5 business days (₦2,500, free on orders over ₦50,000)</li>
                <li><strong>Express Lagos:</strong> Same day if ordered before 12pm (₦5,000)</li>
                <li><strong>Pay on Delivery:</strong> 1-2 business days (₦1,500, Lagos/Abuja/PH only, orders ≤₦50,000)</li>
              </ul>
              <p className="text-text-muted">
                Delivery times are estimates and not guaranteed. We are not liable for delays caused by courier services, weather, or other unforeseen circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">5. Returns and Refunds</h2>
              <p className="text-text-muted mb-4">
                We offer a 7-day return policy on all unused products in their original packaging. To initiate a return:
              </p>
              <ol className="list-decimal list-inside text-text-muted space-y-2 mb-4">
                <li>Contact us within 7 days of delivery via WhatsApp or email</li>
                <li>Provide your order number and reason for return</li>
                <li>Items must be unused, in original packaging, with all tags attached</li>
                <li>Return shipping costs are borne by the customer unless the item is defective</li>
              </ol>
              <p className="text-text-muted">
                Refunds will be processed within 5-10 business days after we receive and inspect the returned items. Refunds are issued to the original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">6. Intellectual Property</h2>
              <p className="text-text-muted">
                All content on this Site, including text, graphics, logos, images, and software, is the property of Bedroom Chapters or its content suppliers and is protected by Nigerian and international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">7. Limitation of Liability</h2>
              <p className="text-text-muted">
                Bedroom Chapters shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Site or any products purchased. Our total liability shall not exceed the amount paid for the product.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">8. Governing Law</h2>
              <p className="text-text-muted">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">9. Changes to Terms</h2>
              <p className="text-text-muted">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Site constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text mb-4">10. Contact Information</h2>
              <p className="text-text-muted">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc list-inside text-text-muted space-y-2 mt-2">
                <li>WhatsApp: <Link href={generateWhatsAppContactUrl()} className="text-primary hover:underline">Chat with us</Link></li>
                <li>Email: support@bedroomchapters.ng</li>
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
  const message = encodeURIComponent('Hello Bedroom Chapters! I have a question about your Terms of Service.');
  return `https://wa.me/2348012345678?text=${message}`;
}
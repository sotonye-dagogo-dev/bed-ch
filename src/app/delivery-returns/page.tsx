import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/layout/TrustBar';
import { Truck, Shield, RotateCcw, Clock, MapPin, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Delivery & Returns',
  description: 'Delivery options, shipping information, and return policy for Bedroom Chapters orders in Nigeria.',
};

export default function DeliveryReturnsPage() {
  const deliveryOptions = [
    {
      name: 'Standard Delivery',
      price: '₦2,500 (Free on orders over ₦50,000)',
      time: '3-5 business days',
      coverage: 'Nationwide',
      icon: Truck,
      description: 'Reliable delivery across all 36 states and FCT. Orders typically arrive within 3-5 business days after dispatch.',
    },
    {
      name: 'Express Lagos',
      price: '₦5,000',
      time: 'Same day (order before 12pm)',
      coverage: 'Lagos State only',
      icon: Clock,
      description: 'Place your order before 12pm for same-day delivery within Lagos. Orders after 12pm delivered next business day.',
    },
    {
      name: 'Pay on Delivery',
      price: '₦1,500',
      time: '1-2 business days',
      coverage: 'Lagos, Abuja, Port Harcourt',
      icon: CreditCard,
      description: 'Pay cash or card when your order arrives. Available for orders up to ₦50,000. Our agent brings a POS terminal for card payments.',
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-20 pb-16 px-4">
        <div className="container-custom max-w-4xl">
          <h1 className="text-3xl font-bold text-text mb-8">Delivery & Returns</h1>

          {/* Delivery Options */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-text mb-6">Delivery Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {deliveryOptions.map((option, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <option.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">{option.name}</h3>
                  <p className="text-primary font-medium mb-2">{option.price}</p>
                  <div className="space-y-2 text-text-muted text-sm">
                    <p><strong>Delivery Time:</strong> {option.time}</p>
                    <p><strong>Coverage:</strong> {option.coverage}</p>
                    <p>{option.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Delivery Information */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-text mb-6">Delivery Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Delivery Areas</h3>
                    <p className="text-text-muted">
                      We deliver to all 36 states and the FCT via our courier partners. Express Lagos and Pay on Delivery have limited coverage as specified above.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Processing Time</h3>
                    <p className="text-text-muted">
                      Orders are processed within 24 hours (business days). Orders placed on weekends or public holidays will be processed the next business day.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Tracking</h3>
                    <p className="text-text-muted">
                      Once your order is dispatched, you'll receive a WhatsApp message with tracking details. You can also track your order in your account.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Pay on Delivery Details</h3>
                    <p className="text-text-muted">
                      For Pay on Delivery orders, payment is made to the delivery agent upon delivery. We accept cash and card payments (via POS terminal). Available for orders ≤₦50,000 in Lagos, Abuja & Port Harcourt only.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Returns Policy */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-text mb-6">7-Day Return Policy</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Eligibility</h3>
                    <p className="text-text-muted">
                      Returns accepted within 7 days of delivery. Items must be unused, in original packaging, with all tags and labels attached.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Non-Returnable Items</h3>
                    <p className="text-text-muted">
                      For hygiene reasons, the following cannot be returned: Pillows, bedsheets, duvet covers, nightwear, and any items that have been washed or used.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Defective Items</h3>
                    <p className="text-text-muted">
                      If you receive a defective or damaged item, contact us within 48 hours with photos. We'll arrange a free return and replacement or full refund.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Refund Method</h3>
                    <p className="text-text-muted">
                      Refunds are issued to the original payment method within 5-10 business days after we receive and inspect the returned items.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-bg-subtle rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text mb-4">How to Initiate a Return</h3>
              <ol className="list-decimal list-inside text-text-muted space-y-3">
                <li>Contact us via <Link href={generateWhatsAppContactUrl()} className="text-primary hover:underline">WhatsApp</Link> or email returns@bedroomchapters.ng</li>
                <li>Provide your order number, item(s) to return, and reason</li>
                <li>We'll provide return instructions and a return authorization number</li>
                <li>Pack items securely in original packaging with all accessories</li>
                <li>Ship to the address provided (customer bears return shipping unless item is defective)</li>
                <li>We'll process your refund within 5-10 business days of receiving the return</li>
              </ol>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold text-text mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group bg-bg border border-border rounded-lg p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-text">
                  <span>How long does delivery take?</span>
                  <RotateCcw className="h-5 w-5 text-text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="text-text-muted mt-4">Standard: 3-5 business days. Express Lagos: Same day (before 12pm). Pay on Delivery: 1-2 business days.</p>
              </details>

              <details className="group bg-bg border border-border rounded-lg p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-text">
                  <span>Is delivery free?</span>
                  <RotateCcw className="h-5 w-5 text-text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="text-text-muted mt-4">Standard delivery is free on orders over ₦50,000. Otherwise, it's ₦2,500. Express Lagos is ₦5,000. Pay on Delivery is ₦1,500.</p>
              </details>

              <details className="group bg-bg border border-border rounded-lg p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-text">
                  <span>Can I return bedsheets or pillows?</span>
                  <RotateCcw className="h-5 w-5 text-text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="text-text-muted mt-4">For hygiene reasons, bedsheets, pillows, duvet covers, and nightwear cannot be returned unless defective. Please check product details before ordering.</p>
              </details>

              <details className="group bg-bg border border-border rounded-lg p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-text">
                  <span>What if my item arrives damaged?</span>
                  <RotateCcw className="h-5 w-5 text-text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="text-text-muted mt-4">Contact us within 48 hours with photos of the damage. We'll arrange a free return and send a replacement or issue a full refund.</p>
              </details>

              <details className="group bg-bg border border-border rounded-lg p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-text">
                  <span>How do I track my order?</span>
                  <RotateCcw className="h-5 w-5 text-text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="text-text-muted mt-4">You'll receive a WhatsApp message with tracking details once your order is dispatched. You can also check order status in your account.</p>
              </details>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <TrustBar />
    </>
  );
}

function generateWhatsAppContactUrl(): string {
  const message = encodeURIComponent('Hello Bedroom Chapters! I have a question about delivery or returns.');
  return `https://wa.me/2348012345678?text=${message}`;
}
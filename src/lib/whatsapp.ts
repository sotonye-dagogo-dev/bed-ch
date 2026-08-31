const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348012345678';

export interface OrderForWhatsApp {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  deliveryOption: string;
  paymentMethod: string;
  total: number;
  items: Array<{
    name: string;
    size: string | null;
    color: string | null;
    quantity: number;
    price: number;
  }>;
  createdAt: Date;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

export function generateWhatsAppOrderUrl(phone: string, order: OrderForWhatsApp, type: 'customer' | 'admin'): string {
  const itemsText = order.items
    .map(item => {
      const size = item.size ? ` (${item.size})` : '';
      const color = item.color ? ` - ${item.color}` : '';
      return `• ${item.name}${size}${color} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}`;
    })
    .join('\n');

  const deliveryOptionLabels: Record<string, string> = {
    STANDARD: 'Standard Delivery (3-5 business days)',
    EXPRESS_LAGOS: 'Express Lagos (Same day)',
    PAY_ON_DELIVERY: 'Pay on Delivery (1-2 business days)',
  };

  const paymentMethodLabels: Record<string, string> = {
    PAYSTACK_CARD: 'Card (Paystack)',
    PAYSTACK_TRANSFER: 'Bank Transfer (Paystack)',
    PAYSTACK_USSD: 'USSD (Paystack)',
    PAY_ON_DELIVERY: 'Pay on Delivery',
  };

  let message: string;

  if (type === 'customer') {
    message = `🎉 *Order Confirmed!*\n\n`;
    message += `Hi ${order.customerName},\n\n`;
    message += `Thank you for your order! Here are your details:\n\n`;
    message += `*Order:* ${order.orderNumber}\n`;
    message += `*Date:* ${order.createdAt.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
    message += `*Items:*\n${itemsText}\n\n`;
    message += `*Delivery:* ${deliveryOptionLabels[order.deliveryOption] || order.deliveryOption}\n`;
    message += `*Address:* ${order.address}, ${order.city}, ${order.state}\n`;
    message += `*Payment:* ${paymentMethodLabels[order.paymentMethod] || order.paymentMethod}\n\n`;
    message += `*Total:* ${formatCurrency(order.total)}\n\n`;
    
    if (order.paymentMethod === 'PAY_ON_DELIVERY') {
      message += `💰 *Pay on Delivery:* You'll pay ₦${formatCurrency(order.total)} when your order arrives. Our delivery agent will bring a POS terminal for card payments.\n\n`;
    } else {
      message += `✅ *Payment Status:* Paid\n\n`;
    }
    
    message += `📦 We'll notify you when your order ships. For any questions, reply to this message or call us.\n\n`;
    message += `Thank you for shopping with Bedroom Chapters! 🛏️`;
  } else {
    message = `🔔 *NEW ORDER RECEIVED*\n\n`;
    message += `*Order:* ${order.orderNumber}\n`;
    message += `*Customer:* ${order.customerName}\n`;
    message += `*Phone:* ${order.customerPhone}\n`;
    message += `*Date:* ${order.createdAt.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
    message += `*Items:*\n${itemsText}\n\n`;
    message += `*Delivery:* ${deliveryOptionLabels[order.deliveryOption] || order.deliveryOption}\n`;
    message += `*Address:* ${order.address}, ${order.city}, ${order.state}\n`;
    message += `*Payment:* ${paymentMethodLabels[order.paymentMethod] || order.paymentMethod}\n\n`;
    message += `*Total:* ${formatCurrency(order.total)}\n\n`;
    
    if (order.paymentMethod === 'PAY_ON_DELIVERY') {
      message += `⚠️ *ACTION REQUIRED:* This is a Pay on Delivery order. Please confirm and schedule delivery.\n\n`;
    } else {
      message += `✅ *Payment:* Confirmed\n\n`;
    }
    
    message += `📋 Please process this order in the admin panel.`;
  }

  // Clean phone number (remove + and spaces)
  const cleanPhone = phone.replace(/[+\s]/g, '');
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function generateWhatsAppContactUrl(message?: string): string {
  const defaultMessage = 'Hello Bedroom Chapters! I\'d like to inquire about your products.';
  const encodedMessage = encodeURIComponent(message || defaultMessage);
  const cleanPhone = WHATSAPP_NUMBER.replace(/[+\s]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
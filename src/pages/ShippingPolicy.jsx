import React from 'react';
import { PolicyPage, LastUpdated } from './PolicyLayout';

const ShippingPolicy = () => (
  <PolicyPage title="Shipping Policy">
    <p>We aim to get your boots to you as quickly and affordably as possible. Here is everything you need to know about our shipping process.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Processing Time</h2>
    <p>Orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or holidays will begin processing the following business day. You will receive a confirmation email with tracking details once your order ships.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Shipping Rates and Methods</h2>
    <p>We offer standard shipping (5-8 business days) and express shipping (2-3 business days) options. Standard shipping is free on orders over $100. Shipping rates are calculated at checkout based on your location and selected method.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Domestic Shipping</h2>
    <p>We ship to all 50 states via reliable carriers including USPS, UPS, and FedEx. Delivery times may vary based on your location. Rural areas may experience slightly longer transit times.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>International Shipping</h2>
    <p>We currently ship to select international destinations. International orders may be subject to customs duties, taxes, and import fees, which are the responsibility of the customer. Delivery times for international orders can range from 10-20 business days.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Tracking Your Order</h2>
    <p>Once shipped, you will receive a tracking number via email. You can also track your order by logging into your account and visiting the orders section. If your tracking has not updated in several days, please contact our support team.</p>

    <LastUpdated />
  </PolicyPage>
);

export default ShippingPolicy;

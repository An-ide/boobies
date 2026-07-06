import React from 'react';
import { PolicyPage, LastUpdated } from './PolicyLayout';

const RefundPolicy = () => (
  <PolicyPage title="Return and Refund Policy">
    <p>We want you to love your purchase. If something isn't right, our return and refund policy is designed to make things easy.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Return Window</h2>
    <p>You have 30 days from the date of delivery to initiate a return. Items must be unworn, in original condition with all tags attached, and in the original packaging. Footwear must be returned in the original box.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>How to Initiate a Return</h2>
    <p>Log into your account and navigate to the orders section. Select the item you wish to return and follow the prompts. Alternatively, contact our support team and we will guide you through the process. Return shipping labels will be provided for defective or incorrect items.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Refund Processing</h2>
    <p>Once we receive and inspect your return, we will notify you of the approval status. Approved refunds will be processed within 5-10 business days and credited to your original payment method. Shipping costs are non-refundable unless the return is due to our error.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Exchanges</h2>
    <p>We offer free size exchanges within the 30-day return window. If you need a different size, initiate a return and place a new order for the correct size. Our team prioritizes exchange orders to ensure fast turnaround.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Non-Returnable Items</h2>
    <p>Certain items are not eligible for return, including final sale items, personalized products, and items worn or damaged beyond the original condition. Please inspect your order upon delivery.</p>

    <LastUpdated />
  </PolicyPage>
);

export default RefundPolicy;

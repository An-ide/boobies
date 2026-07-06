import React from 'react';
import { PolicyPage, LastUpdated } from './PolicyLayout';

const TermsAndConditions = () => (
  <PolicyPage title="Terms and Conditions">
    <p>Welcome to SpicX. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our services.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Account Registration</h2>
    <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Product Availability and Pricing</h2>
    <p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without prior notice. We strive to display accurate pricing and product information, but errors may occur. In such cases, we reserve the right to cancel or adjust orders accordingly.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Orders and Payment</h2>
    <p>By placing an order, you agree to pay the full amount specified at checkout. We accept major credit cards, PayPal, and cash on delivery where available. Orders are subject to acceptance and may be canceled by us in cases of suspected fraud or payment issues.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Intellectual Property</h2>
    <p>All content on this website, including text, images, logos, and designs, is the property of SpicX unless otherwise stated. You may not reproduce, distribute, or create derivative works without our express written consent.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Limitation of Liability</h2>
    <p>SpicX shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products. Our total liability is limited to the amount paid for the product in question.</p>

    <LastUpdated />
  </PolicyPage>
);

export default TermsAndConditions;

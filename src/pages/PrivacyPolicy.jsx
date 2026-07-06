import React from 'react';
import { PolicyPage, LastUpdated } from './PolicyLayout';

const PrivacyPolicy = () => (
  <PolicyPage title="Privacy Policy">
    <p>SpicX ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Information We Collect</h2>
    <p>We collect personal information you provide directly to us, such as your name, email address, shipping address, and payment details when you make a purchase or create an account. We also automatically collect certain information when you visit our site, including your IP address, browser type, device information, and browsing behavior through cookies and similar technologies.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>How We Use Your Information</h2>
    <p>We use your information to process and fulfill your orders, communicate with you about your purchases, send promotional materials (with your consent), improve our website and services, and comply with legal obligations.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Data Sharing and Disclosure</h2>
    <p>We do not sell your personal information. We may share your data with trusted third-party service providers who assist us in operating our website, processing payments, and delivering orders. These parties are contractually obligated to keep your information secure.</p>

    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginTop: 28 }}>Your Rights</h2>
    <p>You have the right to access, update, or delete your personal information. You may opt out of marketing communications at any time by contacting us or using the unsubscribe link in our emails.</p>

    <LastUpdated />
  </PolicyPage>
);

export default PrivacyPolicy;

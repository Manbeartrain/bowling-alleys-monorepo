import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Terms() {
  useEffect(() => {
    // SEO - Title
    const title = "Terms of Service – BowlingAlleys.io";
    document.title = title;

    // SEO - Meta Description
    const description = "Read the Terms of Service for BowlingAlleys.io. Learn about our user guidelines, content policies, and legal terms for using our bowling alley directory platform.";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Canonical URL
    const canonicalUrl = window.location.origin + "/terms";
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    // Open Graph
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', title);
    setOgTag('og:description', description);
    setOgTag('og:url', canonicalUrl);
    setOgTag('og:type', 'website');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-terms">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: October 9, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using BowlingAlleys.io ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                BowlingAlleys.io is a directory and review platform that helps users discover bowling alleys, compare prices, read reviews, and find specialized bowling experiences such as cosmic bowling, leagues, birthday party venues, and more. The Service allows users to browse venue information, submit reviews, and access bowling-related content.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Authentication</h2>
              <p className="text-muted-foreground mb-4">
                To submit reviews or access certain features, you may need to create an account using email/password or Google authentication. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                You must provide accurate, current, and complete information during registration and keep your account information updated.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">4. User-Generated Content and Reviews</h2>
              <p className="text-muted-foreground mb-4">
                When you submit reviews, ratings, or other content to BowlingAlleys.io, you agree that:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Your content is based on genuine personal experience with the bowling alley</li>
                <li>You will not post false, misleading, defamatory, or fraudulent reviews</li>
                <li>You will not submit content that violates any third-party rights</li>
                <li>You will not post spam, promotional content, or irrelevant material</li>
                <li>Your content does not contain offensive, discriminatory, or illegal material</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                By submitting content, you grant BowlingAlleys.io a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content on the Service.
              </p>
              <p className="text-muted-foreground mb-4">
                We reserve the right to remove any content that violates these terms or is otherwise objectionable, at our sole discretion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">5. Venue Information Accuracy</h2>
              <p className="text-muted-foreground mb-4">
                While we strive to provide accurate and up-to-date information about bowling alleys, including hours, pricing, amenities, and contact details, we cannot guarantee the accuracy of all information. Venue information may change without notice. Users should:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Verify important details directly with the bowling alley before visiting</li>
                <li>Understand that prices, hours, and availability are subject to change</li>
                <li>Contact venues directly for reservations, party bookings, or specific questions</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">6. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Violate any applicable local, state, national, or international law</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Submit false or fraudulent reviews</li>
                <li>Harass, abuse, or harm other users or bowling alley staff</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                <li>Use automated tools to scrape, copy, or harvest content without permission</li>
                <li>Interfere with or disrupt the Service or servers</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links and Services</h2>
              <p className="text-muted-foreground mb-4">
                The Service may contain links to third-party websites, including bowling alley websites, booking platforms, and other external resources. We are not responsible for the content, privacy policies, or practices of any third-party sites. Your use of third-party websites is at your own risk.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                The Service and its original content, features, and functionality are owned by BowlingAlleys.io and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service without express written permission.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="text-muted-foreground mb-4">
                We do not warrant that:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>The Service will be uninterrupted, secure, or error-free</li>
                <li>The results obtained from using the Service will be accurate or reliable</li>
                <li>Any errors in the Service will be corrected</li>
                <li>User-generated content is accurate, reliable, or trustworthy</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                IN NO EVENT SHALL BOWLINGALLEYS.IO, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                You agree to defend, indemnify, and hold harmless BowlingAlleys.io and its licensors, partners, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Service or your use of the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="text-muted-foreground mb-4">
                By continuing to access or use the Service after revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">13. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms of Service.
              </p>
              <p className="text-muted-foreground mb-4">
                Upon termination, your right to use the Service will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of the Service shall be resolved in the appropriate courts.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us through our{" "}
                <Link href="/contact" className="text-primary hover:underline" data-testid="link-contact">
                  Contact page
                </Link>
                .
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">16. Entire Agreement</h2>
              <p className="text-muted-foreground mb-4">
                These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and BowlingAlleys.io regarding the use of the Service, superseding any prior agreements between you and BowlingAlleys.io relating to your use of the Service.
              </p>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 p-6 bg-muted/30 rounded-lg">
            <p className="text-center text-muted-foreground mb-4">
              Ready to find your perfect bowling experience?
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/locations" data-testid="link-find-alleys">
                  Find Bowling Alleys
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/privacy" data-testid="link-privacy">
                  Privacy Policy
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

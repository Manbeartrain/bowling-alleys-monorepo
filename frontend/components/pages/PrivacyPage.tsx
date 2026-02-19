import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  useEffect(() => {
    // SEO - Title
    const title = "Privacy Policy – BowlingAlleys.io";
    document.title = title;

    // SEO - Meta Description
    const description = "Learn how BowlingAlleys.io collects, uses, and protects your personal information. Read our comprehensive privacy policy covering data collection, cookies, user rights, and security measures.";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Canonical URL
    const canonicalUrl = window.location.origin + "/privacy";
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-privacy">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: October 9, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                BowlingAlleys.io ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this policy carefully to understand our practices regarding your personal data.
              </p>
              <p className="text-muted-foreground mb-4">
                By using BowlingAlleys.io, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect several types of information to provide and improve our Service:
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information You Provide</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Account Information:</strong> When you create an account, we collect your email address and password (encrypted)</li>
                <li><strong>Google Authentication:</strong> If you sign in with Google, we receive your name, email address, and profile picture from Google</li>
                <li><strong>User Reviews:</strong> When you submit reviews or ratings, we collect the content you provide, including text, ratings, and the timestamp</li>
                <li><strong>Contact Information:</strong> If you contact us, we may collect your name, email address, and message content</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Usage Data:</strong> We collect information about how you interact with our Service, including pages visited, time spent, and features used</li>
                <li><strong>Device Information:</strong> We collect device type, operating system, browser type, IP address, and unique device identifiers</li>
                <li><strong>Location Data:</strong> We may collect approximate location based on your IP address to show relevant bowling alleys near you</li>
                <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to track activity and store certain information (see Section 5)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Provide and Maintain Service:</strong> To operate and maintain BowlingAlleys.io, including user accounts and review functionality</li>
                <li><strong>Personalization:</strong> To personalize your experience by showing relevant bowling alleys and content based on your location and preferences</li>
                <li><strong>Communication:</strong> To send you important updates, respond to inquiries, and provide customer support</li>
                <li><strong>Analytics and Improvements:</strong> To analyze how users interact with our Service and improve features, content, and user experience</li>
                <li><strong>Security and Fraud Prevention:</strong> To detect, prevent, and address technical issues, fraudulent activity, and violations of our Terms of Service</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations, enforce our policies, and protect our rights and the rights of others</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Public Information:</strong> Your reviews, ratings, and username are publicly visible to all users of the Service</li>
                <li><strong>Service Providers:</strong> We share information with third-party service providers who perform services on our behalf, including:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Firebase/Google Cloud for authentication and database hosting</li>
                    <li>Analytics providers (Google Analytics) to understand Service usage</li>
                    <li>Hosting and infrastructure providers</li>
                  </ul>
                </li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority, or to protect our rights, property, or safety</li>
                <li><strong>With Your Consent:</strong> We may share information for any other purpose with your explicit consent</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to track activity on our Service and store certain information. Technologies we use include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Cookies:</strong> Small data files stored on your device to track usage and preferences</li>
                <li><strong>Session Storage:</strong> Temporary storage that expires when you close your browser</li>
                <li><strong>Local Storage:</strong> Persistent storage used to maintain your authentication state and preferences</li>
                <li><strong>Analytics Tools:</strong> Google Analytics to collect and analyze usage patterns (you can opt-out via browser settings or Google's opt-out tools)</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Encryption of data in transit using HTTPS/SSL protocols</li>
                <li>Secure authentication using Firebase Authentication with encrypted passwords</li>
                <li>Regular security assessments and updates to our infrastructure</li>
                <li>Access controls limiting employee access to personal data</li>
                <li>Secure cloud storage with Google Cloud/Firebase security features</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">General Rights</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Access:</strong> Request access to your personal data we hold</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a structured, commonly used format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent was the basis</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">California Privacy Rights (CCPA)</h3>
              <p className="text-muted-foreground mb-4">
                If you are a California resident, you have additional rights including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Right to know what personal information is collected, used, shared, or sold</li>
                <li>Right to delete personal information held by us</li>
                <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
                <li>Right to non-discrimination for exercising your CCPA rights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">European Privacy Rights (GDPR)</h3>
              <p className="text-muted-foreground mb-4">
                If you are in the European Economic Area (EEA), you have rights under the GDPR including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Right to access, rectification, and erasure of your personal data</li>
                <li>Right to restrict or object to processing of your personal data</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent at any time</li>
                <li>Right to lodge a complaint with a supervisory authority</li>
              </ul>

              <p className="text-muted-foreground mb-4">
                To exercise any of these rights, please contact us through our{" "}
                <Link href="/contact" className="text-primary hover:underline" data-testid="link-contact">
                  Contact page
                </Link>
                .
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Retention periods vary based on:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after account closure</li>
                <li><strong>Reviews and Ratings:</strong> Retained indefinitely as part of our public content, unless you request deletion</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely for analytical purposes</li>
                <li><strong>Legal Requirements:</strong> Some data may be retained to comply with legal, tax, or accounting requirements</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground mb-4">
                BowlingAlleys.io is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
              <p className="text-muted-foreground mb-4">
                If we become aware that we have collected personal information from children under 13 without verification of parental consent, we will take steps to remove that information from our servers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">10. Third-Party Links and Services</h2>
              <p className="text-muted-foreground mb-4">
                Our Service may contain links to third-party websites, including bowling alley websites and external resources. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
              <p className="text-muted-foreground mb-4">
                Third-party services we integrate with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Google/Firebase:</strong> Authentication and database services (subject to Google's Privacy Policy)</li>
                <li><strong>Google Analytics:</strong> Website analytics (subject to Google's Privacy Policy)</li>
                <li><strong>Google Maps API:</strong> Location and mapping services (subject to Google's Privacy Policy)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
              <p className="text-muted-foreground mb-4">
                Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. If you are located outside the United States and choose to provide information to us, please note that we transfer the data to the United States and process it there.
              </p>
              <p className="text-muted-foreground mb-4">
                We take steps to ensure that your data is treated securely and in accordance with this Privacy Policy, and we use appropriate safeguards such as standard contractual clauses for international transfers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">12. Do Not Track Signals</h2>
              <p className="text-muted-foreground mb-4">
                Some web browsers have a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Currently, our Service does not respond to DNT signals. We may implement DNT support in the future as standards develop.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">13. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Posting the new Privacy Policy on this page with an updated "Last updated" date</li>
                <li>Sending an email notification to the email address associated with your account (for material changes)</li>
                <li>Displaying a prominent notice on our Service</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Your continued use of the Service after any changes indicates your acceptance of the updated Privacy Policy. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Through our{" "}
                  <Link href="/contact" className="text-primary hover:underline" data-testid="link-contact-bottom">
                    Contact page
                  </Link>
                </li>
                <li>By visiting our website at BowlingAlleys.io</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                We will respond to your request within a reasonable timeframe, typically within 30 days.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">15. Consent</h2>
              <p className="text-muted-foreground mb-4">
                By using BowlingAlleys.io, you consent to our Privacy Policy and agree to its terms. If you do not agree to this policy, please do not use our Service.
              </p>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 p-6 bg-muted/30 rounded-lg">
            <p className="text-center text-muted-foreground mb-4">
              Questions about your privacy? We're here to help.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/contact" data-testid="link-contact-cta">
                  Contact Us
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/terms" data-testid="link-terms">
                  Terms of Service
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

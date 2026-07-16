import type { Metadata } from "next";

import { LegalPage, LegalSection } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Saedra",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 16, 2026">
      <LegalSection heading="1. Acceptance of Terms">
        <p>
          By creating an account or using Saedra (&quot;the Service&quot;), you
          agree to be bound by these Terms of Service. If you do not agree, do
          not use the Service.
        </p>
      </LegalSection>

      <LegalSection heading="2. Description of the Service">
        <p>
          Saedra is an architectural memory and enforcement tool for software
          projects: a CLI, web dashboard, and API that record decisions, change
          events, and violation rules for a codebase, and validate diffs against
          that history.
        </p>
      </LegalSection>

      <LegalSection heading="3. Accounts">
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activity under your account. You must
          provide accurate information when creating an account.
        </p>
      </LegalSection>

      <LegalSection heading="4. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Use the Service for any unlawful purpose.</li>
          <li>
            Attempt to gain unauthorized access to other accounts, projects, or
            systems.
          </li>
          <li>
            Upload code, documents, or content you do not have the right to
            share.
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            Service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Your Content">
        <p>
          You retain ownership of the code, documents, and architectural memory
          records you submit to Saedra. You grant us a limited license to store
          and process that content solely to provide the Service to you.
        </p>
      </LegalSection>

      <LegalSection heading="6. Third-Party Services">
        <p>
          Saedra relies on third-party infrastructure providers (including
          database, hosting, and AI providers) to operate. Their processing of
          your data is described in our{" "}
          <a
            href="/privacy"
            className="text-foreground underline transition-colors hover:text-brand"
          >
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="7. Subscription and Fees">
        <p>
          Some features of the Service may require a paid plan. Fees, billing
          cycles, and cancellation terms will be presented at the time of
          purchase.
        </p>
      </LegalSection>

      <LegalSection heading="8. Termination">
        <p>
          We may suspend or terminate your access to the Service if you violate
          these Terms. You may stop using the Service and request account
          deletion at any time.
        </p>
      </LegalSection>

      <LegalSection heading="9. Disclaimers and Limitation of Liability">
        <p>
          The Service is provided &quot;as is&quot; without warranties of any
          kind. To the maximum extent permitted by law, Saedra is not liable for
          indirect, incidental, or consequential damages arising from your use
          of the Service.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Continued use of the
          Service after changes take effect constitutes acceptance of the
          revised Terms.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact">
        <p>
          Questions about these Terms can be sent to the contact channels listed
          on the Saedra website.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

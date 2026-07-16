import type { Metadata } from "next";

import { LegalPage, LegalSection } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Saedra",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 16, 2026">
      <LegalSection heading="1. Information We Collect">
        <p>We collect information you provide directly, including:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Account information: email address and password.</li>
          <li>
            Project data: architectural decisions, change events, violation
            rules, and code diffs you submit for review.
          </li>
          <li>
            Usage data: how you interact with the CLI, dashboard, and API.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Provide, operate, and maintain the Service.</li>
          <li>
            Generate architecture reviews and AI-assisted analysis you request.
          </li>
          <li>Communicate with you about your account and the Service.</li>
          <li>Improve the Service&apos;s reliability and features.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Third-Party Processors">
        <p>
          We use third-party providers to operate Saedra, including database and
          hosting infrastructure (Supabase, Vercel, Render), and, when you use
          AI-powered features, the AI provider you or we configure (such as
          Anthropic or OpenAI) to process the project context you submit. These
          providers process data on our behalf under their own data processing
          terms.
        </p>
      </LegalSection>

      <LegalSection heading="4. Data Retention">
        <p>
          We retain account and project data for as long as your account is
          active. You may request deletion of your account and associated data
          at any time.
        </p>
      </LegalSection>

      <LegalSection heading="5. Your Rights">
        <p>
          Depending on your jurisdiction, you may have the right to access,
          correct, export, or delete your personal data, and to object to or
          restrict certain processing. To exercise these rights, contact us
          through the channels listed on the Saedra website.
        </p>
      </LegalSection>

      <LegalSection heading="6. Cookies">
        <p>
          We use essential cookies to keep you signed in and to operate the
          dashboard. We do not use third-party advertising cookies.
        </p>
      </LegalSection>

      <LegalSection heading="7. Security">
        <p>
          We apply reasonable technical and organizational measures to protect
          your data, but no method of transmission or storage is completely
          secure.
        </p>
      </LegalSection>

      <LegalSection heading="8. International Data Transfers">
        <p>
          Your data may be processed in countries other than your own, by the
          infrastructure and AI providers described above.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will update
          the &quot;Last updated&quot; date above when we do.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact">
        <p>
          Questions about this Privacy Policy can be sent to the contact
          channels listed on the Saedra website.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 31, 2026">
      <p>
        This Privacy Policy explains what information RigMaintenance (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects when you use the Service, how we use it, and
        who we share it with.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect information you and your technicians provide directly:</p>
      <ul>
        <li>Account information: name, email address, and password (stored encrypted)</li>
        <li>Company information: company name and technician invite/assignment records</li>
        <li>
          Fleet records: unit and equipment details, checklist templates, inspection logs, service
          notes, and photos you upload
        </li>
      </ul>
      <p>
        We also automatically collect limited technical information needed to operate the Service,
        such as login timestamps and basic error logs.
      </p>

      <h2>2. How We Use Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and secure the Service</li>
        <li>Send account-related emails, such as password resets, invites, and maintenance reminders</li>
        <li>Diagnose and fix technical problems</li>
        <li>Communicate with you about the Service, including support requests</li>
      </ul>
      <p>We do not sell your personal information or your company&apos;s data to third parties.</p>

      <h2>3. Where Your Data Lives</h2>
      <p>
        Your data is stored using Supabase (database, authentication, and file storage) and hosted
        on Vercel. Transactional and reminder emails are sent through Resend. These providers process
        data on our behalf under their own security and privacy commitments — we don&apos;t share
        your data with them for their own marketing purposes.
      </p>

      <h2>4. Data Sharing Within Your Company</h2>
      <p>
        RigMaintenance is built for teams. Depending on their role, technicians you invite to your
        company account may be able to view or contribute to unit, equipment, and inspection
        records — access is scoped by the admin controls within the app (for example, an admin
        chooses which units a technician can access, and which submitted photos are visible to
        technicians).
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your data for as long as your account is active. If you close your account, we&apos;ll
        delete or anonymize your data within a reasonable period, except where we&apos;re required to
        keep it longer for legal or security reasons.
      </p>

      <h2>6. Your Choices</h2>
      <p>
        You can access, correct, or delete most of your data directly within the app. To request a
        full export or deletion of your account data, email support@rigmaintenance.net.
      </p>

      <h2>7. Cookies</h2>
      <p>
        We use a small number of essential cookies to keep you signed in and to keep the Service
        working correctly. We don&apos;t use advertising or cross-site tracking cookies.
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        The Service is intended for business use by adults and is not directed at children. We
        don&apos;t knowingly collect information from anyone under 18.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make material changes, we&apos;ll
        notify you by email or through the Service before they take effect.
      </p>

      <h2>10. Contact</h2>
      <p>Questions about this policy or your data? Reach us at support@rigmaintenance.net.</p>
    </LegalPage>
  );
}

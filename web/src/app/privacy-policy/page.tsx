import Link from 'next/link';

import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/privacy-policy',
  title: 'Privacy Policy',
  description:
    'This Privacy Policy explains how we collect, use, and protect personal information when you interact with our website job-keeper.znagy.hu.',
});

export default function PrivacyPolicyPage() {
  return (
    <main className="container flex flex-col gap-8 py-20">
      <h1 className="text-4xl font-bold text-balance">Privacy Policy</h1>

      <div className="flex flex-col gap-10">
        <div className="text-muted-foreground leading-relaxed">
          <p>
            <b>Effective Date:</b> October 13, 2025
          </p>
          <p>
            <b>Last Updated:</b> October 13, 2025
          </p>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-foreground/90 leading-relaxed">
            This Privacy Policy explains how we collect, use, and protect personal information when
            you interact with our website{' '}
            <Link href="https://job-keeper.znagy.hu" className="font-bold underline">
              job-keeper.znagy.hu
            </Link>{' '}
            (&quot;the Service&quot; or &quot;our website&quot;). We are committed to safeguarding
            your privacy and ensuring the security of your personal data.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <p className="text-foreground/90 leading-relaxed">
            We collect personal information that you voluntarily provide to us when you register for
            an account, use our services, or interact with our website. This information is
            primarily used to provide and improve the functionality of the Job Keeper application.
          </p>
          <h3 className="text-xl font-medium">Information collected includes:</h3>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li className="text-foreground/90 leading-relaxed">
              <strong>User ID:</strong> A unique identifier associated with your account, provided
              by our authentication service (Clerk), and used to link your data within the
              application.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>Position Details:</strong> Names of positions and their associated wages that
              you enter.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>Job Details:</strong> Information about your jobs, including location, event
              details (optional), date, and hours worked. This data is linked to your entered
              positions.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>Expense Details:</strong> Names of expenses, their amounts, and the dates
              incurred.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>User Preferences:</strong> Your selected currency, locale, and precision
              settings for the application.
            </li>
          </ul>
          <p className="text-foreground/90 leading-relaxed">
            When you create an account or log in, Clerk, our authentication provider, collects and
            manages your registration and login information (e.g., email address, social media login
            if used). We receive a unique user ID from Clerk to identify your data within our
            application. We do not directly store your email address or other authentication
            credentials on our database.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <p className="text-foreground/90 leading-relaxed">
            The information we collect is used solely to provide, maintain, and improve the{' '}
            <Link href="https://job-keeper.znagy.hu" className="font-bold underline">
              job-keeper.znagy.hu
            </Link>{' '}
            service. Specifically, we use your data to:
          </p>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li className="text-foreground/90 leading-relaxed">
              Manage your positions, jobs, and expenses.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              Calculate earnings and track financial data.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              Personalize your experience based on your preferences.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              Ensure the proper functioning of the application.
            </li>
          </ul>
          <p className="text-foreground/90 leading-relaxed">
            <b>We do not sell, rent, or share</b> your personal information with third parties for
            marketing purposes.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">4. Data Storage and Security</h2>
          <p className="text-foreground/90 leading-relaxed">
            We are committed to protecting your data and employ reasonable technical and
            organizational measures to safeguard the information we collect.
          </p>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li className="text-foreground/90 leading-relaxed">
              <strong>Database:</strong> Your application data (positions, jobs, expenses, user
              preferences) is stored in a MySQL database hosted by{' '}
              <Link
                className="font-bold underline"
                href="https://aiven.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aiven
              </Link>{' '}
              in the EU-Central-1 (Frankfurt) region.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>Web Application Hosting:</strong> The{' '}
              <Link href="https://job-keeper.znagy.hu" className="font-bold underline">
                job-keeper.znagy.hu
              </Link>{' '}
              web application is hosted on{' '}
              <Link
                className="font-bold underline"
                href="https://vercel.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </Link>{' '}
              in the EU-Central-1 (Frankfurt) region.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>Authentication Data:</strong> Your authentication credentials (e.g., email
              address, hashed passwords) are securely handled and stored by{' '}
              <Link
                className="font-bold underline"
                href="https://clerk.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clerk
              </Link>
              . We do not store these directly in our database.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>Data Protection:</strong> We utilize the security features provided by Aiven,
              Vercel, and Clerk, which include measures such as encryption in transit and at rest,
              network firewalls, and access controls. We regularly review our security practices to
              protect against unauthorized access, alteration, disclosure, or destruction of your
              personal information.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">5. Third-Party Services</h2>
          <p className="text-foreground/90 leading-relaxed">
            We rely on the following third-party services to provide our application:
          </p>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li className="text-foreground/90 leading-relaxed">
              <Link
                className="font-bold underline"
                href="https://clerk.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clerk
              </Link>
              : Our authentication and user management platform. Your use of Clerk is subject to
              Clerk&apos;s{' '}
              <Link
                className="font-bold underline"
                href="https://clerk.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
              .
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <Link
                className="font-bold underline"
                href="https://vercel.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </Link>
              : Hosts our web application. Your use of the service is also subject to Vercel&apos;s{' '}
              <Link
                className="font-bold underline"
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
              .
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <Link
                className="font-bold underline"
                href="https://aiven.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aiven
              </Link>
              : Provides our managed MySQL database service. Your data stored on Aiven is subject to
              Aiven&apos;s{' '}
              <Link
                className="font-bold underline"
                href="https://aiven.io/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
              .
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">6. Your Rights</h2>
          <p className="text-foreground/90 leading-relaxed">
            You have certain rights regarding your personal information, including:
          </p>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li className="text-foreground/90 leading-relaxed">
              <strong>Access and Correction:</strong> You can access, review, and correct your
              application data directly within the Job Keeper application. For information managed
              by Clerk, you can usually access and manage it through your Clerk account settings.
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>Deletion:</strong> You may request the deletion of your account and all
              associated application data. Please contact us to initiate this process. Note that
              deletion of your Clerk account may be a separate process managed directly by Clerk.
            </li>
          </ul>
          <p className="text-foreground/90 leading-relaxed">
            To exercise these rights, please contact us at the details provided in the &quot;Contact
            Us&quot; section.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">7. Changes to This Policy</h2>
          <p className="text-foreground/90 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or for other operational, legal, or regulatory reasons. The “Last Updated” date at the
            top will indicate when the policy was last revised. We encourage you to review this
            policy periodically.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
          <p className="text-foreground/90 leading-relaxed">
            For any questions or concerns about this Privacy Policy or our data practices, please
            contact us at:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-0">
            <li className="text-foreground/90 leading-relaxed">
              <strong>Email:</strong>{' '}
              <Link href="mailto:znagy@znagy.hu" className="font-bold underline">
                znagy@znagy.hu
              </Link>
            </li>
            <li className="text-foreground/90 leading-relaxed">
              <strong>Website:</strong>{' '}
              <Link href="https://job-keeper.znagy.hu" className="font-bold underline">
                job-keeper.znagy.hu
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

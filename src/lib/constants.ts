/**
 * PLACEHOLDER VALUES — replace before launch.
 * No real handles, emails or phone numbers are used here on purpose.
 */

export const SITE_NAME = "Salman Ali";
export const SITE_TAGLINE = "Digital Creator";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const SITE_DESCRIPTION =
  "Salman Ali is a digital creator building content, products and ideas at the intersection of media and technology. [Placeholder description — replace with real positioning.]";

export interface SocialLink {
  label: string;
  href: string;
}

/** Replace href values with real profile URLs before launch. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "YouTube", href: "https://youtube.com/@your-handle" },
  { label: "Instagram", href: "https://instagram.com/your-handle" },
  { label: "X (Twitter)", href: "https://x.com/your-handle" },
  { label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
];

/** Replace with a real contact address before launch (or wire the form to an email service). */
export const CONTACT_EMAIL = "contact@example.com";

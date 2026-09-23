const titles = {
  home: "A real connection. No connection required.",
  "pvc-business-cards": "Your brand. In their hands.",
  "nfc-business-cards": "Smart card. No strings.",
  "design-support": "Good design opens doors.",
  about: "Less friction. More connection.",
  faq: "Good questions. Straight answers.",
  contact: "Let’s make your introduction.",
  articles: "A little knowledge. A better connection.",
};

const descriptions = {
  home: "Custom PVC and direct-data NFC business cards. Contact sharing without a hosted profile or monthly subscription. Made for better introductions.",
  "pvc-business-cards":
    "Custom printed PVC business cards with single-sided or double-sided print and an optional direct-data QR code.",
  "nfc-business-cards":
    "Contact details stored directly on an NFC chip, with an optional direct-data QR code. Explore offline sharing and phone compatibility.",
  "design-support":
    "Bring your finished artwork or work with Cardistry to turn your brief into a considered business card.",
  about:
    "Discover Cardistry’s approach to direct-data business cards, thoughtful design and simpler professional introductions.",
  faq: "Answers about offline NFC business cards, direct-data QR codes, printing, compatibility and updating contact information.",
  contact:
    "Request a personalised quote for PVC or NFC business cards and design support.",
  articles:
    "Practical guides to offline NFC, contact QR codes and preparing business card artwork.",
};

export interface PageMetadata {
  path: string;
  label: string;
  title: string;
  description: string;
}
export type PageKey =
  | "home"
  | "pvc-business-cards"
  | "nfc-business-cards"
  | "design-support"
  | "about"
  | "faq"
  | "contact"
  | "articles";
export const navigation: readonly {
  key: PageKey;
  label: string;
  href: string;
}[] = [
  {
    key: "nfc-business-cards",
    label: "NFC Business Cards",
    href: "/nfc-business-cards/",
  },
  {
    key: "pvc-business-cards",
    label: "PVC Business Cards",
    href: "/pvc-business-cards/",
  },
  {
    key: "design-support",
    label: "Design Support",
    href: "/design-support/",
  },
  {
    key: "about",
    label: "About",
    href: "/about/",
  },
  {
    key: "faq",
    label: "FAQ",
    href: "/faq/",
  },
  {
    key: "articles",
    label: "Articles",
    href: "/articles/",
  },
  {
    key: "contact",
    label: "Contact",
    href: "/contact/",
  },
];
export const pages: Record<PageKey, PageMetadata> = Object.fromEntries(
  [{ key: "home", label: "Home", href: "/" }, ...navigation].map(
    ({ key, label, href }) => [
      key,
      {
        path: href,
        label,
        title: titles[key as PageKey],
        description: descriptions[key as PageKey],
      },
    ],
  ),
) as Record<PageKey, PageMetadata>;

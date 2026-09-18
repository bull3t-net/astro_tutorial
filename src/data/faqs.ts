export interface Faq {
  question: string;
  answer: string;
}

export const faqs: readonly Faq[] = [
  {
    question: "Do your NFC cards need an internet connection?",
    answer:
      "The contact details are encoded directly on the NFC chip rather than fetched from a hosted profile. Reading those details can work offline on a compatible phone and reader. Opening websites, sending emails or using other online services still needs connectivity.",
  },
  {
    question: "Will it work on every iPhone and Android phone?",
    answer:
      "Not universally. NFC hardware alone does not guarantee support for a direct contact record. Support depends on the phone, operating system and NFC record format. iPhone background NFC reading is generally geared towards supported URI records, not arbitrary contact records. Please ask us to check your intended devices before ordering. Some phones may need a compatible reader app.",
  },
  {
    question: "Can a QR code work offline too?",
    answer:
      "Yes. A direct-data contact QR contains the contact details themselves, not just a website address. A compatible scanner can read that data without internet. Contact import behaviour varies between camera and scanner apps. The QR is optional and must be included in the artwork before printing.",
  },
  {
    question: "Is there a monthly subscription?",
    answer:
      "No. Cardistry’s direct-data cards do not require a hosted profile subscription or a monthly Cardistry fee. Your quote will set out the requested cards, printing and any design work. Future redesigns, reprints or additional work are separate purchases.",
  },
  {
    question: "Can I change the details later?",
    answer:
      "A writable, unlocked NFC chip can be rewritten with compatible hardware and software, subject to its capacity. This is not a remote dashboard update. Permanently locked chips cannot be rewritten, and a printed QR code needs reprinting if the encoded data changes. Confirm your update requirements when ordering.",
  },
  {
    question: "What can be stored on the card?",
    answer:
      "Typically a name, company, phone number and email address, with additional fields where the chosen format and chip capacity allow. We recommend keeping it focused. A website address can be included, but visiting the website requires internet.",
  },
  {
    question: "What print options are available?",
    answer:
      "Choose single-sided or double-sided print on PVC. NFC-enabled PVC is the smart option; Non-NFC PVC is the print-only option. An optional direct-data QR can be considered for either.",
  },
  {
    question: "Can you help with the design?",
    answer:
      "Yes. Send finished artwork or choose design support and share a brief. Include your logo, brand colours, contact information and any inspiration. Design scope and cost are confirmed in your quote.",
  },
  {
    question: "How much do cards cost, and how long do they take?",
    answer:
      "Request a quote with your quantity, print route, NFC or Non-NFC preference and design requirements. Pricing and production timing are confirmed for your order; this website does not promise unverified prices or delivery dates.",
  },
  {
    question: "Are my details private?",
    answer:
      "A business card is designed to share information. Someone with physical access and a compatible reader can read the details on the chip or QR. Only include information you intend to share publicly. The demonstration on this website does not write to a chip or send your details to a server.",
  },
];

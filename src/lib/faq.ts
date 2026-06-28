/**
 * Canonical FAQ list. Single source of truth shared by the on-page FAQ section
 * (with FAQPage JSON-LD) and the AI chat's grounding prompt.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Do you build custom fish tanks and aquariums?',
    answer:
      'Yes. We design and build fully custom fish tanks and aquariums for homes and businesses, tailored to your space, water type and requirements, in both glass and acrylic.',
  },
  {
    question: 'Which areas do you serve?',
    answer:
      'We are based in Umm Al Quwain, UAE, and deliver projects across the UAE and the wider GCC, including Dubai, Abu Dhabi, Sharjah, Saudi Arabia, Oman, Lebanon, and Bahrain.',
  },
  {
    question: 'What types of tanks do you make?',
    answer:
      'Saltwater and freshwater display tanks, coral reef tanks, commercial rack systems, and lobster or holding tanks, from small home aquariums to large commercial installations.',
  },
  {
    question: 'Do you make aquarium cabinets and stands?',
    answer:
      'Yes. We build aluminium and MDF cabinets engineered to safely support and complement your tank.',
  },
  {
    question: 'Do you offer acrylic fabrication?',
    answer:
      'Yes. We produce custom acrylic boxes, filter boxes and components using precision laser cutting.',
  },
  {
    question: 'How long has Vinoos Trading EST. been in business?',
    answer:
      'We have been designing and building custom aquariums and fabrication projects since 1997.',
  },
  {
    question: 'How do I get a quote?',
    answer:
      'Contact us by phone or email, or use the contact section on this site, and we will discuss your project and provide a quote.',
  },
];

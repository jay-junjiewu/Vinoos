
import type { Project, Equipment, ProjectCategory, HeroImage } from '@/types';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Fish Tank' },
  { href: '/acrylic-projects', label: 'Acrylic' },
  { href: '/cabinet-projects', label: 'Cabinet' },
  { href: '/equipment', label: 'Equipment' },
  { href: '/#contact', label: 'Contact Us' },
];

export const FISH_TANK_PROJECT_CATEGORIES: ProjectCategory[] = [
  'All', // Special category for showing all projects
  'Saudi Arabia',
  'Dubai',
  'Abu Dhabi',
  'Oman',
];

export const ACRYLIC_PROJECT_CATEGORIES: ProjectCategory[] = [
  'All', // Special category for showing all projects
  'Box',
];

export const CABINET_PROJECT_CATEGORIES: ProjectCategory[] = [ // New categories for cabinets
  'All',
  'Aluminum',
  'MDF',
];

export const FISH_TANK_PROJECTS_DATA: Project[] = [
  {
    id: '14',
    title: 'Fish Shop Tank System',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T14-1.jpeg', hint: 'T14-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T14-2.jpeg', hint: 'T14-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T14-3.jpeg', hint: 'T14-3' },
    ],
    categories: ['Dubai'],
  },
  {
    id: '1',
    title: 'Precision Laser Tank Balancing',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T1-1.jpg', hint: 'T1-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T1-2.jpg', hint: 'T1-2' },
    ],
    categories: ['Saudi Arabia'],
  },
  {
    id: '2',
    title: 'Saltwater Tank',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T2-3.jpg', hint: 'T2-3' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T2-1.jpg', hint: 'T2-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T2-2.jpg', hint: 'T2-2' },
    ],
    categories: ['Dubai'],
  },
  {
    id: '5',
    title: 'Acrylic Tank Partitioning',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T5-1.jpeg', hint: 'T5-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T5-2.jpeg', hint: 'T5-2' },
    ],
    categories: ['Abu Dhabi'],
  },
  {
    id: '6',
    title: 'Display Tank',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T6-1.jpeg', hint: 'T6-1' },
    ],
    categories: ['Abu Dhabi'],
  },
  {
    id: '3',
    title: 'Multi-Level Display Tank',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T3-1.jpg', hint: 'T3-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T3-2.jpg', hint: 'T3-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T3-3.jpg', hint: 'T3-3' },
    ],
    categories: ['Abu Dhabi'],
  },
  {
    id: '4',
    title: 'Saltwater Plumbing System',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T4-1.jpg', hint: 'T4-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T4-2.jpg', hint: 'T4-2' },
    ],
    categories: ['Oman'],
  },
  {
    id: '7',
    title: 'Seamless Coral Tank',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T7-1.jpeg', hint: 'T7-1' },
    ],
    categories: ['Abu Dhabi'],
  },
  {
    id: '8',
    title: 'Home Saltwater Tank',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T8-1.jpg', hint: 'T8-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T8-2.jpg', hint: 'T8-2' },
    ],
    categories: ['Dubai'],
  },
  {
    id: '9',
    title: 'Rack System for Fish Shop',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T9-2.jpeg', hint: 'T9-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T9-1.jpeg', hint: 'T9-1' },
    ],
    categories: ['Dubai'],
  },
  {
    id: '10',
    title: 'Lobster Tank',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T10-1.jpeg', hint: 'T10-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T10-2.jpeg', hint: 'T10-2' },
    ],
    categories: ['Dubai'],
  },
  {
    id: '11',
    title: 'Shrink-Wrapped for Delivery',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T11-1.jpeg', hint: 'T11-1' },
    ],
    categories: ['Dubai'],
  },
  {
    id: '12',
    title: 'Fish Tank Rack',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T12-1.jpeg', hint: 'T12-1' },
    ],
    categories: ['Dubai'],
  },
  {
    id: '13',
    title: 'Small Tank',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T13-1.jpeg', hint: 'T13-1' },
    ],
    categories: ['Dubai'],
  },
];

export const ACRYLIC_PROJECTS_DATA: Project[] = [
  {
    id: 'A1',
    title: 'Display Box',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Acrylic/A1-1.jpeg', hint: 'A1-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Acrylic/A1-2.jpeg', hint: 'A1-2' },
    ],
    categories: ['Box'],
  },
  {
    id: 'A2',
    title: 'Filter Box',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Acrylic/A2-1.jpg', hint: 'A2-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Acrylic/A2-2.jpg', hint: 'A2-2' },
    ],
    categories: ['Box'],
  },
  {
    id: 'A3',
    title: 'Acrylic Box',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Acrylic/A3-1.jpeg', hint: 'A3-1' },
    ],
    categories: ['Box'],
  },
  {
    id: 'A4',
    title: 'Filter Box for Saltwater',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Acrylic/A4-1.jpeg', hint: 'A4-1' },
    ],
    categories: ['Box'],
  },
];

export const CABINET_PROJECTS_DATA: Project[] = [
  {
    id: 'C1',
    title: 'Cooling Lightbox with Fans',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Cabinet/C1-1.jpeg', hint: 'C1-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Cabinet/C1-2.jpeg', hint: 'C1-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Cabinet/C1-3.jpeg', hint: 'C1-3' },
    ],
    categories: ['Aluminum'],
  },
  {
    id: 'C2',
    title: 'MDF Cabinet',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Cabinet/C2-1.jpeg', hint: 'C2-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Cabinet/C2-2.jpeg', hint: 'C2-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Cabinet/C2-3.jpeg', hint: 'C2-3' },
    ],
    categories: ['MDF'],
  },
  {
    id: 'C3',
    title: 'Aluminum-Supported Cabinet',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Cabinet/C3-2.jpeg', hint: 'C3-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Cabinet/C3-1.jpeg', hint: 'C3-1' },
    ],
    categories: ['Aluminum'],
  },
];


export const EQUIPMENT_DATA: Equipment[] = [
  {
    id: 'eq1',
    name: 'Laser Cutter',
    description: 'High-performance laser cutter.',
    imageUrl: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Equipment/E1.jpeg',
    imageHint: 'E1',
  },
];

// Canonical list of areas Vinoos serves. Update here to change it everywhere
// (structured data, metadata descriptions and on-page copy all reference this).
export const SERVICE_AREAS = [
  'United Arab Emirates',
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Saudi Arabia',
  'Oman',
  'Lebanon',
  'Bahrain',
];

// Human-readable list for prose (excludes the umbrella "United Arab Emirates").
export const SERVICE_AREA_TEXT =
  'Dubai, Abu Dhabi, Sharjah, Saudi Arabia, Oman, Lebanon and Bahrain';

export const BUSINESS_INFO = {
  name: 'Vinoos Trading EST.',
  phone: '+971 50 631 3648',
  email: 'vinoos@vinoostrading.com',
  address: 'Umm Al Thuoob - UAQ - UAE',
  googleMapsLink: 'https://maps.app.goo.gl/agFPCt9HdoTREx1Z6',
  instagramHandle: '@wuvinoos',
  instagramUrl: 'https://www.instagram.com/wuvinoos/',
  facebookHandle: 'Vinoos Trading EST.',
  facebookUrl: 'https://www.facebook.com/p/Vinoos-Trading-EST-100055132917246/',
  hours: [
    'All Day: 9:00 AM - 6:00 PM',
  ],
};

export const HERO_IMAGES: HeroImage[] = [
  { id: 'hero3', url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images//Cover3.jpg', alt: 'Custom-built aquarium and fish tank by Vinoos Trading EST. in the UAE', hint: 'Cover3', },
  { id: 'hero2', url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T10-1.jpeg', alt: 'Custom commercial lobster aquarium tank built by Vinoos Trading EST.', hint: 'Cover2', },
];


import type { Project, Equipment, ProjectCategory, HeroImage } from '@/types';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Fish Tank' },
  { href: '/acrylic-projects', label: 'Acrylic Project' },
  { href: '/equipment', label: 'Equipment' },
];

export const FISH_TANK_PROJECT_CATEGORIES: ProjectCategory[] = [
  'All', // Special category for showing all projects
  'Freshwater',
  'Saltwater',
  'Saudi Arabia',
  'Dubai',
  'Abu Dhabi',
  'Oman',
];

export const ACRYLIC_PROJECT_CATEGORIES: ProjectCategory[] = [
  'All', // Special category for showing all projects
  'Acrylic',
  'Box',
];


export const FISH_TANK_PROJECTS_DATA: Project[] = [
  {
    id: '1',
    title: 'Project Title',
    description: 'Project Description...',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T1-1.jpg', hint: 'T1-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T1-2.jpg', hint: 'T1-2' },
    ],
    categories: ['Large Tank', 'Saudi Arabia'],
  },
  {
    id: '2',
    title: 'Project Title',
    description: 'Project Description...',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T2-1.jpg', hint: 'T2-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T2-2.jpg', hint: 'T2-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T2-3.jpg', hint: 'T2-3' },
    ],
    categories: ['Saltwater', 'Dubai'],
  },
  {
    id: '3',
    title: 'Project Title',
    description: 'Project Description...',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T3-1.jpg', hint: 'T3-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T3-2.jpg', hint: 'T3-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T3-3.jpg', hint: 'T3-3' },
    ],
    categories: ['Freshwater', 'Abu Dhabi'],
  },
  {
    id: '4',
    title: 'Project Title',
    description: 'Project Description...',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T4-1.jpg', hint: 'T4-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T4-2.jpg', hint: 'T4-2' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T4-3.jpg', hint: 'T4-3' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Fish_Tanks/T4-4.jpg', hint: 'T4-4' },
    ],
    categories: ['Freshwater', 'Oman'],
  },
];

export const ACRYLIC_PROJECTS_DATA: Project[] = [
  {
    id: '2',
    title: 'Project Title',
    description: 'Project Description...',
    images: [
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Acrylic/A2-1.jpg', hint: 'A2-1' },
      { url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Acrylic/A2-2.jpg', hint: 'T2-2' },
    ],
    categories: ['Acrylic', 'Box'],
  },
];

export const EQUIPMENT_DATA: Equipment[] = [
  {
    id: 'eq1',
    name: 'CNC',
    description: 'High-performance CNC.',
    imageUrl: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Equipment/E1.png',
    imageHint: 'E1',
  },
  {
    id: 'eq2',
    name: 'Laser Cutter',
    description: 'High-performance laser cutter.',
    imageUrl: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images/Equipment/E2.png',
    imageHint: 'E2',
  },
];

export const BUSINESS_INFO = {
  name: 'Vinoos Trading EST.',
  phone: '+971 52 970 1938',
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
  { id: 'hero1', url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images//Cover1.jpg', alt: 'Stunning custom aquarium build', hint: 'Cover1', },
  { id: 'hero2', url: 'https://kdbmcsdqyebekzmliqgh.supabase.co/storage/v1/object/public/images//Cover2.jpg', alt: 'Vibrant coral reef tank', hint: 'Cover2', },
];

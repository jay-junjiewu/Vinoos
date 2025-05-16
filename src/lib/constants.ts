
import type { Project, Equipment, ProjectCategory, HeroImage } from '@/types';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Fish Tank' },
  { href: '/acrylic-projects', label: 'Acrylic Project' },
  { href: '/equipment', label: 'Equipment' },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'All', // Special category for showing all projects
  'Freshwater',
  'Saltwater',
  'Planted Tank',
  'Nano Tank',
  'Biotope',
  'Predator Tank',
  'Community Tank',
  'Reef Tank',
  'Acrylic',
];


export const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    title: 'Serene Freshwater Scape',
    description: 'A calming 75-gallon freshwater aquarium with lush live plants and peaceful community fish.',
    images: [
      { url: 'https://picsum.photos/seed/project1a/1200/800', hint: 'freshwater plants' },
      { url: 'https://picsum.photos/seed/project1b/1200/800', hint: 'community fish' },
      { url: 'https://picsum.photos/seed/project1c/1200/800', hint: 'aquascape layout' },
    ],
    categories: ['Freshwater', 'Planted Tank', 'Community Tank'],
  },
  {
    id: '2',
    title: 'Vibrant Coral Reef',
    description: 'A stunning 120-gallon saltwater reef tank showcasing a variety of colorful corals and marine life.',
    images: [
      { url: 'https://picsum.photos/seed/project2a/1200/800', hint: 'coral reef tank' },
      { url: 'https://picsum.photos/seed/project2b/1200/800', hint: 'marine corals' },
      { url: 'https://picsum.photos/seed/project2c/1200/800', hint: 'saltwater fish' },
    ],
    categories: ['Saltwater', 'Reef Tank'],
  },
  {
    id: '3',
    title: 'Minimalist Acrylic Betta Bowl',
    description: 'An elegant 5-gallon nano tank designed for a single Betta fish, emphasizing simplicity and style, crafted from acrylic.',
    images: [
      { url: 'https://picsum.photos/seed/project3a/1200/800', hint: 'betta fish tank' },
      { url: 'https://picsum.photos/seed/project3b/1200/800', hint: 'nano aquascape' },
      { url: 'https://picsum.photos/seed/project3c/1200/800', hint: 'small aquarium' },
    ],
    categories: ['Freshwater', 'Nano Tank', 'Acrylic'],
  },
  {
    id: '4',
    title: 'Amazon Biotope',
    description: 'A 55-gallon setup replicating the natural habitat of Amazonian fish species.',
    images: [
      { url: 'https://picsum.photos/seed/project4a/1200/800', hint: 'amazon biotope' },
      { url: 'https://picsum.photos/seed/project4b/1200/800', hint: 'river aquarium' },
      { url: 'https://picsum.photos/seed/project4c/1200/800', hint: 'naturalistic tank' },
    ],
    categories: ['Freshwater', 'Biotope'],
  },
  {
    id: '5',
    title: 'Office Desk Acrylic Nano Tank',
    description: 'A compact 10-gallon planted tank made from clear acrylic, perfect for adding a touch of nature to any workspace.',
    images: [
      { url: 'https://picsum.photos/seed/project5a/1200/800', hint: 'nano aquarium desk' },
      { url: 'https://picsum.photos/seed/project5b/1200/800', hint: 'small planted tank' },
      { url: 'https://picsum.photos/seed/project5c/1200/800', hint: 'office fish tank' },
    ],
    categories: ['Freshwater', 'Nano Tank', 'Planted Tank', 'Acrylic'],
  },
  {
    id: '6',
    title: 'Monster Fish Predator Tank',
    description: 'A large 200-gallon aquarium housing impressive predatory fish species.',
    images: [
      { url: 'https://picsum.photos/seed/project6a/1200/800', hint: 'large aquarium fish' },
      { url: 'https://picsum.photos/seed/project6b/1200/800', hint: 'predator tank' },
      { url: 'https://picsum.photos/seed/project6c/1200/800', hint: 'monster fish' },
    ],
    categories: ['Freshwater', 'Predator Tank'],
  },
];

export const EQUIPMENT_DATA: Equipment[] = [
  {
    id: 'eq1',
    name: 'AquaClear Power Filter',
    description: 'High-performance hang-on-back filter for crystal clear water. Suitable for tanks up to 50 gallons.',
    imageUrl: 'https://picsum.photos/seed/equip1/600/400',
    imageHint: 'aquarium filter',
    price: '$49.99',
  },
  {
    id: 'eq2',
    name: 'Fluval Plant 3.0 LED Light',
    description: 'Programmable full-spectrum LED lighting system designed for optimal plant growth.',
    imageUrl: 'https://picsum.photos/seed/equip2/600/400',
    imageHint: 'aquarium light',
    price: '$129.99',
  },
  {
    id: 'eq3',
    name: 'Eheim Jager Aquarium Heater',
    description: 'Reliable and precise submersible heater, ensuring stable water temperatures.',
    imageUrl: 'https://picsum.photos/seed/equip3/600/400',
    imageHint: 'aquarium heater',
    price: '$24.99',
  },
  {
    id: 'eq4',
    name: 'CO2 Injection System',
    description: 'Complete CO2 kit for lush aquatic plant growth in high-tech planted tanks.',
    imageUrl: 'https://picsum.photos/seed/equip4/600/400',
    imageHint: 'co2 system',
    price: '$89.99',
  },
  {
    id: 'eq5',
    name: 'API Master Test Kit',
    description: 'Essential water testing kit for monitoring ammonia, nitrite, nitrate, and pH levels.',
    imageUrl: 'https://picsum.photos/seed/equip5/600/400',
    imageHint: 'water test kit',
    price: '$34.99',
  },
  {
    id: 'eq6',
    name: 'Python Water Changer',
    description: 'Convenient system for easy water changes without buckets or siphons.',
    imageUrl: 'https://picsum.photos/seed/equip6/600/400',
    imageHint: 'aquarium maintenance',
    price: '$45.99',
  },
];

export const BUSINESS_INFO = {
  name: 'AquaCraft Showcase',
  phone: '(555) 123-4567',
  email: 'contact@aquacraftshowcase.com',
  address: '123 Ocean Drive, Aqua City, AC 12345',
  googleMapsLink: 'https://maps.google.com/?q=123+Ocean+Drive,+Aqua+City,+AC+12345',
  hours: [
    { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
};

export const HERO_IMAGES: HeroImage[] = [
  { id: 'hero1', url: 'https://picsum.photos/seed/heroaqua1/1920/1080', alt: 'Stunning custom aquarium build', hint: 'custom aquarium underwater', },
  { id: 'hero2', url: 'https://picsum.photos/seed/heroaqua2/1920/1080', alt: 'Vibrant coral reef tank', hint: 'coral reef fish', },
  { id: 'hero3', url: 'https://picsum.photos/seed/heroaqua3/1920/1080', alt: 'Lush planted freshwater tank', hint: 'planted tank scape', },
];

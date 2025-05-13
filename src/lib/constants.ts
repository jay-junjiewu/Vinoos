import type { Project, Equipment } from '@/types';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/equipment', label: 'Equipment' },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    title: 'Serene Freshwater Scape',
    description: 'A calming 75-gallon freshwater aquarium with lush live plants and peaceful community fish.',
    imageUrl: 'https://picsum.photos/seed/project1/600/400',
    imageHint: 'freshwater aquarium',
  },
  {
    id: '2',
    title: 'Vibrant Coral Reef',
    description: 'A stunning 120-gallon saltwater reef tank showcasing a variety of colorful corals and marine life.',
    imageUrl: 'https://picsum.photos/seed/project2/600/400',
    imageHint: 'coral reef',
  },
  {
    id: '3',
    title: 'Minimalist Betta Bowl',
    description: 'An elegant 5-gallon nano tank designed for a single Betta fish, emphasizing simplicity and style.',
    imageUrl: 'https://picsum.photos/seed/project3/600/400',
    imageHint: 'betta fish tank',
  },
  {
    id: '4',
    title: 'Amazon Biotope',
    description: 'A 55-gallon setup replicating the natural habitat of Amazonian fish species.',
    imageUrl: 'https://picsum.photos/seed/project4/600/400',
    imageHint: 'amazon biotope',
  },
  {
    id: '5',
    title: 'Office Desk Nano Tank',
    description: 'A compact 10-gallon planted tank, perfect for adding a touch of nature to any workspace.',
    imageUrl: 'https://picsum.photos/seed/project5/600/400',
    imageHint: 'nano aquarium',
  },
  {
    id: '6',
    title: 'Monster Fish Predator Tank',
    description: 'A large 200-gallon aquarium housing impressive predatory fish species.',
    imageUrl: 'https://picsum.photos/seed/project6/600/400',
    imageHint: 'large aquarium',
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

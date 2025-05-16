
export interface ProjectImage {
  url: string;
  hint: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: ProjectImage[];
  categories: string[]; // Added categories field
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  price?: string;
}

// Define a type for unique categories, can be expanded if needed
export type ProjectCategory = string;

export interface HeroImage {
  id: string;
  url: string;
  alt: string;
  hint: string;
}

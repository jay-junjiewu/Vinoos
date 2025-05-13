
export interface ProjectImage {
  url: string;
  hint: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: ProjectImage[];
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  price?: string;
}

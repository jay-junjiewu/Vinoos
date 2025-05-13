
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  price?: string;
}

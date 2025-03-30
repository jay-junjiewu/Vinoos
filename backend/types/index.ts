// Database types
export interface Project {
  id: number
  title: string
  description: string
  category: string
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: number
  project_id: number
  image_url: string
  alt_text: string
  created_at: string
}

export interface Equipment {
  id: number
  title: string
  brand: string
  short_description: string
  specifications: string[]
  created_at: string
  updated_at: string
}

export interface EquipmentImage {
  id: number
  equipment_id: number
  image_url: string
  alt_text: string
  created_at: string
}

// Request types
export interface CreateProjectRequest {
  title: string
  description: string
  category: string
  images?: { url: string; alt: string }[]
}

export interface UpdateProjectRequest {
  title?: string
  description?: string
  category?: string
}

export interface CreateEquipmentRequest {
  title: string
  brand: string
  shortDescription: string
  specifications?: string[]
  images?: { url: string; alt: string }[]
}

export interface UpdateEquipmentRequest {
  title?: string
  brand?: string
  shortDescription?: string
  specifications?: string[]
}


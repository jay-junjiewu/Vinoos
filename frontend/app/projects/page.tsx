"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageCarousel from "@/components/image-carousel"
import ImageGalleryModal from "@/components/image-gallery-modal"

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<null | {
    id: number
    title: string
    images: { url: string; alt: string }[]
  }>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Project Gallery</h1>
            <p className="mt-4 text-muted-foreground">
              Browse through our collection of custom fish tanks, categorized by type and setting.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="residential">Residential</TabsTrigger>
                <TabsTrigger value="commercial">Commercial</TabsTrigger>
                <TabsTrigger value="specialty">Specialty</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewAllImages={() =>
                      setSelectedProject({
                        id: project.id,
                        title: project.title,
                        images: project.images,
                      })
                    }
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="residential" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter((project) => project.category === "residential")
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewAllImages={() =>
                        setSelectedProject({
                          id: project.id,
                          title: project.title,
                          images: project.images,
                        })
                      }
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="commercial" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter((project) => project.category === "commercial")
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewAllImages={() =>
                        setSelectedProject({
                          id: project.id,
                          title: project.title,
                          images: project.images,
                        })
                      }
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="specialty" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter((project) => project.category === "specialty")
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewAllImages={() =>
                        setSelectedProject({
                          id: project.id,
                          title: project.title,
                          images: project.images,
                        })
                      }
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedProject && (
        <ImageGalleryModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          images={selectedProject.images}
          title={selectedProject.title}
        />
      )}
    </div>
  )
}

function ProjectCard({ project, onViewAllImages }) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
      <ImageCarousel images={project.images} aspectRatio="video" onExpandClick={onViewAllImages} />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
          <Button variant="ghost" size="sm" onClick={onViewAllImages}>
            View All Images
          </Button>
        </div>
      </div>
    </div>
  )
}

// Project data with multiple images per project
const projects = [
  {
    id: 1,
    title: "Modern Residential Aquarium",
    description: "Custom 200-gallon tank for a luxury condo.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Modern aquarium front view" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Modern aquarium side view" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Modern aquarium with lighting" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Modern aquarium installation process" },
    ],
    category: "residential",
  },
  {
    id: 2,
    title: "Office Lobby Installation",
    description: "400-gallon reef tank that serves as the centerpiece for a corporate lobby.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Office lobby tank front view" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Office lobby tank with coral" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Office lobby tank installation" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Office lobby tank lighting detail" },
    ],
    category: "commercial",
  },
  {
    id: 3,
    title: "Restaurant Divider Tank",
    description: "Custom-built divider tank that separates dining areas while providing a stunning visual.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Restaurant divider tank" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Restaurant divider tank from dining area" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Restaurant divider tank with fish" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Restaurant divider tank construction" },
    ],
    category: "commercial",
  },
  {
    id: 4,
    title: "Luxury Home Theater",
    description: "Wall-integrated 300-gallon marine tank with custom lighting that complements the theater experience.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Home theater tank with ambient lighting" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Home theater tank from seating area" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Home theater tank installation" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Home theater tank lighting system" },
    ],
    category: "residential",
  },
  {
    id: 5,
    title: "Hotel Lobby Cylindrical Tank",
    description: "Impressive cylindrical tank that draws attention in a five-star hotel entrance.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Cylindrical hotel lobby tank" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Cylindrical tank from entrance" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Cylindrical tank construction" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Cylindrical tank filtration system" },
    ],
    category: "commercial",
  },
  {
    id: 6,
    title: "Pediatric Office Aquarium",
    description: "Child-friendly freshwater tank designed to calm young patients.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Pediatric office tank with colorful fish" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Pediatric office tank from waiting area" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Pediatric office tank with children" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Pediatric office tank maintenance" },
    ],
    category: "specialty",
  },
  {
    id: 7,
    title: "L-Shaped Room Divider",
    description: "Custom designed L-shaped aquarium that functions as both a room divider and statement piece.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "L-shaped divider tank" },
      { url: "/placeholder.svg?height=500&width=800", alt: "L-shaped divider tank from living room" },
      { url: "/placeholder.svg?height=500&width=800", alt: "L-shaped divider tank from dining area" },
      { url: "/placeholder.svg?height=500&width=800", alt: "L-shaped divider tank construction" },
    ],
    category: "residential",
  },
  {
    id: 8,
    title: "Saltwater Reef Display",
    description: "Vibrant marine ecosystem featuring a diverse collection of corals and tropical fish.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Saltwater reef tank with corals" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Saltwater reef tank with fish" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Saltwater reef tank lighting" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Saltwater reef tank setup process" },
    ],
    category: "residential",
  },
  {
    id: 9,
    title: "Interactive Museum Tank",
    description: "Educational display with interactive elements for a natural history museum.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Museum interactive tank" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Museum tank with educational display" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Museum tank with visitors" },
      { url: "/placeholder.svg?height=500&width=800", alt: "Museum tank installation" },
    ],
    category: "specialty",
  },
]


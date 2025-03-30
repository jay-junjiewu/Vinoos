"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ImageCarousel from "@/components/image-carousel"
import ImageGalleryModal from "@/components/image-gallery-modal"

const projects = [
  {
    id: 1,
    title: "Modern Residential Aquarium",
    description: "Custom 200-gallon tank for a luxury condo.",
    images: [
      { url: "/placeholder.svg?height=500&width=800", alt: "Modern aquarium front view" },
      { url: '/placeholder.svg?height=500&width=800  alt: "Modern aquarium front view' },
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
]

export default function FeaturedTanks() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)

  const visibleProjects = projects.slice(currentSlide, currentSlide + 3)
  const isPrevDisabled = currentSlide === 0
  const isNextDisabled = currentSlide >= projects.length - 3

  const handlePrev = () => {
    if (!isPrevDisabled) {
      setCurrentSlide((prev) => Math.max(prev - 1, 0))
    }
  }

  const handleNext = () => {
    if (!isNextDisabled) {
      setCurrentSlide((prev) => Math.min(prev + 1, projects.length - 3))
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {visibleProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <ImageCarousel
                images={project.images}
                aspectRatio="video"
                onExpandClick={() =>
                  setSelectedProject({
                    id: project.id,
                    title: project.title,
                    images: project.images,
                  })
                }
              />
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                <div className="mt-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8 gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={handlePrev} disabled={isPrevDisabled}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={handleNext} disabled={isNextDisabled}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
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


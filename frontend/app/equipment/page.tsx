"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ImageCarousel from "@/components/image-carousel"
import ImageGalleryModal from "@/components/image-gallery-modal"

export default function EquipmentPage() {
  const [selectedEquipment, setSelectedEquipment] = useState<null | {
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Equipment</h1>
            <p className="mt-4 text-muted-foreground">
              We use only top-of-the-line equipment to ensure your aquatic system thrives for years to come.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <ImageCarousel
                  images={item.images}
                  aspectRatio="square"
                  onExpandClick={() =>
                    setSelectedEquipment({
                      id: item.id,
                      title: item.title,
                      images: item.images,
                    })
                  }
                />
                <CardHeader className="pb-2">
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.brand}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.shortDescription}</p>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="specs">
                      <AccordionTrigger className="text-sm">Specifications</AccordionTrigger>
                      <AccordionContent>
                        <ul className="text-sm space-y-1 list-disc pl-4">
                          {item.specifications.map((spec, index) => (
                            <li key={index}>{spec}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        setSelectedEquipment({
                          id: item.id,
                          title: item.title,
                          images: item.images,
                        })
                      }
                    >
                      View All Images
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Custom Solutions</h2>
            <p className="text-muted-foreground mb-6">
              Don't see what you're looking for? We also create custom filtration and life support systems tailored to
              your specific needs and tank requirements.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us For Custom Solutions</Link>
            </Button>
          </div>
        </div>
      </div>

      {selectedEquipment && (
        <ImageGalleryModal
          isOpen={!!selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          images={selectedEquipment.images}
          title={selectedEquipment.title}
        />
      )}
    </div>
  )
}

// Equipment data with multiple images per item
const equipmentItems = [
  {
    id: 1,
    title: "Precision Protein Skimmer",
    brand: "AquaticPro",
    shortDescription: "High-efficiency protein skimmer for tanks up to 300 gallons.",
    images: [
      { url: "/placeholder.svg?height=300&width=300", alt: "Protein skimmer front view" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Protein skimmer side view" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Protein skimmer in operation" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Protein skimmer maintenance" },
    ],
    specifications: [
      "Handles tanks up to 300 gallons",
      "Needle wheel impeller",
      "Adjustable flow rate",
      "Easy maintenance design",
      "Quiet operation",
    ],
  },
  {
    id: 2,
    title: "Advanced LED Lighting System",
    brand: "SpectrumMax",
    shortDescription: "Programmable full-spectrum LED lighting for optimal coral growth.",
    images: [
      { url: "/placeholder.svg?height=300&width=300", alt: "LED lighting system" },
      { url: "/placeholder.svg?height=300&width=300", alt: "LED lighting with controller" },
      { url: "/placeholder.svg?height=300&width=300", alt: "LED lighting in use on tank" },
      { url: "/placeholder.svg?height=300&width=300", alt: "LED lighting color spectrum display" },
    ],
    specifications: [
      "Customizable spectrum",
      "Timer and intensity controls",
      "Simulated sunrise/sunset",
      "Weather effects",
      "Low heat output",
      "Energy efficient",
    ],
  },
  {
    id: 3,
    title: "Bio-Active Filtration System",
    brand: "EcoFilter",
    shortDescription: "Multi-stage filtration for crystal clear water and optimal biologicals.",
    images: [
      { url: "/placeholder.svg?height=300&width=300", alt: "Filtration system front" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Filtration system components" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Filtration system installed" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Filtration system media" },
    ],
    specifications: [
      "Mechanical, chemical, and biological filtration",
      "Self-priming pump",
      "Low maintenance design",
      "Customizable media baskets",
      "Adjustable flow rate",
    ],
  },
  {
    id: 4,
    title: "Precision Temperature Controller",
    brand: "ThermoTech",
    shortDescription: "Digital temperature control system with dual probes for redundancy.",
    images: [
      { url: "/placeholder.svg?height=300&width=300", alt: "Temperature controller unit" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Temperature controller display" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Temperature controller installed" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Temperature controller with probes" },
    ],
    specifications: [
      "±0.1°F temperature accuracy",
      "Dual probe system",
      "Digital display",
      "Alarm system",
      "Compact design",
      "Compatible with multiple heaters",
    ],
  },
  {
    id: 5,
    title: "Commercial-Grade Water Pumps",
    brand: "FlowMaster",
    shortDescription: "High-performance circulation pumps for large installations.",
    images: [
      { url: "/placeholder.svg?height=300&width=300", alt: "Water pump unit" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Water pump installation" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Water pump controller" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Water pump flow demonstration" },
    ],
    specifications: [
      "Up to 5,000 GPH flow rate",
      "Energy efficient design",
      "Quiet operation",
      "Heat reduction technology",
      "Multiple flow patterns",
      "Wireless control capability",
    ],
  },
  {
    id: 6,
    title: "Automated Water Testing System",
    brand: "AquaLab",
    shortDescription: "Continuous monitoring of critical water parameters with alerts.",
    images: [
      { url: "/placeholder.svg?height=300&width=300", alt: "Water testing system" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Water testing probes" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Water testing app interface" },
      { url: "/placeholder.svg?height=300&width=300", alt: "Water testing system installed" },
    ],
    specifications: [
      "Monitors pH, temperature, salinity, DO, and ORP",
      "Mobile app integration",
      "Automatic alert system",
      "Data logging capability",
      "Cloud-based monitoring",
      "Monthly calibration recommended",
    ],
  },
]


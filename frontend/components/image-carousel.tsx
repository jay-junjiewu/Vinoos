"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface ImageCarouselProps {
  images: {
    url: string
    alt: string
  }[]
  aspectRatio?: "square" | "video"
  width?: number
  height?: number
  onExpandClick?: () => void
  className?: string
}

export default function ImageCarousel({
  images,
  aspectRatio = "square",
  width = 600,
  height = 600,
  onExpandClick,
  className,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      handleNext()
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      handlePrevious()
    }
  }

  const aspectRatioClass = aspectRatio === "square" ? "aspect-square" : "aspect-video"

  return (
    <div className={cn("relative group", className)}>
      <div
        ref={carouselRef}
        className={cn("relative overflow-hidden rounded-lg", aspectRatioClass)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-full w-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
                sizes={`(max-width: 768px) 100vw, ${width}px`}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && !isMobile && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 bg-background/80 backdrop-blur-sm"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 bg-background/80 backdrop-blur-sm"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {onExpandClick && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-2 right-2 opacity-70 hover:opacity-100 bg-background/80 backdrop-blur-sm"
          onClick={onExpandClick}
          aria-label="View all images"
        >
          <Expand className="h-4 w-4" />
        </Button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "transition-all rounded-full",
                isMobile ? "w-1.5 h-1.5" : "w-2 h-2",
                index === currentIndex ? "bg-primary" : "bg-primary/30",
              )}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}


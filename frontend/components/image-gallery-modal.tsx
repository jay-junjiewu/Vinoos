"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useMobile } from "@/hooks/use-mobile"

interface ImageGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: {
    url: string
    alt: string
  }[]
  initialIndex?: number
  title?: string
}

export default function ImageGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm sm:rounded-lg">
        <div className="relative flex flex-col">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b">
            <div className="font-medium">
              {title && <h3 className="text-base sm:text-lg">{title}</h3>}
              <p className="text-xs sm:text-sm text-muted-foreground">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div
            className="relative h-[50vh] sm:h-[60vh] w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={images[currentIndex].url || "/placeholder.svg"}
              alt={images[currentIndex].alt}
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>

          <div className="flex items-center justify-between p-3 sm:p-4 border-t">
            {!isMobile && (
              <Button variant="outline" size="icon" onClick={handlePrevious} disabled={images.length <= 1}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous image</span>
              </Button>
            )}

            <div className="flex gap-1 sm:gap-2 overflow-auto py-2 px-2 sm:px-4 mx-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`relative rounded-md overflow-hidden border-2 transition-all ${
                    index === currentIndex ? "border-primary" : "border-transparent"
                  } ${isMobile ? "h-10 w-10" : "h-12 w-12 sm:h-16 sm:w-16"}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes={isMobile ? "40px" : "64px"}
                  />
                </button>
              ))}
            </div>

            {!isMobile && (
              <Button variant="outline" size="icon" onClick={handleNext} disabled={images.length <= 1}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next image</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}



"use client";

import Image from 'next/image';
import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTrigger, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog"; // Import DialogPrimitive
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectCardProps {
  project: Project;
}

interface ModalCarouselProps {
  project: Project;
  initialImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

function ModalCarousel({ project, initialImageIndex, isOpen, onClose, isMobile }: ModalCarouselProps) {
  const [currentIndexInModal, setCurrentIndexInModal] = useState(initialImageIndex);
  const images = project.images || [];

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const swipeThreshold = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || images.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || images.length <= 1 || !touchStartX) return;
    setTouchEndX(e.touches[0].clientX);
    e.stopPropagation();
  };

  const goToPreviousModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    setCurrentIndexInModal((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToNextModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    setCurrentIndexInModal((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isMobile || images.length <= 1 || !touchStartX || !touchEndX) {
      setTouchStartX(null);
      setTouchEndX(null);
      return;
    }

    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold) {
      goToNextModal();
    } else if (diff < -swipeThreshold) {
      goToPreviousModal();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };


  useEffect(() => {
    if (isOpen) {
      setCurrentIndexInModal(initialImageIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialImageIndex]);


  useEffect(() => {
    if (!isOpen || images.length <= 1 || isMobile) return; // Keyboard nav only for desktop

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPreviousModal(event);
      } else if (event.key === 'ArrowRight') {
        goToNextModal(event);
      } else if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, images.length, goToPreviousModal, goToNextModal, onClose, isMobile]);


  if (!images || images.length === 0) return null;

  return (
    <div
      className="relative w-auto h-auto" 
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${project.id}`}
    >
      <h2 id={`modal-title-${project.id}`} className="sr-only">Image gallery for {project.title}</h2>

      {/* Main content wrapper for image and controls below it */}
      <div className="flex flex-col items-center">
        {/* Image container */}
        <div
          className="relative group/modalimage"
          onClick={(e) => {
            if (!isMobile) { 
              e.stopPropagation(); 
              onClose();
            }
          }}
          onTouchStart={isMobile && images.length > 1 ? handleTouchStart : undefined}
          onTouchMove={isMobile && images.length > 1 && touchStartX !== null ? handleTouchMove : undefined}
          onTouchEnd={isMobile && images.length > 1 ? handleTouchEnd : undefined}
          role={!isMobile ? "button" : undefined}
          aria-label={!isMobile ? "Close image viewer (click image)" : `Image ${currentIndexInModal + 1} of ${images.length}`}
          tabIndex={!isMobile ? 0 : -1}
          style={{ cursor: isMobile && images.length > 1 ? 'grab' : (!isMobile ? 'pointer' : 'default') }}
        >
          <Image
            src={images[currentIndexInModal].url}
            alt={`${project.title} - Image ${currentIndexInModal + 1}`}
            width={1200} 
            height={800}
            style={{
              display: 'block', 
              objectFit: 'contain',
              width: 'auto', 
              height: 'auto', 
              maxWidth: '90vw', 
              maxHeight: '90vh', 
            }}
            className="rounded-md mx-auto"
            data-ai-hint={images[currentIndexInModal].hint}
            priority={true} 
            key={images[currentIndexInModal].url} 
          />
        </div>

        {/* Controls container (below image) */}
        {images.length > 1 && (
          <div className="mt-4 flex flex-col items-center space-y-3">
            {/* Navigation arrows (DESKTOP ONLY) */}
            {!isMobile && (
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/40 hover:bg-black/60 text-white rounded-full h-9 w-9 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0"
                  onClick={(e) => { e.stopPropagation(); goToPreviousModal(e); }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/40 hover:bg-black/60 text-white rounded-full h-9 w-9 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0"
                  onClick={(e) => { e.stopPropagation(); goToNextModal(e); }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Dots (visible on all screen sizes if multiple images) */}
            <div
              className="flex items-center space-x-2 bg-black/50 p-1.5 rounded-full"
              onClick={(e) => e.stopPropagation()} 
            >
              {images.map((_, index) => (
                <button
                  key={`modal-dot-${project.id}-${index}`}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setCurrentIndexInModal(index);
                  }}
                  aria-label={`Go to image ${index + 1}`}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-white',
                    currentIndexInModal === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom X button, only for desktop */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className={cn(
            "absolute top-4 -right-4 z-[80] bg-black/50 hover:bg-black/70 text-white rounded-full h-9 w-9 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0"
          )}
          aria-label="Close image viewer"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}


export function ProjectCard({ project }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectImages = project.images || [];
  const isMobile = useIsMobile();

  const goToPreviousOnCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? projectImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextOnCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === projectImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleOpenModal = () => {
    if (projectImages.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        {projectImages.length > 0 ? (
          <DialogTrigger asChild>
            <div
              className="relative w-full h-48 sm:h-56 md:h-64 group cursor-pointer"
              onClick={handleOpenModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenModal();} }}
              aria-label={`View images for ${project.title}`}
              aria-haspopup="dialog"
            >
              <Image
                src={projectImages[currentImageIndex].url}
                alt={`${project.title} - Image ${currentImageIndex + 1} on card`}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={projectImages[currentImageIndex].hint}
                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={project.id === '1' || project.id === '2'}
              />
              {projectImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                    onClick={goToPreviousOnCard}
                    aria-label="Previous image on card"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                    onClick={goToNextOnCard}
                    aria-label="Next image on card"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex space-x-1.5" aria-hidden="true">
                    {projectImages.map((_, index) => (
                      <button
                        key={`card-dot-${project.id}-${index}`}
                        tabIndex={-1} 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                        } hover:bg-white`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </DialogTrigger>
        ) : (
          <div className="relative w-full h-48 sm:h-56 md:h-64 bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No image available</p>
          </div>
        )}
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-xl">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pt-0 pb-4">
          <CardDescription>{project.description}</CardDescription>
        </CardContent>
      </Card>

      {projectImages.length > 0 && (
         <DialogPortal>
           <DialogOverlay />
           <DialogPrimitive.Content
             className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
              "border-0 bg-transparent shadow-none p-0 flex items-center justify-center overflow-hidden max-w-none" 
             )}
           >
            <ModalCarousel
              project={project}
              initialImageIndex={currentImageIndex}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              isMobile={isMobile}
            />
           </DialogPrimitive.Content>
         </DialogPortal>
      )}
    </Dialog>
  );
}


"use client";

import Image from 'next/image';
import type { Project } from '@/types'; // Removed ProjectImage as it's not directly used here
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

interface ProjectCardProps {
  project: Project;
}

interface ModalCarouselProps {
  project: Project;
  initialImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean; // Added isMobile prop
}

function ModalCarousel({ project, initialImageIndex, isOpen, onClose, isMobile }: ModalCarouselProps) {
  const [currentIndexInModal, setCurrentIndexInModal] = useState(initialImageIndex);
  const images = project.images || [];

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const swipeThreshold = 50; // Min distance for a swipe

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || images.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null); // Reset touch end X
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || images.length <= 1 || !touchStartX) return;
    setTouchEndX(e.touches[0].clientX);
  };

  const goToPreviousModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    setCurrentIndexInModal((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToNextModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    setCurrentIndexInModal((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  const handleTouchEnd = () => {
    if (!isMobile || images.length <= 1 || !touchStartX || !touchEndX) {
      // Reset and return if not a valid swipe sequence for navigation.
      setTouchStartX(null);
      setTouchEndX(null);
      return;
    }

    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold) { // Swiped left
      goToNextModal();
    } else if (diff < -swipeThreshold) { // Swiped right
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
    if (!isOpen || images.length <= 1 || isMobile) return; // Keyboard nav for desktop only

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
      className="relative w-auto h-auto p-6"
      // onClick={(e) => e.stopPropagation()} // Removed: Allow clicks on padding to close modal
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${project.id}`}
    >
      <h2 id={`modal-title-${project.id}`} className="sr-only">Image gallery for {project.title}</h2>

      <div
        className="relative w-[90vw] h-[85vh] sm:w-[85vw] sm:h-[85vh] md:max-w-4xl md:max-h-[85vh] group/modalimage"
        onClick={(e) => {
          e.stopPropagation(); // Stop propagation so click on image doesn't close via DialogContent
          if (!isMobile) { // Desktop: click image to close
            onClose();
          }
          // On mobile, tap on image does nothing, swipe handles navigation.
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role={!isMobile ? "button" : undefined}
        aria-label={!isMobile ? "Close image viewer (click image)" : `Image ${currentIndexInModal + 1} of ${images.length}`}
        tabIndex={!isMobile ? 0 : -1}
        style={{ cursor: isMobile ? 'grab' : 'pointer' }}
      >
        <Image
          src={images[currentIndexInModal].url}
          alt={`${project.title} - Image ${currentIndexInModal + 1}`}
          fill
          style={{ objectFit: 'contain' }}
          data-ai-hint={images[currentIndexInModal].hint}
          className="rounded-md"
          priority={true}
          key={images[currentIndexInModal].url}
        />
      </div>

      {/* Close Button: Hidden on mobile (xs), shown sm and up */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={cn(
          "absolute top-4 -right-4 z-[80] bg-black/50 hover:bg-black/70 text-white rounded-full h-9 w-9 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0",
          "hidden sm:flex" // Hidden on mobile, flex on sm+
        )}
        aria-label="Close image viewer"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Navigation Buttons: Hidden on mobile (xs), shown sm and up */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-[70] -translate-x-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-9 w-9 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0",
              "hidden sm:flex" // Hidden on mobile, flex on sm+
            )}
            onClick={(e) => { e.stopPropagation(); goToPreviousModal(e); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-[70] translate-x-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-9 w-9 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0",
              "hidden sm:flex" // Hidden on mobile, flex on sm+
            )}
            onClick={(e) => { e.stopPropagation(); goToNextModal(e); }}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {images.length > 1 && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[70] flex items-center space-x-2 bg-black/50 p-1.5 sm:p-2 rounded-full"
          onClick={(e) => e.stopPropagation()} // Stop propagation for clicks on dots container
        >
           <p className="text-white text-xs sm:text-sm mx-1 sm:mx-2 select-none">{currentIndexInModal + 1} / {images.length}</p>
          {images.map((_, index) => (
            <button
              key={`modal-dot-${project.id}-${index}`}
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation for clicks on individual dots
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
      )}
    </div>
  );
}


export function ProjectCard({ project }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectImages = project.images || [];
  const isMobile = useIsMobile(); // Use the hook

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
         <DialogContent
           className={cn(
             "p-0 border-0 max-w-none w-screen h-screen bg-transparent flex items-center justify-center overflow-hidden"
           )}
           aria-describedby={undefined}
           aria-labelledby={undefined}
         >
          <ModalCarousel
            project={project}
            initialImageIndex={currentImageIndex}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            isMobile={isMobile} // Pass isMobile prop
          />
        </DialogContent>
      )}
    </Dialog>
  );
}

    

    
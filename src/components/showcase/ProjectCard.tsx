
"use client";

import Image from 'next/image';
import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

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

  const goToPreviousModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    setCurrentIndexInModal((prevIndex) => {
      if (prevIndex === 0) return 0; // Stop at first image
      return prevIndex - 1;
    });
  }, []);

  const goToNextModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    setCurrentIndexInModal((prevIndex) => {
      if (prevIndex === images.length - 1) return images.length - 1; // Stop at last image
      return prevIndex + 1;
    });
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || images.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || images.length <= 1 || !touchStartX) return;
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
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
    if (!isOpen || images.length <= 1 || isMobile) return;
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
    <div className={cn(
        "inline-flex flex-row items-center relative gap-x-2 sm:gap-x-3 md:gap-x-4",
      )}
    >
      {/* Left Arrow (Desktop only) */}
      {!isMobile && images.length > 1 && (
        <Button
          variant="ghost" size="icon"
          className="bg-black/40 hover:bg-black/60 text-white rounded-full h-9 w-9 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0 shrink-0 disabled:opacity-50 disabled:hover:bg-black/40 z-10"
          onClick={(e) => { e.stopPropagation(); goToPreviousModal(e); }}
          aria-label="Previous image"
          disabled={currentIndexInModal === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Image Viewport and Dots Column (Central piece) */}
      <div // This is ImageAndDotsColumn
        className={cn(
          'relative flex flex-col items-center',
           isMobile ? 'w-[98vw]' : 'w-[50vw]' // Explicit width
        )}
      >
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute -top-2 -right-2 z-[80] bg-black/50 hover:bg-black/70 text-white rounded-full h-9 w-9 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0 transform translate-x-1/2 -translate-y-1/2"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        <div // This is ImageAreaViewport
          className={cn(
            'relative w-full overflow-hidden aspect-[4/3]' 
          )}
          style={{ maxHeight: isMobile ? '98vh' : '50vh' }}
          onClick={isMobile && images.length <= 1 ? (e) => { e.stopPropagation(); onClose(); } : undefined }
          onTouchStart={isMobile && images.length > 1 ? handleTouchStart : undefined}
          onTouchMove={isMobile && images.length > 1 && touchStartX !== null ? handleTouchMove : undefined}
          onTouchEnd={isMobile && images.length > 1 ? handleTouchEnd : undefined}
          role={isMobile && images.length <= 1 ? "button" : undefined}
          aria-label={isMobile && images.length <=1 ? "Close image viewer (click image)" : `Image ${currentIndexInModal + 1} of ${images.length}`}
          tabIndex={isMobile && images.length <=1 ? 0 : -1}
          style={{ 
            cursor: isMobile ? (images.length > 1 ? 'grab' : 'pointer') : 'default',
            ...(isMobile ? {maxHeight: '98vh'} : {maxHeight: '50vh'}) 
          }}
        >
          {/* Image Track (sliding div) */}
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndexInModal * 100}%)` }}
          >
            {images.map((image, index) => (
              <div
                key={image.url}
                className="w-full h-full flex-shrink-0 flex justify-center items-center" 
              >
                <Image
                  src={image.url} alt={`${project.title} - Image ${index + 1}`}
                  width={1200} height={900} 
                  className="rounded-md"
                  style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                  data-ai-hint={image.hint}
                  priority={index === currentIndexInModal}
                  loading={index !== currentIndexInModal ? "eager" : undefined}
                  sizes={isMobile ? "98vw" : "50vw"}
                />
              </div>
            ))}
          </div>
        </div>
        
        {images.length > 1 && (
          <div
            className="absolute bottom-[-2rem] z-30 flex items-center justify-center space-x-2 bg-black/50 p-1.5 rounded-full mt-2"
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
        )}
      </div>

      {!isMobile && images.length > 1 && (
         <Button
          variant="ghost" size="icon"
          className="bg-black/40 hover:bg-black/60 text-white rounded-full h-9 w-9 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0 shrink-0 disabled:opacity-50 disabled:hover:bg-black/40 z-10"
          onClick={(e) => { e.stopPropagation(); goToNextModal(e); }}
          aria-label="Next image"
          disabled={currentIndexInModal === images.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}


export function ProjectCard({ project }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectImages = project.images || [];

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const hookIsMobile = useIsMobile();
  const isMobile = isClient ? hookIsMobile : false; 

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
    setCurrentImageIndex((prevIndex) => {
      if (projectImages.length === 0) return 0;
      // Corrected: if on last image, go to first; otherwise, go to next.
      return prevIndex === projectImages.length - 1 ? 0 : prevIndex + 1;
    });
  };
  

  const handleOpenModal = () => {
    if (projectImages.length > 0) {
      setIsModalOpen(true);
    }
  };

  if (!isClient && projectImages.length === 0) {
    // Avoid rendering image-related DOM for "no image" case on SSR
  }

  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);


  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Card 
          className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
          onClick={handleOpenModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenModal();} }}
          aria-label={`View images for ${project.title}`}
          aria-haspopup="dialog"
        >
          {projectImages.length > 0 ? (
            <div
              className="relative w-full group cursor-pointer aspect-[4/3]"
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
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm-w-6" />
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
          ) : (
            <div className="relative w-full bg-muted flex items-center justify-center aspect-[4/3]">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-xl">{project.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pt-0 pb-4">
            <CardDescription>{project.description}</CardDescription>
          </CardContent>
          {project.categories && project.categories.filter(cat => cat !== 'All').length > 0 && (
            <CardFooter className="flex flex-wrap gap-2 p-4 pt-2">
              {project.categories.filter(cat => cat !== 'All').map((category) => (
                <Badge key={category} variant="secondary" className="text-sm">
                  {category}
                </Badge>
              ))}
            </CardFooter>
          )}
        </Card>
      </DialogTrigger>

      {projectImages.length > 0 && (
         <DialogPortal>
           <DialogOverlay /> 
           <DialogPrimitive.Content
             className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-none translate-x-[-50%] translate-y-[-50%] border-0 bg-transparent shadow-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
              "p-0 overflow-visible", // Removed grid and w-full, added p-0
              "flex items-center justify-center" 
             )}
             onClick={(e) => {
                // Only close if the click is directly on DialogContent (backdrop)
                // and not on ModalCarousel or its children
                if (e.target === e.currentTarget) {
                  handleCloseModal();
                }
              }}
           >
            <ModalCarousel
              project={project}
              initialImageIndex={currentImageIndex}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              isMobile={isMobile}
            />
           </DialogPrimitive.Content>
         </DialogPortal>
      )}
    </Dialog>
  );
}

    

"use client";

import Image from 'next/image';
import type { Project, ProjectImage } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react'; // Import X
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"; // Import DialogClose
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

// ModalCarousel component defined within ProjectCard or could be a separate file
function ModalCarousel({ project, initialImageIndex, isOpen, onClose }: { project: Project; initialImageIndex: number; isOpen: boolean; onClose: () => void; }) {
  const [currentIndexInModal, setCurrentIndexInModal] = useState(initialImageIndex);
  const images = project.images || [];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndexInModal(initialImageIndex);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
    }
    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialImageIndex]);

  const goToPreviousModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation(); 
    setCurrentIndexInModal((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToNextModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation(); 
    setCurrentIndexInModal((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen || images.length <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPreviousModal(event);
      } else if (event.key === 'ArrowRight') {
        goToNextModal(event);
      } else if (event.key === 'Escape') {
        onClose(); // Close on Escape key
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, images.length, goToPreviousModal, goToNextModal, onClose]);


  if (!images || images.length === 0) return null;

  return (
    // This div stops clicks within the carousel (e.g., on padding) from closing the modal,
    // allowing the DialogOverlay to handle clicks on the true "outside".
    <div
      className="relative flex flex-col items-center justify-center" 
      onClick={(e) => e.stopPropagation()} 
    >
      {/* Image container: clicking this will close the modal */}
      <div 
        className="relative w-[90vw] h-[85vh] sm:w-[85vw] sm:h-[85vh] md:max-w-4xl md:max-h-[85vh] cursor-pointer group/modalimage"
        onClick={(e) => {
          // e.stopPropagation(); // Stop propagation to prevent other handlers if any
          onClose(); // Close the modal when the image area is clicked
        }}
        role="button"
        aria-label="Close image viewer (click image)"
        tabIndex={0} 
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose(); } }} 
      >
        <Image
          src={images[currentIndexInModal].url}
          alt={`${project.title} - Image ${currentIndexInModal + 1}`}
          layout="fill"
          objectFit="contain" 
          data-ai-hint={images[currentIndexInModal].hint}
          className="rounded-md"
          priority={true} // Prioritize loading of the main modal image
          key={images[currentIndexInModal].url} // Ensure re-render on image change
        />
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-[70] bg-black/40 hover:bg-black/60 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0"
            onClick={(e) => { e.stopPropagation(); goToPreviousModal(e); }}
            aria-label="Previous image in modal"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-[70] bg-black/40 hover:bg-black/60 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0"
            onClick={(e) => { e.stopPropagation(); goToNextModal(e); }}
            aria-label="Next image in modal"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-[70] flex items-center space-x-2 bg-black/50 p-1.5 sm:p-2 rounded-full"
          onClick={(e) => e.stopPropagation()} 
        >
           <p className="text-white text-xs sm:text-sm mx-1 sm:mx-2 select-none">{currentIndexInModal + 1} / {images.length}</p>
          {images.map((_, index) => (
            <button
              key={`modal-dot-${index}`}
              onClick={(e) => { 
                e.stopPropagation();
                setCurrentIndexInModal(index);
              }}
              aria-label={`Go to image ${index + 1} in modal`}
              className={cn(
                'h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-white',
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
                layout="fill"
                objectFit="cover"
                data-ai-hint={projectImages[currentImageIndex].hint}
                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={project.id === '1' || project.id === '2'} // Prioritize first few project card images
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
                        key={`card-dot-${index}`}
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
           // Styling for the DialogContent (modal overlay)
           // The default X button is a child of DialogPrimitive.Content, which DialogContent renders.
           // We target it using [&>button[type=button]] assuming it's the primary button child, or use DialogClose explicitly.
           // The DialogOverlay is a sibling to DialogPrimitive.Content, and is responsible for the backdrop click.
           className={cn(
             "p-0 border-0 max-w-none w-screen h-screen bg-transparent flex items-center justify-center overflow-hidden",
             // Styles for the default X button rendered by DialogContent (DialogPrimitive.Close)
             "[&>button[type=button]]:bg-black/30 [&>button[type=button]]:text-white",
             "[&>button[type=button]]:hover:bg-black/50",
             "[&>button[type=button]]:focus-visible:ring-2 [&>button[type=button]]:focus-visible:ring-white [&>button[type=button]]:focus-visible:ring-offset-0",
             "[&>button[type=button]]:opacity-100 [&>button[type=button]]:rounded-full",
             "[&>button[type=button]]:p-1.5 [&>button[type=button]]:right-4 [&>button[type=button]]:top-4", // Position more reliably
             "[&>button[type=button]]:z-[80]" // Ensure X button is above carousel content
           )}
           aria-describedby={undefined} 
           aria-labelledby={undefined}  
         >
          <ModalCarousel 
            project={project} 
            initialImageIndex={currentImageIndex} 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          {/* You could also place an explicit DialogClose here if more control is needed,
              but the default one should be styled by the className above.
          <DialogClose className="absolute right-4 top-4 z-[80] rounded-full p-1.5 bg-black/30 text-white hover:bg-black/50">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          */}
        </DialogContent>
      )}
    </Dialog>
  );
}


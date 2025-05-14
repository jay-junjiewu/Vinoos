
"use client";

import Image from 'next/image';
import type { Project, ProjectImage } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

// ModalCarousel component defined within ProjectCard or could be a separate file
function ModalCarousel({ project, initialImageIndex, isOpen }: { project: Project; initialImageIndex: number; isOpen: boolean }) {
  const [currentIndexInModal, setCurrentIndexInModal] = useState(initialImageIndex);
  const images = project.images || [];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndexInModal(initialImageIndex);
      // Add overflow hidden to body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Remove overflow hidden from body when modal is closed
      document.body.style.overflow = '';
    }
    // Cleanup function to remove style on component unmount
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, images.length, goToPreviousModal, goToNextModal]);


  if (!images || images.length === 0) return null;

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center" 
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="relative w-full max-w-screen-lg h-[85%] max-h-[85vh] flex items-center justify-center">
        <Image
          src={images[currentIndexInModal].url}
          alt={`${project.title} - Image ${currentIndexInModal + 1}`}
          layout="fill"
          objectFit="contain"
          data-ai-hint={images[currentIndexInModal].hint}
          className="rounded-md"
          priority={true} 
          key={images[currentIndexInModal].url} // Add key to force re-render on image change for transitions
        />
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0"
            onClick={goToPreviousModal}
            aria-label="Previous image in modal"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0"
            onClick={goToNextModal}
            aria-label="Next image in modal"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </Button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-black/50 p-1.5 sm:p-2 rounded-full">
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
                        key={`card-dot-${index}`}
                        tabIndex={-1} // Make dots non-focusable, main trigger is enough
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
        <CardHeader className="pt-4 pb-2"> {/* Adjusted padding */}
          <CardTitle className="text-xl">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pt-0 pb-4"> {/* Adjusted padding */}
          <CardDescription>{project.description}</CardDescription>
        </CardContent>
      </Card>

      {projectImages.length > 0 && (
         <DialogContent 
           className="p-1 sm:p-2 md:p-4 border-0 max-w-none w-screen h-screen bg-transparent flex items-center justify-center overflow-hidden [&>button[data-state=open]]:bg-transparent [&>button[data-state=open]]:text-white [&>button[data-state=open]]:hover:bg-white/10 [&>button[data-state=open]]:hover:text-white [&>button[data-state=open]]:focus:ring-white"
           aria-describedby={undefined} // Remove default aria-describedby if DialogTitle/Description not used in modal
           aria-labelledby={undefined}  // Remove default aria-labelledby
         >
           {/* The X close button is part of DialogContent, styled above to be more visible on dark bg */}
          <ModalCarousel project={project} initialImageIndex={currentImageIndex} isOpen={isModalOpen} />
        </DialogContent>
      )}
    </Dialog>
  );
}


"use client";

import Image from 'next/image';
import type { Project, ProjectImage } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, images.length, goToPreviousModal, goToNextModal, onClose]);


  if (!images || images.length === 0) return null;

  return (
    <div
      className="relative w-auto h-auto p-6" // Main container for positioning context, shrink-wraps content, added padding
      onClick={(e) => e.stopPropagation()} // Prevent closing dialog when clicking carousel container
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${project.id}`}
    >
      <h2 id={`modal-title-${project.id}`} className="sr-only">Image gallery for {project.title}</h2>

      {/* Image Display Area */}
      <div
        className="relative w-[90vw] h-[85vh] sm:w-[85vw] sm:h-[85vh] md:max-w-4xl md:max-h-[85vh] cursor-pointer group/modalimage"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
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
          priority={true}
          key={images[currentIndexInModal].url}
        />
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 -right-4 z-[80] bg-black/50 hover:bg-black/70 text-white rounded-full h-9 w-9 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0"
        aria-label="Close image viewer"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Navigation Buttons (Left/Right, outside image area) */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-[70] -translate-x-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-9 w-9 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0"
            onClick={(e) => { e.stopPropagation(); goToPreviousModal(e); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-[70] translate-x-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-9 w-9 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-0"
            onClick={(e) => { e.stopPropagation(); goToNextModal(e); }}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Dots/Counter Indicator (Bottom, outside image area) */}
      {images.length > 1 && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[70] -mb-4 sm:-mb-5 md:-mb-6 flex items-center space-x-2 bg-black/50 p-1.5 sm:p-2 rounded-full"
          onClick={(e) => e.stopPropagation()} // Prevent closing dialog when clicking dot container
        >
           <p className="text-white text-xs sm:text-sm mx-1 sm:mx-2 select-none">{currentIndexInModal + 1} / {images.length}</p>
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
          />
        </DialogContent>
      )}
    </Dialog>
  );
}



"use client";

import Image from 'next/image';
import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const projectImages = project.images || [];

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if card is wrapped in <a>
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? projectImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === projectImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {projectImages.length > 0 ? (
        <div className="relative w-full h-48 sm:h-56 md:h-64 group">
          <Image
            src={projectImages[currentImageIndex].url}
            alt={`${project.title} - Image ${currentImageIndex + 1}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={projectImages[currentImageIndex].hint}
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          {projectImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex space-x-1.5">
                {projectImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       setCurrentImageIndex(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
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
        <div className="relative w-full h-48 sm:h-56 md:h-64 bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No image available</p>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{project.description}</CardDescription>
      </CardContent>
    </Card>
  );
}

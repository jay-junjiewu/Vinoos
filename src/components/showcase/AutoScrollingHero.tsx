
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HERO_IMAGES } from '@/lib/constants';

export function AutoScrollingHero() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <section className="relative h-[70vh] md:h-[calc(100vh-4rem)] min-h-[400px] max-h-[1080px] w-full overflow-hidden text-primary-foreground">
      {HERO_IMAGES.map((image, index) => (
        <Image
          key={image.id}
          src={image.url}
          alt={image.alt}
          layout="fill"
          objectFit="cover"
          className={cn(
            "transition-opacity duration-1000 ease-in-out",
            index === currentHeroIndex ? "opacity-100" : "opacity-0"
          )}
          data-ai-hint={image.hint}
          priority={index === 0} // Prioritize the first image for LCP
        />
      ))}
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>
      
      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Welcome to AquaCraft Showcase
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto drop-shadow-md">
          Discover stunning custom fish tank builds and top-quality aquarium equipment.
          Let us bring your aquatic vision to life.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl px-8 py-3 text-base">
            <Link href="/projects">View Our Projects</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary-foreground/70 text-primary-foreground hover:bg-primary-foreground/10 shadow-xl backdrop-blur-sm px-8 py-3 text-base">
            <Link href="/equipment">Shop Equipment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

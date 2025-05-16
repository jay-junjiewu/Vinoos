
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HERO_IMAGES } from '@/lib/constants';

export function AutoScrollingHero() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const handleSelectImage = useCallback((index: number) => {
    setCurrentHeroIndex(index);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); 

    return () => clearInterval(intervalId);
  }, []); // Removed currentHeroIndex from dependencies to prevent interval reset on manual change

  return (
    <section className="relative h-[70vh] md:h-[calc(100vh-4rem)] min-h-[400px] max-h-[1080px] w-full overflow-hidden text-primary-foreground">
      {HERO_IMAGES.map((image, index) => (
        <Image
          key={image.id}
          src={image.url}
          alt={image.alt}
          fill
          style={{ objectFit: 'cover' }}
          className={cn(
            "transition-opacity duration-1000 ease-in-out",
            index === currentHeroIndex ? "opacity-100" : "opacity-0"
          )}
          data-ai-hint={image.hint}
          priority={index === 0} 
          sizes="100vw"
        />
      ))}
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>
      
      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Welcome to Vinoos Trading EST.
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto drop-shadow-md">
        We design and build custom, high-quality fish tanks, cabinets, and acrylic projects for homes and businesses, crafting unique aquatic environments since 1997.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl w-full sm:w-64"
          >
            <Link href="/projects">View our Fish Tanks</Link>
          </Button>
          <Button 
            asChild 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl w-full sm:w-64"
          >
            <Link href="/acrylic-projects">View our Acrylics</Link>
          </Button>
        </div>
      </div>

      {/* Bullet Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={`hero-dot-${index}`}
            onClick={() => handleSelectImage(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-3 w-3 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50",
              currentHeroIndex === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>
    </section>
  );
}

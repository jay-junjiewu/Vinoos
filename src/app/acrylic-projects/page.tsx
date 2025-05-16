
"use client";

import { useState } from 'react';
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { PROJECTS_DATA, PROJECT_CATEGORIES } from '@/lib/constants';
import type { ProjectCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Metadata } from 'next';

// Static metadata for the page
// export const metadata: Metadata = {
// title: 'Acrylic Projects - AquaCraft Showcase',
// description: 'Explore our portfolio of custom acrylic fish tank builds and aquarium designs.',
// };


export default function AcrylicProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');

  // Base data for this page: projects that DO include 'Acrylic'
  const acrylicProjectsData = PROJECTS_DATA.filter(project => project.categories.includes('Acrylic'));

  // Categories for filtering on this page: all PROJECT_CATEGORIES except 'Acrylic'
  // "All" on this page means "All Acrylic Projects". Other categories filter within the acrylic set.
  const uniqueCategories = PROJECT_CATEGORIES.filter(category => category !== 'Acrylic');

  const filteredProjects = selectedCategory === 'All'
    ? acrylicProjectsData
    : acrylicProjectsData.filter(project => project.categories.includes(selectedCategory));

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight sm:text-5xl">
          Acrylic Project Gallery
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the artistry and craftsmanship behind our unique acrylic aquarium creations.
        </p>
      </header>

      {/* Category Filters for Desktop */}
      <div className="mb-8 hidden sm:flex flex-wrap justify-center gap-2">
        {uniqueCategories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "transition-all",
              selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/80'
            )}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Category Filter Select for Mobile */}
      <div className="mb-8 sm:hidden">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by category..." />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No acrylic projects found for &quot;{selectedCategory}&quot;.</p>
          <Button variant="link" onClick={() => setSelectedCategory('All')} className="mt-4 text-accent">
            Show all acrylic projects
          </Button>
        </div>
      )}
    </div>
  );
}

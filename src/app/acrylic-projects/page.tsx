
// No "use client" at the top of this file, so it's a Server Component module.

import type { Metadata } from 'next';
import { useState } from 'react'; // This import is fine at the top level
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { ACRYLIC_PROJECTS_DATA, ACRYLIC_PROJECT_CATEGORIES } from '@/lib/constants';
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

// Static metadata for the page
export const metadata: Metadata = {
  title: 'Acrylic Projects - Vinoos',
  description: 'Explore our portfolio of custom acrylic fish tank builds and aquarium designs.',
};

// Define the Client Component part of the page
function AcrylicProjectsClientContent() {
  "use client"; // This directive applies only to this function component

  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');

  const acrylicProjectsData = ACRYLIC_PROJECTS_DATA;
  const uniqueCategories = ACRYLIC_PROJECT_CATEGORIES;

  const filteredProjects = selectedCategory === 'All'
    ? acrylicProjectsData // Assuming ACRYLIC_PROJECTS_DATA is already filtered to acrylic-only
    : acrylicProjectsData.filter(project => project.categories.includes(selectedCategory));

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight sm:text-5xl">
          Acrylic Projects
        </h1>
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

// The default export for the page is a Server Component
export default function AcrylicProjectsPage() {
  return <AcrylicProjectsClientContent />;
}

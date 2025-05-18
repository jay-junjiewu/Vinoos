
"use client";

import { useState } from 'react';
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { CABINET_PROJECTS_DATA, CABINET_PROJECT_CATEGORIES } from '@/lib/constants';
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

export function CabinetProjectsClientContent() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');

  const cabinetProjectsData = CABINET_PROJECTS_DATA;
  const uniqueCategories = CABINET_PROJECT_CATEGORIES;

  const filteredProjects = selectedCategory === 'All'
    ? cabinetProjectsData
    : cabinetProjectsData.filter(project => project.categories.includes(selectedCategory));

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight sm:text-5xl">
          Cabinet Projects
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
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ProjectCategory)}>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No cabinet projects found for &quot;{selectedCategory}&quot;.</p>
          <Button variant="link" onClick={() => setSelectedCategory('All')} className="mt-4 text-accent">
            Show all cabinet projects
          </Button>
        </div>
      )}
    </div>
  );
}

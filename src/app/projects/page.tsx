import { ProjectCard } from '@/components/showcase/ProjectCard';
import { PROJECTS_DATA } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Projects - AquaCraft Showcase',
  description: 'Explore our portfolio of custom fish tank builds and aquarium designs.',
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight sm:text-5xl">
          Project Gallery
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the artistry and craftsmanship behind our unique aquarium creations. Each project is a testament to our passion for aquatic life.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS_DATA.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

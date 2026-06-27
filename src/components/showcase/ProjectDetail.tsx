import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import {
  PROJECT_COLLECTIONS,
  getRelated,
  buildProjectDescription,
  type ProjectCollectionKey,
} from '@/lib/projects';

interface ProjectDetailProps {
  collectionKey: ProjectCollectionKey;
  project: Project;
}

export function ProjectDetail({ collectionKey, project }: ProjectDetailProps) {
  const collection = PROJECT_COLLECTIONS[collectionKey];
  const description = buildProjectDescription(collectionKey, project);
  const related = getRelated(collectionKey, project, 4);
  const categories = project.categories.filter((c) => c !== 'All');

  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description,
    url: `${SITE_URL}/${collectionKey}/${project.id}`,
    creator: { '@id': `${SITE_URL}/#business` },
    image: project.images.map((img) => img.url),
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: collection.label, path: `/${collectionKey}` },
            { name: project.title, path: `/${collectionKey}/${project.id}` },
          ]),
          creativeWork,
        ]}
      />

      {/* Visible breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${collectionKey}`}
              className="hover:text-accent transition-colors"
            >
              {collection.label}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{project.title}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          {project.title}
        </h1>
        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="font-semibold">
                {category}
              </Badge>
            ))}
          </div>
        )}
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          {description}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {project.images.map((img, index) => (
          <div
            key={img.url}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border/50"
          >
            <Image
              src={img.url}
              alt={`${project.title} — ${collection.kind} project by Vinoos Trading EST., image ${index + 1} of ${project.images.length}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
        >
          <Link href="/#contact">Request a quote</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          <Link href={`/${collectionKey}`}>Back to {collection.label}</Link>
        </Button>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-primary mb-6">
            Related Projects
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {related.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                href={`/${collectionKey}/${p.id}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

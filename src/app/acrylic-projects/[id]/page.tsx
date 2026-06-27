import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/showcase/ProjectDetail';
import {
  PROJECT_COLLECTIONS,
  getProject,
  buildProjectDescription,
} from '@/lib/projects';
import { SITE_URL } from '@/lib/seo';

const KEY = 'acrylic-projects' as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECT_COLLECTIONS[KEY].data.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(KEY, id);
  if (!project) return {};
  const description = buildProjectDescription(KEY, project);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/${KEY}/${project.id}` },
    openGraph: {
      title: `${project.title} | Vinoos Trading EST.`,
      description,
      url: `${SITE_URL}/${KEY}/${project.id}`,
      type: 'article',
      images: project.images[0]?.url ? [{ url: project.images[0].url }] : undefined,
    },
  };
}

export default async function AcrylicProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(KEY, id);
  if (!project) notFound();
  return <ProjectDetail collectionKey={KEY} project={project} />;
}

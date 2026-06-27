import {
  FISH_TANK_PROJECTS_DATA,
  ACRYLIC_PROJECTS_DATA,
  CABINET_PROJECTS_DATA,
} from '@/lib/constants';
import type { Project } from '@/types';

export type ProjectCollectionKey =
  | 'projects'
  | 'acrylic-projects'
  | 'cabinet-projects';

export const PROJECT_COLLECTIONS: Record<
  ProjectCollectionKey,
  { data: Project[]; label: string; kind: string }
> = {
  projects: {
    data: FISH_TANK_PROJECTS_DATA,
    label: 'Fish Tank Projects',
    kind: 'custom fish tank',
  },
  'acrylic-projects': {
    data: ACRYLIC_PROJECTS_DATA,
    label: 'Acrylic Projects',
    kind: 'custom acrylic fabrication',
  },
  'cabinet-projects': {
    data: CABINET_PROJECTS_DATA,
    label: 'Aquarium Cabinet Projects',
    kind: 'aquarium cabinet',
  },
};

export function getProject(
  key: ProjectCollectionKey,
  id: string
): Project | undefined {
  return PROJECT_COLLECTIONS[key].data.find((p) => p.id === id);
}

/** Related projects: same category first, then fill from the rest. */
export function getRelated(
  key: ProjectCollectionKey,
  project: Project,
  limit = 4
): Project[] {
  const others = PROJECT_COLLECTIONS[key].data.filter(
    (p) => p.id !== project.id
  );
  const sameCategory = others.filter((p) =>
    p.categories.some(
      (c) => c !== 'All' && project.categories.includes(c)
    )
  );
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}

export function buildProjectDescription(
  key: ProjectCollectionKey,
  project: Project
): string {
  const { kind } = PROJECT_COLLECTIONS[key];
  const cats = project.categories.filter((c) => c !== 'All');
  const catText = cats.length ? ` (${cats.join(', ')})` : '';
  return `${project.title}${catText} is a ${kind} project designed and built by Vinoos Trading EST. It is part of our custom aquarium and fabrication work delivered to homes and businesses across the UAE and the wider region since 1997.`;
}

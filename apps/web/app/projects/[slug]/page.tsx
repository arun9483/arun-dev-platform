import { notFound } from 'next/navigation';
import { loadProjectSlugs, loadProjectDetail } from './page.loader';
import { ProjectDetail } from '@/features/projects/components/ProjectDetail';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await loadProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await loadProjectDetail(slug);
  if (!data) return {};
  return { title: data.project.title, description: data.project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadProjectDetail(slug);
  if (!data) notFound();
  return <ProjectDetail project={data.project} />;
}

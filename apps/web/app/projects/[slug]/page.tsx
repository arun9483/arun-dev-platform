import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loadProjectSlugs, loadProjectDetail } from './page.loader';
import { ImpactMetricBadge } from '@/features/projects/components/ImpactMetricBadge';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await loadProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await loadProjectDetail(slug);
  if (!data) return {};
  return {
    title: data.project.title,
    description: data.project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadProjectDetail(slug);
  if (!data) notFound();

  const { title, description, problem, solution, techStack, impact, links, coverImage } =
    data.project;

  return (
    <div>
      {coverImage && (
        <div className="cover">
          <Image
            src={coverImage}
            alt={`Cover image for ${title}`}
            width={1200}
            height={480}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-12">
        <Link href="/projects" className="link-back hover:opacity-75">
          ← Back to projects
        </Link>

        {/* Hero */}
        <div className="space-y-5">
          <div className="bar-accent" />
          <h1 className="text-4xl font-bold text-display">{title}</h1>
          <p className="text-base leading-relaxed max-w-2xl text-secondary">{description}</p>
          <div className="flex gap-2 flex-wrap">
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost hover:opacity-75"
              >
                GitHub ↗
              </a>
            )}
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary hover:opacity-75"
              >
                Live site ↗
              </a>
            )}
          </div>
        </div>

        {/* Impact metrics */}
        {impact.length > 0 && (
          <section className="space-y-4">
            <h2 className="overline">Impact</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {impact.map((metric, i) => (
                <ImpactMetricBadge key={i} metric={metric} />
              ))}
            </div>
          </section>
        )}

        {/* Problem / Solution */}
        <div className="card rounded-xl p-8 space-y-8">
          <div className="space-y-3">
            <h2 className="overline">Problem</h2>
            <p className="text-base leading-relaxed text-primary">{problem}</p>
          </div>
          <div className="space-y-3 border-top-default pt-8">
            <h2 className="overline">Solution</h2>
            <p className="text-base leading-relaxed text-primary">{solution}</p>
          </div>
        </div>

        {/* Tech stack */}
        <section className="space-y-4">
          <h2 className="overline">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="chip chip-default">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

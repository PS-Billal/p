import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "./Interactive";
import ProjectPreview from "./ProjectPreview";
export default function ProjectCard({ project: p }) {
  return (
    <TiltCard as="article" className="project-card" strength={7}>
      <a
        href={`/projects/${p.slug}/`}
        className="project-image-link"
        aria-label={`Read ${p.name} case study`}
      >
        <ProjectPreview type={p.type} />
      </a>
      <div className="project-content">
        <div className="project-meta">
          <span>{p.category}</span>
          <span>{p.number} / 04</span>
        </div>
        <h3>
          <a href={`/projects/${p.slug}/`}>
            {p.name}
            <ArrowUpRight size={24} />
          </a>
        </h3>
        <p>{p.description}</p>
        <div className="project-engineering">
          <b>THE ENGINEERING</b>
          <p>{p.solution}</p>
        </div>
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <a href={`/projects/${p.slug}/`} className="case-link">
          Explore case study <ArrowUpRight size={16} />
        </a>
      </div>
    </TiltCard>
  );
}

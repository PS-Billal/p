import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { projects } from "../../../data/portfolio";
import Navbar from "../../../components/layout/Navbar";
import ProjectPreview from "../../../components/ui/ProjectPreview";
import { TiltButton } from "../../../components/ui/Interactive";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p
    ? {
        title: p.name,
        description: p.description,
        alternates: { canonical: `/projects/${slug}/` },
      }
    : {};
}
export default async function Project({ params }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <Navbar />
      <main className="case-study">
        <a className="case-back" href="/#projects">
          <ArrowLeft size={16} /> Back to selected work
        </a>
        <div className="eyebrow">
          {p.category} / {p.company}
        </div>
        <h1>{p.name}</h1>
        <p className="case-lead">{p.description}</p>
        <div className="case-tags tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <ProjectPreview type={p.type} large />
        <div className="case-body">
          <aside>
            <span>PROJECT NOTES</span>
            <b>{p.company}</b>
            <p>Production software</p>
            <a href="mailto:billalyasir5@gmail.com">
              Discuss this project <ArrowUpRight size={14} />
            </a>
          </aside>
          <div>
            <section>
              <span className="eyebrow">01 / THE CONTEXT</span>
              <h2>The business problem</h2>
              <p>{p.challenge}</p>
            </section>
            <section>
              <span className="eyebrow">02 / THE WORK</span>
              <h2>Role & approach</h2>
              <p>
                {p.slug === "homeselling-platform"
                  ? "Contributed to the production platform’s AI and decision-support capabilities."
                  : "Built " +
                    p.name +
                    " as part of my work at " +
                    p.company +
                    "."}
              </p>
              <p>{p.solution}</p>
            </section>
            <section>
              <span className="eyebrow">03 / ENGINEERING SCOPE</span>
              <h2>What the system involved</h2>
              <ul>
                {p.details.map((d) => (
                  <li key={d}>
                    <Check size={16} />
                    {d}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <span className="eyebrow">04 / PRODUCTION</span>
              <h2>The outcome</h2>
              <p>{p.outcome}</p>
              <p className="case-note">
                This case study covers the publicly shareable scope provided for
                this portfolio. The interface above is a conceptual
                illustration; proprietary screenshots and unsupported
                performance metrics are not included.
              </p>
            </section>
            <TiltButton href="mailto:billalyasir5@gmail.com">
              Talk engineering <ArrowUpRight size={17} />
            </TiltButton>
          </div>
        </div>
        <a href="/#projects" className="case-back">
          <ArrowLeft size={16} /> Explore all projects
        </a>
      </main>
    </>
  );
}

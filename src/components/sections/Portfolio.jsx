import {
  ArrowUpRight,
  Code2,
  Braces,
  Database,
  Sparkles,
  Cloud,
  ShieldCheck,
  GitBranch,
  Layers,
  Users,
  Check,
  MapPin,
  GraduationCap,
  ArrowUp,
  Mail,
} from "lucide-react";
import { skills, projects, experience, tech } from "../../data/portfolio";
import { TiltCard, FloatingTechCard, MagneticButton } from "../ui/Interactive";
import ProjectCard from "../ui/ProjectCard";
const icons = {
  frontend: Braces,
  backend: Database,
  ai: Sparkles,
  cloud: Cloud,
  security: ShieldCheck,
  code: Code2,
};
export function SectionHeading({ number, label, title, description }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">
          <span>{number} /</span> {label}
        </div>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
export function EngineeringHighlights() {
  return (
    <section id="highlights" className="highlights">
      <div className="highlight-grid">
        {[
          [Code2, "3+ years", "Engineering experience"],
          [Layers, "Production-first", "SaaS & AI systems"],
          [GitBranch, "End to end", "Product development"],
          [Database, "Real time", "Business applications"],
        ].map(([Icon, title, sub]) => (
          <div key={title}>
            <Icon size={21} />
            <span>
              <b>{title}</b>
              <small>{sub}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="companies">
        <span>PRODUCTION EXPERIENCE AT</span>
        <b>
          powersoft<span>365</span>
        </b>
        <b className="homeselling">
          homeselling<span>.ai</span>
        </b>
        <span className="company-caption">
          Building software beyond the demo.
        </span>
      </div>
    </section>
  );
}
export function FeaturedProjects() {
  return (
    <section id="projects" className="section" tabIndex={-1}>
      <SectionHeading
        number="01"
        label="SELECTED PROJECTS"
        title={
          <>
            Selected work,
            <br />
            <span>real impact.</span>
          </>
        }
        description="Real products. Real engineering challenges. A closer look at the systems I’ve helped bring to production."
      />
      <div className="projects-grid">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <div className="section-footnote">
        <span className="status-dot" /> Production work, thoughtfully
        documented. Conceptual previews protect proprietary interfaces.
      </div>
    </section>
  );
}
export function SkillsSection() {
  return (
    <section id="skills" className="section skills-section" tabIndex={-1}>
      <SectionHeading
        number="02"
        label="MY TOOLKIT"
        title={
          <>
            Skills &<br />
            <span>Tech Stack.</span>
          </>
        }
        description="The technologies and engineering practices I use to build scalable, reliable, production-ready software."
      />
      <div className="skills-grid">
        {skills.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <TiltCard
              as="article"
              className="skill-card"
              strength={4}
              key={s.name}
            >
              <div className="skill-top">
                <span className="skill-icon">
                  <Icon size={23} />
                </span>
                <small>0{i + 1}</small>
              </div>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </TiltCard>
          );
        })}
      </div>
      <div className="tech-heading">
        <span>TOOLS OF THE TRADE</span>
        <span>A connected stack. A practical approach.</span>
      </div>
      <div className="tech-stack">
        {tech.map((t) => (
          <FloatingTechCard className="tech-tile" key={t}>
            {["OpenAI", "Pinecone", "AWS"].includes(t) ? (
              <span className="tech-logo-fallback" aria-hidden="true">
                {t === "OpenAI" ? (
                  <Sparkles size={27} />
                ) : t === "Pinecone" ? (
                  <Database size={27} />
                ) : (
                  <Cloud size={27} />
                )}
              </span>
            ) : (
              <img
                src={`/icons/${t.toLowerCase().replaceAll(".", "")}.svg`}
                width="27"
                height="27"
                alt=""
                loading="lazy"
              />
            )}
            <span>{t}</span>
          </FloatingTechCard>
        ))}
      </div>
    </section>
  );
}
export function Experience() {
  return (
    <section id="experience" className="section" tabIndex={-1}>
      <SectionHeading
        number="03"
        label="THE JOURNEY"
        title={
          <>
            Production is
            <br />
            <span>where I learn.</span>
          </>
        }
        description="Hands-on experience taking ownership, connecting the pieces, and shipping software people rely on."
      />
      <div className="timeline">
        {experience.map((e, i) => (
          <div className="timeline-entry" key={e.company}>
            <div className="timeline-date">
              <span className="timeline-node" />
              <b>{e.period}</b>
              <span>{i === 0 ? "CURRENT CHAPTER" : "PREVIOUSLY"}</span>
            </div>
            <TiltCard as="article" className="experience-card" strength={2}>
              <div className="experience-heading">
                <div>
                  <h3>{e.company}</h3>
                  <p>{e.role}</p>
                </div>
                <span>
                  <MapPin size={13} />
                  {e.location}
                </span>
              </div>
              <ul>
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="tags">
                {e.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}
export function About() {
  return (
    <section id="about" className="section about-section" tabIndex={-1}>
      <div className="about-intro">
        <div>
          <div className="eyebrow">
            <span>04 /</span> BEHIND THE CODE
          </div>
          <h2>
            Curiosity meets
            <br />
            <span>ownership.</span>
          </h2>
        </div>
        <div className="about-copy">
          <p>
            I’m a full-stack developer based in Nicosia, Cyprus. My work spans
            SaaS, AI integrations, and real-time business systems — from the
            interface to the APIs and the deployment behind it.
          </p>
          <p>
            I care about practical architecture, performance, and reliability. I
            like understanding the whole problem, building for the people using
            the product, and continuing to improve what ships.
          </p>
          <div className="signature">
            Billal Yasir{" "}
            <span>Developer. Problem solver. Product thinker.</span>
          </div>
        </div>
      </div>
      <div className="principle-grid">
        {[
          [
            Layers,
            "Think Beyond the UI",
            "A good interface starts with understanding the data, the workflow, and the system behind it.",
          ],
          [
            Users,
            "Build for Real Users",
            "Solve the actual problem. Make the everyday workflow simpler, clearer, and more dependable.",
          ],
          [
            Check,
            "Own What You Ship",
            "Take responsibility from implementation to deployment, production support, and the next improvement.",
          ],
        ].map(([Icon, title, desc], i) => (
          <TiltCard className="principle-card" strength={3} key={title}>
            <div>
              <span>0{i + 1}</span>
              <Icon size={21} />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
export function Education() {
  return (
    <section id="education" className="education-section">
      <div className="eyebrow">
        <span>05 /</span> FOUNDATIONS
      </div>
      <TiltCard className="education-card" strength={2}>
        <span className="education-icon">
          <GraduationCap size={28} />
        </span>
        <div>
          <h3>Shahebabad Degree College</h3>
          <p>High School, Science · Cumilla, Bangladesh</p>
        </div>
        <div className="education-result">
          <b>2019 — 2021</b>
          <span>Result: 4.42 / 5.00</span>
        </div>
      </TiltCard>
    </section>
  );
}
export function Contact() {
  return (
    <section id="contact" className="contact-section" tabIndex={-1}>
      <div className="contact-grid" />
      <div className="eyebrow">
        <span>06 /</span> WHAT’S NEXT?
      </div>
      <div className="contact-main">
        <div>
          <h2>
            Have a big problem
            <br />
            <em>worth solving?</em>
          </h2>
          <p>
            I’m interested in building ambitious software products, solving
            engineering challenges, and contributing to teams creating
            meaningful impact.
          </p>
          <MagneticButton href="mailto:billalyasir5@gmail.com">
            Let’s connect <ArrowUpRight size={21} />
          </MagneticButton>
        </div>
        <div className="contact-orb" aria-hidden="true">
          <span />
          <span />
          <span />
          <ArrowUpRight size={76} strokeWidth={1} />
        </div>
      </div>
      <div className="contact-details">
        <a href="mailto:billalyasir5@gmail.com">
          <Mail size={16} /> billalyasir5@gmail.com <ArrowUpRight size={14} />
        </a>
        <span>
          <MapPin size={16} /> Nicosia, Cyprus
        </span>
        <a href="https://billalyasir.com">
          billalyasir.com <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer>
      <a className="brand" href="/#home">
        <span className="monogram">
          BY<span>.</span>
        </span>
        <span>Billal Yasir.</span>
      </a>
      <span>© {new Date().getFullYear()} Md Billal Yasir</span>
      <a className="back-top" href="#home">
        Back to top <ArrowUp size={15} />
      </a>
    </footer>
  );
}

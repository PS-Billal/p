import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import {
  EngineeringHighlights,
  FeaturedProjects,
  SkillsSection,
  Experience,
  About,
  Education,
  Contact,
  Footer,
} from "../components/sections/Portfolio";
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <EngineeringHighlights />
        <FeaturedProjects />
        <SkillsSection />
        <Experience />
        <About />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

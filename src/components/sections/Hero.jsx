import {
  ArrowUpRight,
  ArrowDown,
  MapPin,
  Code2,
  Database,
  Braces,
  Sparkles,
  Check,
  Radio,
} from "lucide-react";
import { TiltCard, MagneticButton, TiltButton } from "../ui/Interactive";
export default function Hero() {
  return (
    <section id="home" className="hero" tabIndex={-1}>
      <div className="hero-topline">
        <span>
          <i /> AVAILABLE FOR MEANINGFUL WORK
        </span>
        <span>
          <MapPin size={12} /> NICOSIA, CYPRUS
        </span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="short-line" /> FULL-STACK SOFTWARE DEVELOPER
          </div>
          <h1>
            Engineering
            <br />
            products that
            <br />
            <em>actually ship.</em>
          </h1>
          <p>
            I’m <strong>Md Billal Yasir</strong>, a Full-Stack Software
            Developer with 3+ years of experience building production SaaS,
            AI-powered applications, and real-time business systems.
          </p>
          <div className="hero-actions">
            <MagneticButton href="#projects">
              Explore my work <ArrowUpRight size={19} />
            </MagneticButton>
            <TiltButton
              href="mailto:billalyasir5@gmail.com"
              variant="secondary"
            >
              Let’s connect <ArrowUpRight size={18} />
            </TiltButton>
          </div>
          <div className="hero-note">
            <span className="tiny-avatars">
              <Code2 size={16} />
              <Sparkles size={15} />
            </span>
            <span>From the first commit to production.</span>
          </div>
        </div>
        <div className="engineering-scene">
          <div className="scene-grid" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="scene-caption">A FULL-STACK MINDSET</span>
          <TiltCard className="architecture" strength={5}>
            <div className="editor-bar">
              <span className="window-dots">● ● ●</span>
              <span>product.architecture</span>
              <Code2 size={14} />
            </div>
            <div className="editor-code">
              <span className="line-number">01</span>
              <span>
                <b>const</b> product = <em>build</em>({"{"}
              </span>
              <span className="line-number">02</span>
              <span>
                &nbsp; idea: <i>“something that matters”</i>,
              </span>
              <span className="line-number">03</span>
              <span>
                &nbsp; mindset: <i>“end-to-end”</i>
              </span>
              <span className="line-number">04</span>
              <span>{"}"});</span>
            </div>
            <div className="architecture-layers">
              {[
                [Braces, "01", "CLIENT", "React / Next.js"],
                [Code2, "02", "APPLICATION", "Node.js / APIs"],
                [Sparkles, "03", "INTELLIGENCE", "OpenAI / RAG"],
                [Database, "04", "DATA", "MongoDB / Redis"],
              ].map(([Icon, n, title, desc]) => (
                <div className="architecture-layer" key={n}>
                  <span className="layer-icon">
                    <Icon size={20} />
                  </span>
                  <span>
                    <small>{title}</small>
                    <b>{desc}</b>
                  </span>
                  <span className="layer-number">{n}</span>
                  <i />
                </div>
              ))}
            </div>
            <div className="editor-status">
              <span>
                <i /> All systems connected
              </span>
              <span>
                production-ready <Check size={11} />
              </span>
            </div>
          </TiltCard>
          <div className="floating-token token-react">
            <span>⚛</span> React
          </div>
          <div className="floating-token token-js">
            <b>JS</b> JavaScript
          </div>
          <div className="deployment-badge">
            <span>
              <Check size={15} />
            </span>
            <div>
              Built to go live.<small>Ideas → systems → production</small>
            </div>
            <Radio size={16} />
          </div>
          <div className="scene-coordinate">CLIENT → API → AI → DATA</div>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#highlights">
          <ArrowDown size={14} /> SCROLL TO EXPLORE
        </a>
        <span>THOUGHTFUL CODE. REAL-WORLD PRODUCTS.</span>
      </div>
    </section>
  );
}

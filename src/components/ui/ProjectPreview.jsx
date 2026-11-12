import {
  ArrowUpRight,
  Bot,
  Database,
  FileText,
  Search,
  Sparkles,
  Check,
  Layers,
} from "lucide-react";
export default function ProjectPreview({ type, large = false }) {
  return (
    <div
      className={`project-preview ${type} ${large ? "large" : ""}`}
      aria-label="Conceptual interface illustration"
    >
      <div className="preview-toolbar">
        <span className="window-dots">● ● ●</span>
        <span>
          {type === "kds"
            ? "Kitchen operations"
            : type === "rag"
              ? "licious / knowledge studio"
              : type === "seo"
                ? "Catalog content studio"
                : "homeselling / intelligence"}
        </span>
        <ArrowUpRight size={12} />
      </div>
      {type === "kds" ? (
        <>
          <div className="kitchen-title">
            <b>
              Kitchen overview <span>Live</span>
            </b>
            <small>All orders &nbsp; / &nbsp; Main kitchen</small>
          </div>
          <div className="orders">
            {["Incoming", "Preparing", "Ready to serve"].map((s, i) => (
              <div key={s}>
                <div className="order-label">
                  <i /> {s} <span>{i + 1}</span>
                </div>
                {[0, 1].slice(0, i === 2 ? 1 : 2).map((n) => (
                  <div className="order" key={n}>
                    <b>
                      Table {["04", "12", "08"][i]}
                      <small>#{1024 + i * 3 + n}</small>
                    </b>
                    <p>
                      <span>2×</span> {n ? "Garden salad" : "Grilled chicken"}
                    </p>
                    <p>
                      <span>1×</span>{" "}
                      {n ? "Fresh lemonade" : "Roasted vegetables"}
                    </p>
                    <div className="order-bottom">
                      <span>◷ {i + 2}:04</span>
                      <i />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : type === "rag" ? (
        <div className="rag-layout">
          <aside>
            <div className="mini-logo">
              l<span>●</span>
            </div>
            <span>
              <Layers size={12} /> Overview
            </span>
            <span className="selected">
              <Database size={12} /> Knowledge
            </span>
            <span>
              <Bot size={12} /> Chatbots
            </span>
            <span>
              <FileText size={12} /> Training
            </span>
          </aside>
          <div className="rag-main">
            <div className="rag-heading">
              Your knowledge. <em>Connected.</em>
            </div>
            <div className="knowledge-files">
              {[
                "Website content",
                "Product documentation",
                "Support resources",
              ].map((s) => (
                <div key={s}>
                  <FileText size={15} />
                  <span>
                    {s}
                    <small>Ready for training</small>
                  </span>
                  <Check size={13} />
                </div>
              ))}
            </div>
            <div className="rag-answer">
              <Sparkles size={15} />
              <span>
                Answers grounded in your business.
                <i />
                <i />
              </span>
            </div>
          </div>
        </div>
      ) : type === "seo" ? (
        <div className="seo-layout">
          <div>
            <span className="preview-eyebrow">PRODUCT CATALOG</span>
            <h4>
              Good content.
              <br />
              At catalog scale.
            </h4>
            <div className="language">
              English <span>EN</span>
            </div>
            <div className="language">
              Ελληνικά <span>EL</span>
            </div>
          </div>
          <div className="seo-sheet">
            <div>
              <Sparkles size={15} /> Generated content
            </div>
            {["SEO title", "Product description", "Image mapping"].map((s) => (
              <section key={s}>
                <small>{s}</small>
                <i />
                <i />
              </section>
            ))}
            <b>
              <Check size={12} /> Ready to export
            </b>
          </div>
        </div>
      ) : (
        <div className="platform-layout">
          <div className="search-mock">
            <Search size={14} /> Find a place that feels like home
          </div>
          <div className="houses">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className={`house house-${i}`}>
                  <span />
                  <i />
                </div>
                <div className="house-lines">
                  <i />
                  <i />
                </div>
              </div>
            ))}
          </div>
          <div className="semantic">
            <Sparkles size={14} />
            <span>Semantic search meets smarter decisions.</span>
          </div>
        </div>
      )}
      <span className="concept-label">
        CONCEPTUAL INTERFACE · NOT A PRODUCT SCREENSHOT
      </span>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const sections = ["Home", "Projects", "Skills", "Experience", "About"];
export default function Navbar() {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState("home"),
    [scrolled, setScrolled] = useState(false);
  const toggle = useRef(null),
    panel = useRef(null);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", scroll);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("a")?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = [...panel.current.querySelectorAll("a"), toggle.current];
        const first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-shell">
        <a href="/#home" className="brand" aria-label="Billal Yasir home">
          <span className="monogram">
            BY<span>.</span>
          </span>
          <span>
            Billal Yasir<span className="brand-dot">.</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {sections.map((s) => (
            <a
              key={s}
              href={`/#${s.toLowerCase()}`}
              aria-current={active === s.toLowerCase() ? "location" : undefined}
            >
              {s}
            </a>
          ))}
        </nav>
        <a className="nav-contact" href="/#contact-form">
          Let’s talk <ArrowUpRight size={15} />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          ref={panel}
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {sections.map((s) => (
            <a
              key={s}
              href={`/#${s.toLowerCase()}`}
              onClick={() => {
                setOpen(false);
                setTimeout(
                  () =>
                    document
                      .getElementById(s.toLowerCase())
                      ?.focus({ preventScroll: true }),
                  50,
                );
              }}
            >
              {s}
              <ArrowUpRight size={20} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

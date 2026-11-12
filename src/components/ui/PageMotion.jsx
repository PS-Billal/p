"use client";

import { useEffect } from "react";

export default function PageMotion() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;

    // Only mark elements close to the viewport. Content stays visible without JS.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.animate(
            [
              { opacity: 0.5, translate: "0 16px" },
              { opacity: 1, translate: "0 0" },
            ],
            { duration: 550, easing: "cubic-bezier(.2,.7,.3,1)" },
          );
          observer.unobserve(target);
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll(
        ".section-heading, .project-card, .skill-card, .timeline-entry, .principle-card",
      )
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return null;
}

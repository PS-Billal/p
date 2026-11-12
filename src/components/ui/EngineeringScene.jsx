"use client";

import { useEffect, useRef } from "react";

export default function EngineeringScene({ children }) {
  const scene = useRef(null);

  useEffect(() => {
    const element = scene.current;
    const observer = new ResizeObserver(([entry]) => {
      // Scale the whole composition together, including badges and safe margins.
      element.style.setProperty("--scene-scale", entry.contentRect.width / 480);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scene} className="engineering-scene">
      <div className="scene-stage">{children}</div>
    </div>
  );
}

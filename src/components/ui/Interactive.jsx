"use client";
import { useEffect, useRef } from "react";

// Mutable CSS properties and one animation frame keep pointer movement outside React.
export function TiltCard({
  children,
  className = "",
  strength = 7,
  as: Tag = "div",
  magnetic = false,
  ...props
}) {
  const ref = useRef(null),
    frame = useRef(null);
  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );
  function move(e) {
    if (
      e.pointerType === "touch" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const el = ref.current,
      box = el.getBoundingClientRect(),
      x = (e.clientX - box.left) / box.width,
      y = (e.clientY - box.top) / box.height;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      el.style.setProperty("--rx", `${(0.5 - y) * strength * 2}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * strength * 2}deg`);
      el.style.setProperty("--px", `${x * 100}%`);
      el.style.setProperty("--py", `${y * 100}%`);
      el.style.setProperty("--mx", magnetic ? `${(x - 0.5) * 5}px` : "0px");
      el.dataset.hover = "true";
      frame.current = null;
    });
  }
  function reset() {
    if (frame.current) cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--mx", "0px");
      el.dataset.hover = "false";
    }
  }
  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
      {...props}
    >
      {children}
    </Tag>
  );
}
export function TiltButton({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <TiltCard
      as={href ? "a" : "button"}
      href={href}
      strength={3}
      className={`button ${variant} ${className}`}
      {...props}
    >
      {children}
    </TiltCard>
  );
}
export function MagneticButton(props) {
  return <TiltButton magnetic {...props} />;
}
export function SpotlightCard(props) {
  return <TiltCard {...props} />;
}
export function FloatingTechCard(props) {
  return <TiltCard strength={5} {...props} />;
}

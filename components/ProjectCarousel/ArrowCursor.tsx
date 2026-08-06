"use client";

import { useRef } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import styles from "./ArrowCursor.module.css";

export function ArrowCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);

  useMountEffect(() => {
    const arrow = arrowRef.current;
    if (!arrow) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let arrowWidth = 0;
    let arrowHeight = 0;

    const measure = () => {
      const rect = arrow.getBoundingClientRect();
      arrowWidth = rect.width;
      arrowHeight = rect.height;
    };

    const hide = () => {
      arrow.dataset.isVisible = "false";
    };

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const isOverCarousel = Boolean(
        target?.closest("[data-carousel-viewport]"),
      );

      arrow.dataset.isVisible = String(isOverCarousel);
      if (!isOverCarousel) return;

      arrow.dataset.direction =
        event.clientX < window.innerWidth / 2 ? "previous" : "next";
      arrow.style.transform = `translate3d(${event.clientX - arrowWidth / 2}px, ${
        event.clientY - arrowHeight / 2
      }px, 0)`;
    };

    measure();
    window.addEventListener("resize", measure);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", hide);

    return () => {
      window.removeEventListener("resize", measure);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", hide);
    };
  });

  return (
    <div
      ref={arrowRef}
      className={styles.arrow}
      data-is-visible="false"
      data-direction="next"
      aria-hidden="true"
    >
      <svg className={styles.icon} viewBox="0 0 100 42" fill="none">
        <path
          d="M4 21H95M68 4L95 21L68 38"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}

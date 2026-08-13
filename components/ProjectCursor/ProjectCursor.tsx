"use client";

import { useRef } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import styles from "./ProjectCursor.module.css";

const OFFSET = 12;

export function ProjectCursor() {
  const labelRef = useRef<HTMLDivElement>(null);

  useMountEffect(() => {
    const label = labelRef.current;
    if (!label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let pointerX = 0;
    let pointerY = 0;
    let title = "";
    let labelWidth = 0;
    let labelHeight = 0;

    const place = () => {
      const overflowsRight =
        pointerX + OFFSET + labelWidth > document.documentElement.clientWidth;
      const x = overflowsRight
        ? pointerX - OFFSET - labelWidth
        : pointerX + OFFSET;
      const y = Math.min(
        Math.max(pointerY - labelHeight / 2, 0),
        window.innerHeight - labelHeight,
      );
      label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const update = (element: Element | null) => {
      const card = element?.closest<HTMLElement>("[data-project-title]");
      const next = card?.dataset.projectTitle ?? "";

      if (next !== title) {
        title = next;
        label.textContent = next;
        const rect = label.getBoundingClientRect();
        labelWidth = rect.width;
        labelHeight = rect.height;
      }

      label.dataset.isVisible = String(title !== "");
      if (title) place();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      update(event.target as Element);
    };

    const handlePointerLeave = () => update(null);

    let scrollFrame = 0;

    const handleScroll = () => {
      if (title === "" || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        update(document.elementFromPoint(pointerX, pointerY));
      });
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      cancelAnimationFrame(scrollFrame);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("scroll", handleScroll, true);
    };
  });

  return (
    <div
      ref={labelRef}
      className={styles.cursor}
      data-is-visible="false"
      aria-hidden="true"
    />
  );
}

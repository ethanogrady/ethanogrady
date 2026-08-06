"use client";

import { useMountEffect } from "@/hooks/useMountEffect";

const EDGE_PADDING = 24;

export function ListPreview() {
  useMountEffect(() => {
    const placePreview = (row: HTMLElement) => {
      const title = row.querySelector<HTMLElement>("[data-list-title]");
      const year = row.querySelector<HTMLElement>("[data-list-year]");
      const preview = row.querySelector<HTMLElement>("[data-list-preview]");
      if (!title || !year || !preview) return;

      const previewWidth = preview.offsetWidth;
      if (previewWidth === 0) return;

      const rowLeft = row.getBoundingClientRect().left;
      const gapStart = title.getBoundingClientRect().right;
      const gapEnd = year.getBoundingClientRect().left;

      const min = gapStart + EDGE_PADDING + previewWidth / 2;
      const max = gapEnd - EDGE_PADDING - previewWidth / 2;
      const centre =
        max > min ? min + Math.random() * (max - min) : (gapStart + gapEnd) / 2;

      preview.style.setProperty("--preview-x", `${centre - rowLeft}px`);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const row = target?.closest<HTMLElement>("[data-list-row]");
      if (!row) return;
      if (row.contains(event.relatedTarget as Node | null)) return;
      placePreview(row);
    };

    document.addEventListener("pointerover", handlePointerOver);
    return () => document.removeEventListener("pointerover", handlePointerOver);
  });

  return null;
}

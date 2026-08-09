"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Asset } from "@/components/Asset/Asset";
import { useMountEffect } from "@/hooks/useMountEffect";
import type { Project } from "@/lib/content";
import styles from "./ProjectCarousel.module.css";

const SLIDE_SIZES = "(min-width: 768px) 82vw, 84vw";
const PREFETCH_RADIUS = 3;
const THUMB_SIZES = "(min-width: 1280px) 13vw, (min-width: 768px) 18vw, 30vw";

function measureTrack(slides: Project["assets"]) {
  const ratios = slides.map((slide) => slide.width / slide.height);
  let running = 0;
  const offsets = ratios.map((ratio) => {
    const offset = running;
    running += ratio;
    return offset;
  });
  const centers = offsets.map((offset, index) => offset + ratios[index] / 2);
  return { ratios, offsets, centers };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function ProjectCarousel({ project }: { project: Project }) {
  const { assets } = project;
  const total = assets.length;
  const slides = [assets[total - 1], ...assets, assets[0]];
  const { ratios, offsets, centers } = measureTrack(slides);

  const containerRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState(1);
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  const activeIndex = position - 1;

  const go = (delta: number) =>
    setPosition((current) => ((current - 1 + delta + total) % total) + 1);

  const openSlide = (index: number) => {
    setPosition(index + 1);
    setIsIndexOpen(false);
  };

  useMountEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsIndexOpen(false);
        return;
      }
      if (container.dataset.isIndexOpen === "true") return;
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleClick = (event: MouseEvent<HTMLDivElement>) =>
    go(event.clientX < window.innerWidth / 2 ? -1 : 1);

  return (
    <main
      ref={containerRef}
      className={styles.container}
      data-is-index-open={isIndexOpen}
    >
      <div
        className={styles.viewport}
        style={{ "--active-ratio": String(ratios[position]) } as CSSProperties}
        onClick={handleClick}
      >
        <ol
          className={styles.track}
          style={
            {
              "--center-multiplier": String(centers[position]),
              "--gap-count": String(position),
            } as CSSProperties
          }
        >
          {slides.map((slide, slideIndex) => {
            const isVisibleOnLoad = slideIndex < 3;
            const isNearActive =
              Math.abs(slideIndex - position) <= PREFETCH_RADIUS;

            return (
              <li
                key={`${slide.src}-${slideIndex}`}
                className={styles.slide}
                style={
                  {
                    "--ratio": String(ratios[slideIndex]),
                    "--offset": String(offsets[slideIndex]),
                    "--index": String(slideIndex),
                  } as CSSProperties
                }
              >
                <Asset
                  asset={slide}
                  alt={project.title}
                  sizes={SLIDE_SIZES}
                  preload={isVisibleOnLoad}
                  loading={
                    isVisibleOnLoad || isNearActive ? "eager" : "lazy"
                  }
                />
              </li>
            );
          })}
        </ol>
      </div>

      {isIndexOpen && (
        <div className={styles.index}>
          <ol className={styles.indexGrid}>
            {assets.map((asset, assetIndex) => (
              <li key={asset.src}>
                <button
                  type="button"
                  className={styles.indexItem}
                  onClick={() => openSlide(assetIndex)}
                  aria-label={`Go to image ${assetIndex + 1} of ${total}`}
                >
                  <Asset asset={asset} sizes={THUMB_SIZES} />
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      <footer className={styles.bar}>
        <button
          type="button"
          className={styles.barIndex}
          onClick={() => setIsIndexOpen((open) => !open)}
          aria-expanded={isIndexOpen}
        >
          {isIndexOpen ? "Close" : "Index"}
        </button>
        <span className={styles.barTitle}>{project.title}</span>
        <span className={styles.barCounter}>
          {pad(activeIndex + 1)} / {pad(total)}
        </span>
      </footer>
    </main>
  );
}

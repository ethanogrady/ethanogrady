"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { flushSync } from "react-dom";
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
  const centers = ratios.map((ratio) => {
    const center = running + ratio / 2;
    running += ratio;
    return center;
  });
  return { ratios, centers, maxRatio: Math.max(...ratios) };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function ProjectCarousel({ project }: { project: Project }) {
  const { assets } = project;
  const total = assets.length;
  const slides = [assets[total - 1], ...assets, assets[0]];
  const { ratios, centers, maxRatio } = measureTrack(slides);

  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [position, setPosition] = useState(1);
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  const activeIndex = (position - 1 + total) % total;

  const go = (delta: number) =>
    setPosition((current) => Math.min(total + 1, Math.max(0, current + delta)));

  const openSlide = (index: number) => {
    setPosition(index + 1);
    setIsIndexOpen(false);
  };

  useMountEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== "transform") return;
      const current = Number(track.dataset.position);
      if (current !== 0 && current !== total + 1) return;

      track.dataset.isSnapping = "true";
      flushSync(() => setPosition(current === 0 ? total : 1));
      void track.offsetHeight;
      track.dataset.isSnapping = "false";
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsIndexOpen(false);
        return;
      }
      if (container.dataset.isIndexOpen === "true") return;
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };

    track.addEventListener("transitionend", handleTransitionEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      track.removeEventListener("transitionend", handleTransitionEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
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
        style={{ "--max-ratio": String(maxRatio) } as CSSProperties}
        onClick={handleClick}
      >
        <ol
          ref={trackRef}
          className={styles.track}
          data-position={position}
          data-is-snapping="false"
          style={
            {
              "--active-ratio": String(ratios[position]),
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
                  { "--ratio": String(ratios[slideIndex]) } as CSSProperties
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

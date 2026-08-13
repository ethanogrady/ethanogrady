"use client";

import { useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useMountEffect } from "@/hooks/useMountEffect";
import styles from "./ScrollContainer.module.css";

type ScrollContainerProps = {
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

const THUMB_INSET = 3;
const MIN_THUMB_HEIGHT = 24;
const HIDE_DELAY = 700;

export function ScrollContainer({
  className,
  contentClassName,
  children,
}: ScrollContainerProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useMountEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!wrapper || !content || !track || !thumb) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lenis = new Lenis({
      wrapper,
      content,
      lerp: prefersReducedMotion ? 1 : 0.1,
      smoothWheel: !prefersReducedMotion,
    });

    let animationFrame = 0;
    let hideTimeout = 0;
    let drag: { pointerY: number; scroll: number } | null = null;

    let geometry = { thumbHeight: 0, travel: 0, overflow: 1 };

    const measure = () => {
      const usableTrack = track.clientHeight - THUMB_INSET * 2;
      const viewport = wrapper.clientHeight;
      const contentHeight = content.scrollHeight;
      const overflow = contentHeight - viewport;
      const thumbHeight = Math.max(
        MIN_THUMB_HEIGHT,
        usableTrack * Math.min(1, viewport / contentHeight),
      );

      geometry = {
        thumbHeight,
        travel: Math.max(0, usableTrack - thumbHeight),
        overflow: Math.max(1, overflow),
      };

      track.dataset.isScrollable = String(overflow > 1);
      thumb.style.height = `${thumbHeight}px`;
    };

    const render = () => {
      thumb.style.transform = `translateY(${
        (lenis.scroll / geometry.overflow) * geometry.travel
      }px)`;
    };

    const reveal = () => {
      track.dataset.isVisible = "true";
      window.clearTimeout(hideTimeout);
      hideTimeout = window.setTimeout(() => {
        if (!drag) track.dataset.isVisible = "false";
      }, HIDE_DELAY);
    };

    const handleScroll = () => {
      render();
      reveal();
    };

    const handleThumbPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      thumb.setPointerCapture(event.pointerId);
      drag = { pointerY: event.clientY, scroll: lenis.scroll };
      track.dataset.isVisible = "true";
      window.clearTimeout(hideTimeout);
    };

    const handleThumbPointerMove = (event: PointerEvent) => {
      if (!drag) return;
      const { travel, overflow } = geometry;
      if (travel === 0) return;
      const delta = ((event.clientY - drag.pointerY) / travel) * overflow;
      lenis.scrollTo(drag.scroll + delta, { immediate: true });
    };

    const handleThumbPointerUp = (event: PointerEvent) => {
      if (!drag) return;
      drag = null;
      thumb.releasePointerCapture(event.pointerId);
      reveal();
    };

    const handleTrackPointerDown = (event: PointerEvent) => {
      if (event.target === thumb) return;
      const { thumbHeight, travel, overflow } = geometry;
      if (travel === 0) return;
      const offset =
        event.clientY -
        track.getBoundingClientRect().top -
        THUMB_INSET -
        thumbHeight / 2;
      lenis.scrollTo(Math.min(1, Math.max(0, offset / travel)) * overflow);
    };

    const handleResize = () => {
      lenis.resize();
      measure();
      render();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(content);
    resizeObserver.observe(wrapper);

    lenis.on("scroll", handleScroll);
    thumb.addEventListener("pointerdown", handleThumbPointerDown);
    thumb.addEventListener("pointermove", handleThumbPointerMove);
    thumb.addEventListener("pointerup", handleThumbPointerUp);
    thumb.addEventListener("pointercancel", handleThumbPointerUp);
    track.addEventListener("pointerdown", handleTrackPointerDown);
    track.addEventListener("pointerenter", reveal);

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };
    animationFrame = requestAnimationFrame(raf);
    measure();
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(hideTimeout);
      resizeObserver.disconnect();
      thumb.removeEventListener("pointerdown", handleThumbPointerDown);
      thumb.removeEventListener("pointermove", handleThumbPointerMove);
      thumb.removeEventListener("pointerup", handleThumbPointerUp);
      thumb.removeEventListener("pointercancel", handleThumbPointerUp);
      track.removeEventListener("pointerdown", handleTrackPointerDown);
      track.removeEventListener("pointerenter", reveal);
      lenis.destroy();
    };
  });

  return (
    <>
      <main
        ref={wrapperRef}
        className={["lenis", className].filter(Boolean).join(" ")}
      >
        <div ref={contentRef} className={contentClassName}>
          {children}
        </div>
      </main>
      <div
        ref={trackRef}
        className={styles.track}
        data-is-visible="false"
        data-is-scrollable="false"
      >
        <div ref={thumbRef} className={styles.thumb} />
      </div>
    </>
  );
}

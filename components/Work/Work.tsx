import Link from "next/link";
import { Asset } from "@/components/Asset/Asset";
import { ProjectCursor } from "@/components/ProjectCursor/ProjectCursor";
import { ScrollContainer } from "@/components/ScrollContainer/ScrollContainer";
import type { Project } from "@/lib/content";
import styles from "./Work.module.css";

const COVER_SIZES =
  "(min-width: 1280px) 26vw, (min-width: 768px) 29vw, calc(100vw - 16px)";

export function Work({ projects }: { projects: Project[] }) {
  return (
    <>
      <ScrollContainer
        className={styles.scrollContainer}
        contentClassName={styles.contentContainer}
      >
        <ol className={styles.projectsContainer}>
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link
                className={styles.assetContainer}
                href={`/work/${project.slug}`}
                data-project-title={project.title}
              >
                <Asset
                  asset={project.cover}
                  alt={project.cover.alt ?? project.title}
                  className={styles.asset}
                  sizes={COVER_SIZES}
                  preload={index < 3}
                  loading="eager"
                />
              </Link>
            </li>
          ))}
        </ol>
      </ScrollContainer>
      <ProjectCursor />
    </>
  );
}

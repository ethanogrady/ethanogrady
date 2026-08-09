import Image from "next/image";
import Link from "next/link";
import { ScrollContainer } from "@/components/ScrollContainer/ScrollContainer";
import type { Project } from "@/lib/content";
import { ListPreview } from "./ListPreview";
import styles from "./WorkList.module.css";

export function WorkList({ projects }: { projects: Project[] }) {
  return (
    <ScrollContainer
      className={styles.scrollContainer}
      contentClassName={styles.contentContainer}
    >
      <ol className={styles.list}>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              className={styles.row}
              href={`/work/${project.slug}`}
              data-list-row
            >
              <span className={styles.title} data-list-title>
                {project.title}
              </span>
              <span className={styles.year} data-list-year>
                {project.year}
              </span>
              <Image
                className={styles.preview}
                src={project.cover.src}
                width={project.cover.width}
                height={project.cover.height}
                alt=""
                sizes="400px"
                placeholder={project.cover.lqip ? "blur" : "empty"}
                blurDataURL={project.cover.lqip ?? undefined}
                draggable={false}
                aria-hidden="true"
                data-list-preview
              />
            </Link>
          </li>
        ))}
      </ol>
      <ListPreview />
    </ScrollContainer>
  );
}

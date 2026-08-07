import { Asset } from "@/components/Asset/Asset";
import { ScrollContainer } from "@/components/ScrollContainer/ScrollContainer";
import { projects } from "@/lib/projects";
import styles from "./Info.module.css";

const PORTRAIT_SIZES = "(min-width: 768px) 42vw, calc(100vw - 16px)";

const portrait =
  projects.find((project) => project.slug === "studio-n-and-tl")?.assets[1] ??
  projects[0].cover;

const clients = Array.from(
  new Set(projects.map((project) => project.title.split(/ [–@] /)[0].trim())),
).sort();

export function Info() {
  return (
    <ScrollContainer
      className={styles.scrollContainer}
      contentClassName={styles.contentContainer}
    >
      <p className={styles.statement}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

      <div className={styles.plate}>
        <Asset asset={portrait} sizes={PORTRAIT_SIZES} preload />
      </div>

      <div className={styles.notes}>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
          omnis iste natus error sit voluptatem accusantium doloremque
          laudantium.
        </p>
      </div>

      <div className={styles.colophon}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Contact</span>
          <div className={styles.fieldList}>
            <a className={styles.contactLink} href="mailto:eogrady123@gmail.com">
              eogrady123@gmail.com
            </a>
            <a
              className={styles.contactLink}
              href="https://www.instagram.com/ethan__ogrady/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className={styles.contactLink}
              href="https://www.linkedin.com/in/ethan-ogrady/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Based in</span>
          <div className={styles.fieldList}>
            <span>New York</span>
            <span>Available worldwide</span>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Selected clients</span>
          <ul className={styles.clients}>
            {clients.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollContainer>
  );
}

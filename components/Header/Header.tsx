import Link from "next/link";
import { getSettings } from "@/lib/content";
import styles from "./Header.module.css";

export async function Header() {
  const { wordmark } = await getSettings();

  return (
    <header className={styles.container}>
      <nav className={styles.navContainer}>
        <Link className={`${styles.link} ${styles.wordmark}`} href="/">
          <span className={styles.linkText}>{wordmark}</span>
        </Link>
        <div className={styles.navLinks}>
          <Link className={styles.link} href="/">
            <span className={styles.linkText}>Grid</span>
          </Link>
          <Link className={styles.link} href="/list">
            <span className={styles.linkText}>List</span>
          </Link>
          <Link className={styles.link} href="/info">
            <span className={styles.linkText}>Info</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

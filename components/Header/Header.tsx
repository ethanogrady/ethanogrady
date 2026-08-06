import Link from "next/link";
import styles from "./Header.module.css";

const wordmark = "Ethan O’Grady";

export function Header() {
  return (
    <header className={styles.container}>
      <nav className={styles.navContainer}>
        <Link className={styles.link} href="/">
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

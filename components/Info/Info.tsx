import { Asset } from "@/components/Asset/Asset";
import { ScrollContainer } from "@/components/ScrollContainer/ScrollContainer";
import type { SiteSettings } from "@/lib/content";
import styles from "./Info.module.css";

const PORTRAIT_SIZES = "(min-width: 768px) 42vw, calc(100vw - 16px)";

export function Info({ settings }: { settings: SiteSettings }) {
  return (
    <ScrollContainer
      className={styles.scrollContainer}
      contentClassName={styles.contentContainer}
    >
      {settings.statement ? (
        <p className={styles.statement}>{settings.statement}</p>
      ) : null}

      {settings.portrait ? (
        <div className={styles.plate}>
          <Asset asset={settings.portrait} sizes={PORTRAIT_SIZES} preload />
        </div>
      ) : null}

      {settings.notes.length > 0 ? (
        <div className={styles.notes}>
          {settings.notes.map((note) => (
            <p key={note.slice(0, 40)}>{note}</p>
          ))}
        </div>
      ) : null}

      <div className={styles.colophon}>
        {settings.email || settings.socials.length > 0 ? (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Contact</span>
            <div className={styles.fieldList}>
              {settings.email ? (
                <a
                  className={styles.contactLink}
                  href={`mailto:${settings.email}`}
                >
                  {settings.email}
                </a>
              ) : null}
              {settings.socials.map((social) => (
                <a
                  key={social.url}
                  className={styles.contactLink}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {settings.basedIn.length > 0 ? (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Based in</span>
            <div className={styles.fieldList}>
              {settings.basedIn.map((place) => (
                <span key={place}>{place}</span>
              ))}
            </div>
          </div>
        ) : null}

        {settings.clients.length > 0 ? (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Selected clients</span>
            <p className={styles.clients}>
              {settings.clients.map((client) => (
                <span key={client}>{client}</span>
              ))}
            </p>
          </div>
        ) : null}
      </div>
    </ScrollContainer>
  );
}

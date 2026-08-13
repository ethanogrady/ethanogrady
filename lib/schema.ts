import type { Project, SiteSettings } from "@/lib/content";
import { absoluteUrl, SITE_URL } from "@/lib/site";

const PERSON_ID = `${SITE_URL}/#person`;

export function personSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: settings.wordmark,
    url: SITE_URL,
    jobTitle: "Photographer",
    description: settings.description ?? undefined,
    image: absoluteUrl("/opengraph-image.png"),
    email: settings.email ? `mailto:${settings.email}` : undefined,
    address: settings.basedIn.length
      ? { "@type": "PostalAddress", addressLocality: settings.basedIn[0] }
      : undefined,
    sameAs: settings.socials.map((social) => social.url),
  };
}

export function websiteSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: settings.wordmark,
    description: settings.description ?? undefined,
    publisher: { "@id": PERSON_ID },
  };
}

export function projectSchema(project: Project, settings: SiteSettings) {
  const url = absoluteUrl(`/work/${project.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${url}#gallery`,
    url,
    name: project.title,
    creator: { "@id": PERSON_ID },
    copyrightHolder: { "@id": PERSON_ID },
    datePublished: project.year ? String(project.year) : undefined,
    dateModified: project.updatedAt,
    thumbnailUrl: project.cover.src,
    numberOfItems: project.assets.length,
    associatedMedia: project.assets.map((asset, index) => ({
      "@type": "ImageObject",
      contentUrl: asset.src,
      width: asset.width,
      height: asset.height,
      caption: asset.alt ?? `${project.title}, image ${index + 1}`,
      creator: { "@id": PERSON_ID },
    })),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en",
    author: { "@type": "Person", name: settings.wordmark },
  };
}

export function breadcrumbSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Work", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: project.title,
        item: absoluteUrl(`/work/${project.slug}`),
      },
    ],
  };
}

export function workListSchema(projects: Project[], settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/list")}#list`,
    url: absoluteUrl("/list"),
    name: "Index of work",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": PERSON_ID },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: absoluteUrl(`/work/${project.slug}`),
      })),
    },
    creator: { "@type": "Person", name: settings.wordmark },
  };
}

import { cache } from "react";
import { client } from "@/sanity/lib/client";

export type Asset = {
  src: string;
  width: number;
  height: number;
  lqip: string | null;
};

export type Project = {
  slug: string;
  title: string;
  year: number | null;
  cover: Asset;
  assets: Asset[];
};

export type Social = {
  label: string;
  url: string;
};

export type SiteSettings = {
  wordmark: string;
  description: string | null;
  statement: string | null;
  notes: string[];
  portrait: Asset | null;
  basedIn: string[];
  email: string | null;
  socials: Social[];
};

const ASSET_FIELDS = `
  "src": url,
  "width": metadata.dimensions.width,
  "height": metadata.dimensions.height,
  "lqip": metadata.lqip
`;

const PROJECT_FIELDS = `
  "slug": slug.current,
  title,
  year,
  "cover": cover.asset->{ ${ASSET_FIELDS} },
  "assets": images[defined(asset)].asset->{ ${ASSET_FIELDS} }
`;

const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current) && defined(cover.asset)] | order(orderRank) { ${PROJECT_FIELDS} }`;

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  wordmark,
  description,
  statement,
  "notes": coalesce(notes, []),
  "portrait": portrait.asset->{ ${ASSET_FIELDS} },
  "basedIn": coalesce(basedIn, []),
  email,
  "socials": coalesce(socials[]{ label, url }, [])
}`;

const FALLBACK_SETTINGS: SiteSettings = {
  wordmark: "Ethan O’Grady",
  description: null,
  statement: null,
  notes: [],
  portrait: null,
  basedIn: [],
  email: null,
  socials: [],
};

export const getProjects = cache(async (): Promise<Project[]> => {
  const projects = await client.fetch<Project[]>(PROJECTS_QUERY);
  return projects.filter((project) => project.assets.length > 0);
});

export const getProject = cache(
  async (slug: string): Promise<Project | undefined> => {
    const projects = await getProjects();
    return projects.find((project) => project.slug === slug);
  },
);

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await client.fetch<SiteSettings | null>(SETTINGS_QUERY);
  return settings ?? FALLBACK_SETTINGS;
});

import type { MetadataRoute } from "next";
import { getProjects, getSettingsUpdatedAt } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, settingsUpdatedAt] = await Promise.all([
    getProjects(),
    getSettingsUpdatedAt(),
  ]);

  const newestProject = projects
    .map((project) => project.updatedAt)
    .sort()
    .at(-1);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: newestProject,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/list"),
      lastModified: newestProject,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/info"),
      lastModified: settingsUpdatedAt,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: project.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

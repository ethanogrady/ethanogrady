import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const existing = await client.fetch(`*[_id == "siteSettings"][0].clients`);
if (existing?.length) {
  console.log(`siteSettings.clients already set (${existing.length}), leaving it alone`);
  process.exit(0);
}

const titles = await client.fetch(`*[_type == "project"] | order(orderRank).title`);
const clients = [
  ...new Set(titles.map((title) => title.split(/ [–@] /)[0].trim())),
].sort();

await client.patch("siteSettings").set({ clients }).commit();
console.log(`seeded ${clients.length} clients:`);
console.log(clients.join(", "));

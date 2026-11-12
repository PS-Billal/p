import { projects } from "../data/portfolio";
export const dynamic = "force-static";
export default function sitemap() {
  return [
    { url: "https://billalyasir.com", changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `https://billalyasir.com/projects/${p.slug}/`,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}

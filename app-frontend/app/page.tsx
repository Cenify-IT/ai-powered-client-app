import { getDomain } from "./lib/domains";
import BlockRenderer from "./lib/pageRenderer";

export default async function Home() {
  const domain = await getDomain();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/website?domain=${domain}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return <div>Failed to load site</div>;
  }

  const website = await res.json();

  const page = website.pages.find((p: any) => p.title === "Home");

  if (!page) return <div>Page not found</div>;

  return <BlockRenderer sections={page.sections} />;
}

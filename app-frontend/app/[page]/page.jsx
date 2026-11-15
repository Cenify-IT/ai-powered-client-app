import { getDomain } from "../lib/domains";
import BlockRenderer from "../lib/pageRenderer";

export default async function Page({ params }) {
  const domain = await getDomain();
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/website?domain=${domain}`, {
    next: { revalidate: 60 },
  });

  console.log("Response from API:", res);

  const website = await res.json();

  console.log("Website data:", website);

  const page = website.pages.find((p) => p.slug === slug);

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <BlockRenderer
      sections={page.sections}
      domain={domain}
      client={website.client}
    />
  );
}

import { getDomain } from "../lib/domains";
import BlockRenderer from "../lib/pageRenderer";

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const domain = await getDomain();
  const { page: slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/website?domain=${domain}`, {
    next: { revalidate: 60 },
  });

  const website = await res.json();

  const page = website.pages.find((p: any) => p.slug === slug);

  if (!page) {
    return <div>Page not found</div>;
  }

  return <BlockRenderer sections={page.sections} domain={domain} />;
}

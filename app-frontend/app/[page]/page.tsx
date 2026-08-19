import { getDomain } from "../lib/domains";
import BlockRenderer from "../lib/pageRenderer";

export default async function Page({ params }: { params: { page: string } }) {
  const domain = await getDomain();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/website?domain=${domain}`, {
    next: { revalidate: 60 },
  });

  const website = await res.json();
  const resolvedParams = await params;

  console.log(resolvedParams);

  const slug = resolvedParams.page;
  const categegory = null;

  console.log("Slug is", slug);

  const page = website.pages.find((p: any) => p.slug === slug);
  console.log("Page is", page);

  if (!page) {
    return <div>Page not found</div>;
  }

  return <BlockRenderer sections={page.sections} />;
}

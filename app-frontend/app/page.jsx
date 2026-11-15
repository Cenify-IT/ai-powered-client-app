import { getDomain } from "./lib/domains";
import BlockRenderer from "./lib/pageRenderer";

export default async function Page({ params }) {
  const domain = await getDomain();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/website?domain=${domain}`, {
    next: { revalidate: 0 },
  });

  console.log("Response from API:", res);

  if (!res.ok) {
    return <div>Failed to load site</div>;
  }

  const website = await res.json();

  console.log("Website data:", website);

  const client = website.client;

  console.log("Client is", client);

  if (!client || !client.isActive) {
    return <div>Client is not active</div>;
  }

  const page = website.pages.find((p) => p.title === "Home");

  if (!page) return <div>Page not found</div>;

  return (
    <BlockRenderer sections={page.sections} domain={domain} client={client} />
  );
}

import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req) {
  const { domain } = await req.json();

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  // Get website

  const query = `websites?filters[domain][$eq]=${domain}&[fields][0]=documentId&fields[1]=visitorCount`;

  const res = await fetch(`${API_URL}/api/${query}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const websiteData = await res.json();
  const website = websiteData.data?.[0];

  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  // Get current visitor count
  const currentVisitorCount = website.visitorCount?.total || 0;

  // Increment visitor count
  const updateVisitorReq = await fetch(
    `${API_URL}/api/websites/${website.documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          visitorCount: currentVisitorCount + 1,
        },
      }),
    },
  );

  const updateVisitorRes = await updateVisitorReq.json();

  if (!updateVisitorReq.ok) {
    console.error("Failed to update visitor count:", updateVisitorRes);

    return NextResponse.json(
      { error: "Failed to update visitor count" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      visitorCount: currentVisitorCount + 1,
    },
    { status: 200 },
  );
}

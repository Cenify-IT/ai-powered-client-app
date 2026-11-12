import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req) {
  const { domain, formSubmissionData } = await req.json();

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  // Get website

  const query = `websites?filters[domain][$eq]=${domain}&[fields][0]=documentId`;

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

  // Increment visitor count
  const postFormSubmissionReq = await fetch(`${API_URL}/api/form-submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        data: formSubmissionData,
        website: website.documentId,
      },
    }),
  });

  const formSubmissionRes = await postFormSubmissionReq.json();

  if (!postFormSubmissionReq.ok) {
    console.error("Failed to post form submission", formSubmissionRes);

    return NextResponse.json(
      { error: "Failed to post form submission" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
    },
    { status: 200 },
  );
}

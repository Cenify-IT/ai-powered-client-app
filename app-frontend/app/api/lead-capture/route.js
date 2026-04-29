import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req) {
  const { data, domain, sessionId } = await req.json();
  const { name, phone, email_address, address, source, zip } = data;

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const query = `websites?filters[domain][$eq]=${domain}&[fields][0]=documentId`;

  const res = await fetch(`${API_URL}/api/${query}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const websiteData = await res.json();

  const website = websiteData.data[0];

  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  // Check if lead from same session already exists
  const existingLeadsRes = await fetch(
    `${API_URL}/api/leads?filters[sessionId][$eq]=${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    },
  );

  const existingLeads = await existingLeadsRes.json();

  if (existingLeads.data.length > 0) {
    const existingLead = existingLeads.data[0];

    // Only update fields that are actually provided
    const updatedFields = Object.fromEntries(
      Object.entries({
        name,
        phoneNumber: phone,
        address,
        zipCode: zip,
        email: email_address,
        source,
      }).filter(([_, v]) => v != null && v !== ""),
    );

    const updateReq = await fetch(
      `${API_URL}/api/leads/${existingLead.documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ data: updatedFields }),
      },
    );

    const updateRes = await updateReq.json();

    if (!updateReq.ok) {
      console.error("Failed to update lead:", updateRes);
      return NextResponse.json(
        { error: "Failed to update lead" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: "Lead updated successfully" },
      { status: 200 },
    );
  }

  const leadReq = await fetch(`${API_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        name,
        sessionId,
        phoneNumber: phone,
        address,
        zipCode: zip,
        leadStatus: "new",
        source,
        email: email_address,
        website: website.documentId,
      },
    }),
  });

  const leadRes = await leadReq.json();

  if (!leadReq.ok) {
    console.error("Failed to create lead:", leadRes);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: "Lead created successfully" },
    { status: 200 },
  );
}

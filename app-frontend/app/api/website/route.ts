import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const query = `websites?filters[domain][$eq]=${domain}&populate[pages][populate][sections][populate]=*&populate[layout][populate]=*&populate[chatbot][populate][chatbot_intents]=*`;

  const res = await fetch(`${API_URL}/api/${query}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  console.log(res);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from Strapi" },
      { status: 500 },
    );
  }

  const data = await res.json();

  console.log(data);

  return NextResponse.json(data.data[0]);
}

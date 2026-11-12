import { NextResponse } from "next/server";
import { STRAPI_API_URL } from "../../config";
import { cookies } from "next/headers";

export async function POST(request) {
  const { domain, leadId } = await request.json();
  const cookieStore = await cookies(); // <-- Call this synchronously at the top

  let token = null;
  token = cookieStore.get("token")?.value;
  console.log("Token from cookies:", token);
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      console.log("No token found in cookies or authorization header");
      return NextResponse.json({
        message: "Not authenticated",
        statusCode: 401,
        user: null,
        client: null,
      });
    }
  }

  if (request.method === "POST") {
    // Check domain against the token to ensure the user is authorized to access this domain
    const strapiRes = await fetch(`${NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!strapiRes.ok) {
      console.error(
        "Error fetching user data from Strapi:",
        strapiRes.statusText,
      );
      return NextResponse.json({
        message: "Something went wrong " + strapiRes.message,
        statusCode: 500,
        user: null,
        client: null,
      });
    }
    console.log("User data fetched successfully from Strapi");

    const user = await strapiRes.json();

    const clientRes = await fetch(
      `${NEXT_PUBLIC_STRAPI_URL}/api/clients?filters[users][documentId]=${user.documentId}&populate=website`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!clientRes.ok) {
      console.log(
        "Error fetching client data from Strapi:",
        clientRes.statusText,
      );
      return NextResponse.json({
        message: "Something went wrong while fetching client details",
        statusCode: 500,
        user: null,
        client: null,
      });
    }

    const clientData = await clientRes.json();
    const client = clientData.data?.[0];
    const website = client?.website?.[0];

    console.log("Website data:", website);
  } else {
    return NextResponse.json({
      status: 405,
      message: "Method not allowed...",
    });
  }
}

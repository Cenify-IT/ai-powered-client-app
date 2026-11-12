import { NextResponse } from "next/server";
import { NEXT_PUBLIC_STRAPI_URL } from "../../../config";
import { cookies } from "next/headers";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(request) {
  console.log("GET /api/user/me called");

  const cookieStore = await cookies();
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

  const strapiRes = await fetch(
    // `${NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=client`,
    `${NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

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
  //Get client details

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

  const client = await clientRes.json().then((data) => data.data[0] || null);
  console.log("User data retrieved successfully:", user);
  console.log("Client data retrieved successfully:", client);

  return NextResponse.json({
    message: "User data retrieved successfully",
    statusCode: 200,
    user: user,
    client: client,
  });
}

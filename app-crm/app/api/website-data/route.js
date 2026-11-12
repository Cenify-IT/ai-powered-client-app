import { NextResponse } from "next/server";
import { NEXT_PUBLIC_STRAPI_URL } from "../../config";
import { cookies } from "next/headers";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(request) {
  console.log("GET /api/website-data called");
  const cookieStore = await cookies();
  let token = null;
  token = cookieStore.get("token")?.value;
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      console.log("No token found in cookies or authorization header");
      return NextResponse.json({
        message: "Not authenticated",
        statusCode: 401,
        websiteData: null,
        chatbotConversationsData: null,
        leadsData: null,
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
      websiteData: null,
      chatbotConversationsData: null,
      leadsData: null,
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
      websiteData: null,
      chatbotConversationsData: null,
      leadsData: null,
    });
  }

  const client = await clientRes.json().then((data) => data.data[0] || null);
  console.log("Client data:", client);

  const websiteDataRes = await fetch(
    `${NEXT_PUBLIC_STRAPI_URL}/api/websites?filters[client][documentId]=${client.documentId}&populate[chatbot][fields][0]=documentId&populate[form_submissions][fields][0]=createdAt&populate[form_submissions][fields][1]=data`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!websiteDataRes.ok) {
    console.log(
      "Error fetching website data from Strapi:",
      websiteDataRes.statusText,
    );
    return NextResponse.json({
      message: "Something went wrong while fetching website data",
      statusCode: 500,
      websiteData: null,
      chatbotConversationsData: null,
      leadsData: null,
    });
  }

  const websiteData = await websiteDataRes.json();

  console.log("Website data:", websiteData);

  const chatbotId = websiteData.data[0]?.chatbot.documentId;
  console.log("Chatbot ID:", chatbotId);

  // Fetch chatbot conversations
  const conversationsRes = await fetch(
    `${NEXT_PUBLIC_STRAPI_URL}/api/conversations?filters[chatbot][documentId]=${chatbotId}&populate[lead][populate][chatbot_intent][fields][0]=name`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!conversationsRes.ok) {
    console.log(
      "Error fetching chatbot conversations from Strapi:",
      conversationsRes.statusText,
    );
    return NextResponse.json({
      message: "Something went wrong while fetching chatbot conversations",
      statusCode: 500,
      websiteData: null,
      chatbotConversationsData: null,
      leadsData: null,
    });
  }

  const conversationData = await conversationsRes.json();
  console.log("Conversation data:", conversationData);

  const leadsData = conversationData.data
    .map((conversation) => conversation.lead)
    .filter(Boolean);

  console.log("Leads data:", leadsData);

  return NextResponse.json({
    message: "Website data retrieved successfully",
    statusCode: 200,
    websiteData: websiteData,
    chatbotConversationsData: conversationData,
    leadsData: leadsData,
  });
}

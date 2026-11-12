import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req) {
  const { data, domain, sessionId } = await req.json();

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

  const chatbotReq = await fetch(
    `${API_URL}/api/websites?filters[domain][$eq]=${domain}&populate[chatbot][fields][0]=documentId`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    },
  );

  const chatbotRes = await chatbotReq.json();

  console.log("Chatbot Res", chatbotRes);

  const chatbot = chatbotRes.data[0].chatbot;

  // Check if conversation from same session already exists
  const conversationExistsReq = await fetch(
    `${API_URL}/api/conversations?filters[sessionId][$eq]=${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    },
  );

  const existingConversationRes = await conversationExistsReq.json();

  // If Conversation Exists, update messages
  if (existingConversationRes.data.length > 0) {
    const conversation = existingConversationRes.data[0];

    const updateReq = await fetch(
      `${API_URL}/api/conversations/${conversation.documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            messages: data,
          },
        }),
      },
    );

    const updateRes = await updateReq.json();

    if (!updateReq.ok) {
      console.error("Failed to update Conversation:", updateRes);
      return NextResponse.json(
        { error: "Failed to update Conversation" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: "Conversation updated successfully" },
      { status: 200 },
    );
  }

  const createConversationReq = await fetch(`${API_URL}/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        chatbot: chatbot.documentId,
        sessionId: sessionId,
        messages: data,
      },
    }),
  });

  const conversationCreatedRes = await createConversationReq.json();

  if (!createConversationReq.ok) {
    console.error("Failed to create Conversation:", conversationCreatedRes);
    return NextResponse.json(
      { error: "Failed to create Conversation" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: "Conversation created successfully" },
    { status: 200 },
  );
}

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// simple in-memory store per phone number for MVP
const conversations = new Map();

// emergency keywords
const emergencyKeywords = [
  "burst",
  "flood",
  "water everywhere",
  "pipe broke",
  "leak",
];

// Twilio phone number (from env)
const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// escape XML to prevent Twilio errors
function escapeXML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// list of fields we need to collect
const REQUIRED_FIELDS = ["name", "phone", "address", "zip"];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userMessage = formData.get("Body")?.trim();
    const from = formData.get("From");

    if (!userMessage || !from) {
      return new Response(
        `<?xml version="1.0"?>
<Response>
  <Message>Invalid request.</Message>
</Response>`,
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    console.log("Incoming SMS:", from, userMessage);

    // Handle STOP / opt-out
    if (userMessage.toUpperCase() === "STOP") {
      conversations.delete(from);
      return new Response(
        `<?xml version="1.0"?>
<Response>
  <Message>You have been unsubscribed. Reply START to resubscribe.</Message>
</Response>`,
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    // Emergency detection
    const isEmergency = emergencyKeywords.some((word) =>
      userMessage.toLowerCase().includes(word),
    );
    if (isEmergency) {
      return new Response(
        `<?xml version="1.0"?>
<Response>
  <Message>Turn off your main water valve immediately! We'll send a technician ASAP.</Message>
</Response>`,
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    // Initialize conversation if new
    if (!conversations.has(from)) {
      conversations.set(from, {
        history: [],
        fields: {
          name: null,
          phone: null,
          address: null,
          zip: null,
        },
      });
    }

    const conversation = conversations.get(from);

    // 1️⃣ Add user message to history
    conversation.history.push({ role: "user", content: userMessage });

    // 2️⃣ Try to extract some fields from the user's message (basic regex)
    if (!conversation.fields.phone) {
      const phoneMatch = userMessage.match(/\b\d{10}\b/); // naive 10-digit US number
      if (phoneMatch) conversation.fields.phone = phoneMatch[0];
    }
    if (!conversation.fields.zip) {
      const zipMatch = userMessage.match(/\b\d{5}\b/);
      if (zipMatch) conversation.fields.zip = zipMatch[0];
    }
    // Name and address could also be extracted via AI later

    // 3️⃣ Determine which fields are still missing
    const missingFields = REQUIRED_FIELDS.filter(
      (f) => !conversation.fields[f],
    );

    // 4️⃣ Build system prompt dynamically
    let systemPrompt = `
You are Joe, a Boston plumber. You text like a real human: short, direct, sometimes a little gruff but polite. 
Your job: collect all missing customer info, detect emergencies, and move toward scheduling a service call. 
Only ask for the info that is missing. Never give price quotes. Never sound like a bot or AI.
`;

    if (missingFields.length > 0) {
      systemPrompt += `\nMissing info to collect: ${missingFields.join(", ")}. Ask only for these.`;
    } else {
      systemPrompt += `\nAll required info collected: name, phone, address, zip. Proceed to confirm service scheduling or follow-up.`;
    }

    // 5️⃣ Send conversation + system prompt to AI
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        ...conversation.history,
      ],
    });

    // 6️⃣ Assemble AI reply
    let aiReply = "";
    for await (const chunk of result.textStream) {
      aiReply += chunk;
    }

    // 7️⃣ Save AI reply to history
    conversation.history.push({ role: "assistant", content: aiReply });

    // 8️⃣ Trim history to last 10 messages
    if (conversation.history.length > 10) {
      conversation.history.splice(0, conversation.history.length - 10);
    }

    // 9️⃣ Return TwiML response
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXML(aiReply)}</Message>
</Response>`,
      { headers: { "Content-Type": "text/xml" } },
    );
  } catch (error) {
    console.error("SMS webhook error:", error);

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, something went wrong. A human will follow up shortly.</Message>
</Response>`,
      { headers: { "Content-Type": "text/xml" } },
    );
  }
}

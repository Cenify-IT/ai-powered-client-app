import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const detectIntent = (message, intents) => {
  const lower = message.toLowerCase();

  return intents
    .sort((a, b) => b.priority - a.priority)
    .find((intent) =>
      intent.keywords?.some((k) => lower.includes(k.toLowerCase())),
    );
};

const detectIntentWithAI = async (messages, intents) => {
  const intentList = intents.map((i) => ({
    name: i.name,
    description: i.description,
    priority: i.priority,
    examples: i.keywords, // repurpose keywords as examples, not strict matchers
  }));

  const recentMessages = [...messages]
    .slice(-6) // last 3 turns
    .map((m) => `${m.role}: ${getMessageText(m)}`)
    .join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 50,
      messages: [
        {
          role: "system",
          content: `You are an intent classifier for a plumbing company chatbot.
Given a conversation, return ONLY a raw JSON object (no markdown, no explanation) like:
{ "intent": "<intent_name>" } or { "intent": null }

Available intents:
${JSON.stringify(intentList, null, 2)}

Match based on meaning, not exact keywords. Handle typos and synonyms.`,
        },
        {
          role: "user",
          content: recentMessages,
        },
      ],
    }),
  });

  const data = await res.json();

  try {
    const parsed = JSON.parse(data.choices[0].message.content.trim());
    console.log("AI intent detection result:", parsed);
    return intents.find((i) => i.name === parsed.intent) || null;
  } catch {
    return null; // graceful fallback
  }
};

const extractLeadData = async (messages, matchedIntent) => {
  const recentMessages = [...messages]
    .slice(-10)
    .map((m) => `${m.role}: ${getMessageText(m)}`)
    .join("\n");

  const fields = {
    name: matchedIntent.requireName,
    phone: matchedIntent.requirePhone,
    email: matchedIntent.requireEmail,
    zip: matchedIntent.requireZipCode,
    address: matchedIntent.requireAddress,
  };

  const requiredFields = Object.entries(fields)
    .filter(([_, required]) => required)
    .map(([field]) => field);

  console.log("Extracting lead data with required fields:", requiredFields);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 100,
      messages: [
        {
          role: "system",
          content: `You are a data extractor. Extract contact information from the conversation.
Return ONLY a raw JSON object with these fields: ${requiredFields.join(", ")}.
If a field is not found or it seems to be incomplete, like an incomplete phone number, or an invalid email format, or an incomplete address, set it to null.

if an address is provided, try to parse out the zip code from the address and return it in the zip field. If you can't find a zip code, set zip to null.
If the field is not explicitly mentioned but you can infer it with high confidence, you can fill it in, except for zip code! This is important to be certain of, so if they don't give a complete address where the zip code is certain, and zip code is a required field, do not fill it in. For example, if they say "My name is John and you can reach me at 617-555-1234", you can infer the phone number even if it's not in a standard format. But if the information is ambiguous or incomplete, it's better to return null than to guess.
No markdown, no explanation. Example: { "name": "John", "phone": "617-555-1234", "email": null, "address": null, "zip": "02115" }`,
        },
        { role: "user", content: recentMessages },
      ],
    }),
  });

  const data = await res.json();

  try {
    return JSON.parse(data.choices[0].message.content.trim());
  } catch {
    return null;
  }
};

const getMessageText = (message) => {
  return (
    message.parts
      ?.filter((p) => p.type === "text")
      ?.map((p) => p.text)
      ?.join(" ") || ""
  );
};

const getRecentUserText = (messages, turns = 3) => {
  return [...messages]
    .filter((m) => m.role === "user")
    .slice(-turns)
    .map(getMessageText)
    .join(" ");
};

export async function POST(req) {
  const { messages, domain, sessionId } = await req.json();

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const NEXT_FRONTEND_URL = `http://${domain}:3000`;
  const API_TOKEN = process.env.STRAPI_API_TOKEN;

  const query = `websites?filters[domain][$eq]=${domain}&populate[chatbot][populate][chatbot_intents]=*`;
  let captureLead = false;
  let captureRules = "";

  const chatbotReq = await fetch(`${API_URL}/api/${query}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const chatbotRes = await chatbotReq.json();

  const chatbot = chatbotRes.data[0].chatbot;

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  // const userText = getMessageText(lastUserMessage);
  const userText = getRecentUserText(messages);

  // const matchedIntent = detectIntent(userText, chatbot.chatbot_intents);

  const FINAL_WARNING =
    "You're wasting my time...if you don't cut the bullshit and tell me what you need, I'm ending this conversation.";
  const hasSentFinalWarning = messages.some(
    (m) =>
      m.role === "assistant" && getMessageText(m).includes("[FINAL_WARNING]"),
  );
  const matchedIntent =
    (await detectIntentWithAI(messages, chatbot.chatbot_intents)) ??
    detectIntent(userText, chatbot.chatbot_intents);

  if (matchedIntent?.name === "Stop Engaging") {
    if (!hasSentFinalWarning) {
      const warningPrompt = `
You are a no-nonsense plumber from Boston.

The user is wasting time or asking irrelevant questions.

Respond with ONE short message:
- Slightly annoyed but still professional
- Redirect them back to plumbing help
- Do NOT ask multiple questions
- Do NOT be overly polite
- Keep it under 20 words
- End the conversation naturally

Prefix your response with ${FINAL_WARNING} to indicate this is the final warning. If they continue to waste time after this, you will end the conversation and not respond anymore.
`;

      const result = await streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          { role: "system", content: warningPrompt },
          ...(await convertToModelMessages(messages)),
        ],
      });

      return result.toUIMessageStreamResponse();
    }

    return new Response(null, { status: 204 });
  }
  if (matchedIntent?.priority >= 70) {
    captureLead = true;
    console.log("Lead capture triggered by intent:", matchedIntent.name);

    const leadData = await extractLeadData(messages, matchedIntent);
    console.log("Extracted lead data:", leadData);

    // Only save if we have at least one piece of contact info
    // const hasData = leadData && Object.values(leadData).some(Boolean);
    const hasData = leadData && (leadData.phone || leadData.email);

    if (hasData) {
      console.log("Saving lead data to Strapi..." + JSON.stringify(leadData));
      const leadCaptureReq = await fetch(
        `${NEXT_FRONTEND_URL}/api/lead-capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              ...leadData,
              source: "website_chatbot",
            },
            domain,
            sessionId,
          }),
        },
      );
    }
  }

  if (captureLead) {
    captureRules = `
    You should attempt to capture the customer's contact information.

    Required fields:
    Phone: ${matchedIntent.requirePhone}
    Name: ${matchedIntent.requireName}
    Email: ${matchedIntent.requireEmail}
    Address: ${matchedIntent.requireAddress}
    Zip Code: ${matchedIntent.requireZipCode}

    If the intent has a required field but you can't find it in the conversation, you should keep trying to get it. Do not return partial or incomplete data. If you are not sure about a piece of information, return null for that field and keep trying to get it in future turns.
`;
  }

  const dynamicSystemPrompt = `
      You are an AI dispatcher for a plumbing company.

      Tone: ${chatbot.tone}

      Tone of Voice: ${chatbot.customToneOfVoice ? chatbot.customToneOfVoice : "Default, based on the selected tone"}

      Rules: ${chatbot.rules ? chatbot.rules : "Default, based on the selected tone"}

      Current detected intent:
      ${
        matchedIntent
          ? `
      Intent Name: ${matchedIntent.name}
      Description: ${matchedIntent.description}
      Response Mode: ${matchedIntent.responseMode}
      CTA Type: ${matchedIntent.ctaType}
      Requires Phone: ${matchedIntent.requirePhone ? "YES" : "NO"}
      `
          : "No specific intent detected"
      }

      If an intent is detected, prioritize it over general conversation.
      If Phone is required, make it a priority to get their phone number!
      ${captureRules}

      ${chatbot.customAdditionalPromptRules ? `Additional Instructions: ${chatbot.customAdditionalPromptRules}` : ""}
`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      { role: "system", content: dynamicSystemPrompt },
      ...(await convertToModelMessages(messages)),
    ],
  });

  return result.toUIMessageStreamResponse();
}

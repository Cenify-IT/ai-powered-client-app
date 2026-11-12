import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";

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

const detectIntentWithAI = async (messages, intents, context) => {
  const intentList = intents.map((i) => ({
    name: i.name,
    description: i.description,
    priority: i.priority,
    examples: i.keywords, // repurpose keywords as examples, not strict matchers
    id: i.documentId, // include documentId for reference
  }));

  console.log("Intent list for AI detection:", intentList);

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
          content: `${context}. You Need to Classify the user's intent based on the conversation. Return a JSON object with the intent name or null if no intent is detected.
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

  // const requiredFields = Object.entries(fields)
  //   .filter(([_, required]) => required)
  //   .map(([field]) => field);

  const requiredFields = Object.keys(fields).filter(
    (field) => fields[field] === true,
  );

  const optionalFields = Object.keys(fields).filter(
    (field) => fields[field] !== true,
  );
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
If a required field is not found or is incomplete, set it to null.
The other fields, which are ${optionalFields.join(", ")}, are optional.
If any of them is provided, add it to the JSON object as well.
If an address is provided, try to parse out the zip code from the address and return it in the zip field. If you can't find a zip code, set zip to null.
If a field is not explicitly mentioned but you can infer it with high confidence, you can fill it in, except for zip code. Do not guess a zip code. 
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

  console.log("Session ID:", sessionId);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const NEXT_FRONTEND_URL = `http://${domain}:3000`;
  const API_TOKEN = process.env.STRAPI_API_TOKEN;

  const query = `websites?filters[domain][$eq]=${domain}&populate[chatbot][populate][chatbot_intents]=*`;
  let captureLead = false;
  let captureRules = "";

  let bookingLocationVerified = false;

  //   const extractServiceLocation = async (messages) => {
  //     const recentMessages = [...messages]
  //       .slice(-12)
  //       .map((m) => `${m.role}: ${getMessageText(m)}`)
  //       .join("\n");

  //     const res = await fetch("https://api.openai.com/v1/chat/completions", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //       },
  //       body: JSON.stringify({
  //         model: "gpt-4o-mini",
  //         temperature: 0,
  //         max_tokens: 150,
  //         messages: [
  //           {
  //             role: "system",
  //             content: `
  // Extract the customer's service location from the conversation.

  // Return ONLY a raw JSON object:
  // {
  //   "city": string | null,
  //   "state": string | null,
  //   "country": string | null,
  //   "postalCode": string | null,
  //   "address": string | null,
  //   "isLocationProvided": boolean
  // }

  // Use only information explicitly provided by the customer.
  // Do not infer or guess a location from the business's location.
  // A city with a state or country is sufficient for a preliminary location check.
  // A postal code or full address is also sufficient.
  // If the location is ambiguous or incomplete, set isLocationProvided to false.
  // `,
  //           },
  //           {
  //             role: "user",
  //             content: recentMessages,
  //           },
  //         ],
  //       }),
  //     });

  //     if (!res.ok) {
  //       throw new Error("Location extraction failed.");
  //     }

  //     const data = await res.json();

  //     try {
  //       return JSON.parse(data.choices[0].message.content.trim());
  //     } catch {
  //       return {
  //         city: null,
  //         state: null,
  //         country: null,
  //         postalCode: null,
  //         address: null,
  //         isLocationProvided: false,
  //       };
  //     }
  //   };

  const extractLocationData = async (messages) => {
    const recentMessages = [...messages]
      .filter((m) => m.role === "user")
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
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `
              Extract the customer's service location from the conversation.

              Return ONLY valid JSON with these fields:
              {
                "address": null,
                "city": null,
                "state": null,
                "country": null,
                "postalCode": null
              }

              Rules:
              - Only extract information explicitly provided by the user.
              - Do not use the business's address as the customer's location.
              - Do not assume the customer's location from their IP.
              - If the user provides a full address, extract its city,
                state, country and postal code when available.
              - If a field is not provided, return null.
              - A city and country combination is sufficient.
              - A city and state combination is sufficient.
            `,
          },
          {
            role: "user",
            content: recentMessages,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error("Location extraction failed.");
    }

    const data = await res.json();

    try {
      return JSON.parse(data.choices[0].message.content.trim());
    } catch {
      return null;
    }
  };

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

  const userText = getRecentUserText(messages);

  // const matchedIntent = detectIntent(userText, chatbot.chatbot_intents);

  const FINAL_WARNING = `${chatbot.finalWarningMessage.message || "This is the final warning. If you continue to waste time or ask irrelevant questions, I will end the conversation and not respond anymore."}`;

  // const hasSentFinalWarning = messages.some((m) => {
  //   console.log("Checking message for final warning:", getMessageText(m));
  //   return (
  //     m.role === "assistant" && getMessageText(m).includes("[FINAL_WARNING]")
  //   );
  // });

  console.log("Chatbot intents:", chatbot.chatbot_intents);

  const hasSentFinalWarning = messages.some(
    (m) => m.role === "assistant" && getMessageText(m).includes(FINAL_WARNING),
  );
  console.log("Final warning status:", hasSentFinalWarning);
  const matchedIntent =
    (await detectIntentWithAI(
      messages,
      chatbot.chatbot_intents,
      chatbot.dynamicSystemPrompt.context,
    )) ?? detectIntent(userText, chatbot.chatbot_intents);

  //   if (matchedIntent?.name === "Stop Engaging") {
  //     if (!hasSentFinalWarning) {
  //       const warningPrompt = `
  //       ${chatbot.finalWarningPrompt.toneOfVoice || "Slightly annoyed but still professional"}

  //       ${chatbot.finalWarningPrompt.warningTrigger || "The user is wasting time or asking irrelevant questions."}

  //       ${chatbot.finalWarningPrompt.additionalDetails.map((detail) => `- ${detail}`).join("\n")}

  // Prefix your response with ${FINAL_WARNING} to indicate this is the final warning. If they continue to waste time after this, you will end the conversation and not respond anymore.
  // `;

  //       const result = await streamText({
  //         model: openai("gpt-4o-mini"),
  //         messages: [
  //           { role: "system", content: warningPrompt },
  //           ...(await convertToModelMessages(messages)),
  //         ],
  //       });

  //       return result.toUIMessageStreamResponse();
  //     }

  //     return new Response(null, { status: 204 });
  //   }

  if (matchedIntent?.name === "Stop Engaging") {
    if (!hasSentFinalWarning) {
      const stream = createUIMessageStream({
        execute: ({ writer }) => {
          const textId = crypto.randomUUID();

          writer.write({
            type: "text-start",
            id: textId,
          });

          writer.write({
            type: "text-delta",
            id: textId,
            delta: FINAL_WARNING,
          });

          writer.write({
            type: "text-end",
            id: textId,
          });
        },
      });

      return createUIMessageStreamResponse({
        stream,
      });
    }
    return new Response(null, { status: 204 });
  }

  matchedIntent?.name?.toLowerCase() ?? "";

  // if (
  //   ["booking", "appointment", "service request"].some((term) =>
  //     intentName.includes(term),
  //   )
  // ) {
  //   // Check if recent messages contain location data
  // }

  // const intentName = matchedIntent?.name?.toLowerCase() ?? "";

  const isBookingIntent = ["booking", "appointment", "service request"].some(
    (term) => (matchedIntent?.name?.toLowerCase() ?? "").includes(term),
  );

  let bookingRules = "";

  if (isBookingIntent && chatbot.serviceAreasEnabled) {
    const locationData = await extractLocationData(messages);

    const hasLocation =
      locationData &&
      (locationData.address ||
        locationData.postalCode ||
        (locationData.city && (locationData.state || locationData.country)));

    if (!hasLocation) {
      bookingRules = `
      BOOKING LOCATION REQUIREMENT:

      The customer wants to book or request a service.

      You MUST obtain their service location before proceeding.

      Ask the customer for their city and state, or city and country.

      Do not ask for their phone number, email, or other booking
      details until their service location has been provided.

      If the customer has already been asked for their location,
      politely remind them that you need it to confirm service availability.

      Do not claim that the business services their location.
    `;
    } else {
      // Geocode the customer's location and check coverage here.
      const geocodeReq = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/geocode`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: locationData.city,
            state: locationData.state,
            country: locationData.country,
          }),
        },
      );

      const geocoded = await geocodeReq.json();

      if (!geocoded.success) {
        bookingRules = `
    The customer has provided a location, but it could not
    be identified reliably.

    Ask them to clarify their city, state, or country.
    Do not assume their location or claim coverage.
  `;
      } else {
        bookingLocationVerified = true;
        const coverageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/check-if-in-service-area`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({
              domain: domain,
              serviceRequestAreaData: {
                city: locationData.city,
                state: locationData.state,
                country: locationData.country,
              },
            }),
          },
        );

        const coverageData = await coverageResponse.json();

        if (coverageData.inServiceArea) {
          bookingRules = `
      LOCATION VERIFIED:

      The customer's location is within the business's service area.

      You can continue collecting the information required
      for the booking request.
    `;
        } else if (!coverageData.inServiceArea) {
          bookingRules = `
      LOCATION NOT COVERED:

      The customer's location is outside the business's
      service area.

      Politely explain that the business does not currently
      service their location.

      Do not continue the booking process.
    `;
        } else {
          bookingRules = `
      LOCATION COULD NOT BE VERIFIED:

      Ask the customer for a more specific location,
      such as their ZIP code or full address.

      Do not claim that their location is covered.
    `;
        }
      }
    }
  }

  //   if (isBookingIntent) {
  //     console.log("Booking intent detected:", matchedIntent.name);
  //     const serviceLocation = await extractServiceLocation(messages);

  //     if (!serviceLocation.isLocationProvided) {
  //       const locationPrompt = `
  // You are helping a customer book a service.

  // The customer has expressed interest in booking, but their service
  // location has not been provided yet.

  // Ask the customer for their city and state, or city and country.
  // A ZIP/postal code or full address is also acceptable.

  // Ask only for the location in this response.
  // Do not claim that the service is available.
  // Do not proceed with booking.
  // Keep your response natural and concise.
  // `;

  //       const result = streamText({
  //         model: openai("gpt-4o-mini"),
  //         messages: [
  //           { role: "system", content: locationPrompt },
  //           ...(await convertToModelMessages(messages)),
  //         ],
  //       });

  //       return result.toUIMessageStreamResponse();
  //     }

  //     // Location is available.
  //     // Geocode serviceLocation, check coverage, and continue.

  //     const coverageResponse = await fetch(
  //       `${NEXT_FRONTEND_URL}/api/check-if-in-service-area`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${API_TOKEN}`,
  //         },
  //         body: JSON.stringify({
  //           domain: domain,
  //           serviceRequestAreaData: serviceLocation,
  //         }),
  //       },
  //     );

  //     const coverageResult = await coverageResponse.json();

  //     if (!coverageResult.inServiceArea) {
  //       console.log("Service location is outside service area:", serviceLocation);
  //       const outOfCoveragePrompt = `
  // You are helping a customer book a service.

  // The customer has expressed interest in booking, but their service
  // location is outside our current service area.

  // Inform the customer about the limitation and suggest alternative options.
  // Keep your response natural and concise.
  // `;
  //       const result = streamText({
  //         model: openai("gpt-4o-mini"),
  //         messages: [
  //           { role: "system", content: outOfCoveragePrompt },
  //           ...(await convertToModelMessages(messages)),
  //         ],
  //       });
  //       return result.toUIMessageStreamResponse();
  //     }

  //     if (coverageResult.inServiceArea) {
  //       console.log("Service location is within service area:", serviceLocation);
  //       const proceedPrompt = `
  // You are helping a customer book a service.
  // The customer has expressed interest in booking, and their service location is within our service area.

  // Proceed with the booking process, asking for necessary details.
  // Keep your response natural and concise.
  // `;
  //       const result = streamText({
  //         model: openai("gpt-4o-mini"),
  //         messages: [
  //           { role: "system", content: proceedPrompt },
  //           ...(await convertToModelMessages(messages)),
  //         ],
  //       });
  //       return result.toUIMessageStreamResponse();
  //     }
  //   }

  if (matchedIntent?.priority >= 70) {
    if (!isBookingIntent || bookingLocationVerified) {
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
                chatbot_intent: matchedIntent.documentId,
              },
              domain,
              sessionId: sessionId[0],
            }),
          },
        );
      }
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
      ${chatbot.dynamicSystemPrompt.context || "Professional and helpful"}

      Tone: ${chatbot.tone}

        ${bookingRules}
        ${captureRules}

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

      ${chatbot.dynamicSystemPrompt.additionalDetails.map((detail) => `- ${detail}`).join("\n")}
      ${captureRules}

      ${chatbot.customAdditionalPromptRules ? `Additional Instructions: ${chatbot.customAdditionalPromptRules}` : ""}
`;

  // const result = await streamText({
  //   model: openai("gpt-4o-mini"),
  //   messages: [
  //     { role: "system", content: dynamicSystemPrompt },
  //     ...(await convertToModelMessages(messages)),
  //   ],
  // });

  // Save Conversation/
  let conversationMessages;

  const result = streamText({
    model: openai("gpt-4o-mini"),

    messages: [
      { role: "system", content: dynamicSystemPrompt },
      ...(await convertToModelMessages(messages)),
    ],

    onFinish: async ({ text }) => {
      conversationMessages = [
        ...messages.map((message) => {
          let content = "";

          if (message.parts) {
            content = message.parts
              .filter((part) => part.type === "text")
              .map((part) => part.text)
              .join("");
          } else if (message.content) {
            content = message.content;
          }

          return {
            id: message.id,
            role: message.role,
            content,
            timestamp: message.timestamp || new Date().toISOString(),
          };
        }),

        {
          // id: crypto.randomUUID(),
          role: "assistant",
          content: text,
          timestamp: new Date().toISOString(),
        },
      ];

      // Save conversationMessages to Strapi here

      const conversationCaptureReq = await fetch(
        `${NEXT_FRONTEND_URL}/api/conversation-capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify({
            data: conversationMessages,
            domain: domain,
            sessionId: sessionId[0],
          }),
        },
      );

      if (!conversationCaptureReq.ok) {
        console.error("Could Not Save Conversation...");
      }
    },
  });

  return result.toUIMessageStreamResponse();
}

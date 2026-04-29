import twilio from "twilio";

// Initialize the client outside the handler to keep it warm
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const customerNumber = formData.get("From");
    const dialStatus = formData.get("DialCallStatus");

    console.log(`Call Status: ${dialStatus} from ${customerNumber}`);

    // Logic: If status is 'no-answer', 'busy', or 'failed'
    if (dialStatus !== "completed") {
      await client.messages.create({
        body: "Hi! This is ProPlumb AI. Sorry we missed your call—we're out on a job. Are you having a plumbing emergency? I can get you on the schedule right now via text.",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: customerNumber,
      });
      console.log("SMS Text-back sent successfully!");
    }

    // Return empty TwiML so Twilio doesn't play an error message
    return new Response("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Twilio Error:", error);
    return new Response("<Response></Response>", { status: 500 });
  }
}

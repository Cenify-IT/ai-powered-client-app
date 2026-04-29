import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";

export async function POST(request) {
  const { firstName, lastName, email, phoneNumber, message } =
    await request.json();

  const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
  );

  if (request.method === "POST") {
    try {
      const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "admin@cenifyit.com",
              Name: `Contact Mail`,
            },
            To: [
              {
                Email: "admin@cenifyit.com",
                Name: "Cenify IT Contact",
              },
            ],
            Subject: `Hi Cenify, You have a New Contact Form Submission`,
            TextPart: `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${message}`,
            HTMLPart: `<h3>First Name: ${firstName}</h3><h3>Last Name: ${lastName}</h3><h3>Email: ${email}</h3><h3>Phone Number: ${phoneNumber}</h3><h3>Message: ${message}</h3>`,
          },
        ],
      });

      if (request.response.status === 200) {
        console.log("Successfully Sent Email");
        return NextResponse.json({
          status: 200,
          message: "Successfully Sent Email",
        });
      } else {
        console.log("Unexpected response status:", request.response.status);
        return NextResponse.json({
          status: 500,
          message: "Something went wrong sending email!",
        });
      }
    } catch (err) {
      console.error("Error sending email:", err);
      return NextResponse.json({
        status: 500,
        message: "Something went wrong sending email!",
      });
    }
  } else {
    return NextResponse.json({
      status: 405,
      message: "Method not allowed...",
    });
  }
}

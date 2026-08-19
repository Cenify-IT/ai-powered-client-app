import { NextResponse } from "next/server";
import { STRAPI_API_URL } from "../../config";
import { cookies } from "next/headers";

export async function POST(request) {
  const cookieStore = await cookies(); // <-- Call this synchronously at the top
  const { email, password } = await request.json();

  if (request.method === "POST") {
    console.log("Attempting login for:", email);
    const strapiRes = await fetch(`${STRAPI_API_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });

    console.log("Strapi response status:", strapiRes.status);

    try {
      const data = await strapiRes.json();
      if (strapiRes.status === 200) {
        cookieStore.set({
          name: "token",
          value: data.jwt,
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24 * 7, // One Week
          sameSite: "strict",
          path: "/",
        });
        // @todo Set Cookie
        return NextResponse.json({
          status: 200,
          message: "Login Successful",
          user: data.user,
        });
      } else {
        return NextResponse.json({
          status: 400,
          message: data.error?.message || "Login Failed",
          user: null,
        });
      }
    } catch (error) {
      return NextResponse.json({
        status: 200,
        message:
          "Something Went Wrong..." + error.message ||
          "Please try again later.",
      });
    }
  } else {
    return NextResponse.json({
      status: 405,
      message: "Method not allowed...",
    });
  }
}

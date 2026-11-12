import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const VISITOR_COOKIE = "cenify_visitor_id";

export async function POST(request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();

    let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

    const isNewVisitor = !visitorId;

    if (!visitorId) {
      visitorId = `v_${randomUUID()}`;
    }

    const response = NextResponse.json({
      success: true,
      visitorId,
      isNewVisitor,
    });

    if (isNewVisitor) {
      response.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365 * 2,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Visitor tracking error:", error);

    return NextResponse.json(
      { error: "Failed to initialize visitor" },
      { status: 500 },
    );
  }
}

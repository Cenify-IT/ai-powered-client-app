const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_API_KEY;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
import { NextResponse } from "next/server";

export async function POST(req) {
  const { city, state, country } = await req.json();

  console.log("Received geocode request:", { city, state, country });

  //Check Request header for API Bearer token
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid authorization header" },
      { status: 401 },
    );
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  if (token !== STRAPI_API_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Invalid API token" },
      { status: 403 },
    );
  }

  const parts = [city, state, country].filter(Boolean);

  if (!parts.length) {
    console.error("No location data provided for geocoding.");
    return NextResponse.json({
      success: false,
      error: "A city, postal code, or other location is required.",
    });
  }

  const apiKey = GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is not set in environment variables.");
    return NextResponse.json({
      success: false,
      error: "Google Maps API key is not configured.",
    });
  }

  const address = parts.join(", ");

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");

  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Google Geocoding API request failed:", response.statusText);
    return NextResponse.json({
      success: false,
      error: "Google Geocoding request failed.",
    });
  }

  const data = await response.json();

  console.log("Geocoding address:", address);
  console.log("Google status:", data.status);
  console.log(
    "Google results:",
    data.results?.map((result) => ({
      formatted_address: result.formatted_address,
      types: result.types,
      location: result.geometry.location,
    })),
  );

  console.log("Google Geocoding API response:", data);

  if (data.status !== "OK" || !data.results?.length) {
    return NextResponse.json({
      success: false,
      error: "Unable to identify that location.",
      googleStatus: data.status,
    });
  }

  const result = data.results[0];

  return NextResponse.json({
    success: true,
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
    locationType: result.geometry.location_type,
  });
}

import { NextResponse } from "next/server";
import { orderByDistance, getDistance, isPointWithinRadius } from "geolib";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req) {
  const { domain, serviceRequestAreaData } = await req.json();

  const query = `websites?filters[domain][$eq]=${domain}&populate[chatbot][fields][0]=serviceAreasEnabled&populate[chatbot][fields][1]=serviceAreas`;
  let captureLead = false;
  let captureRules = "";

  const request = await fetch(`${API_URL}/api/${query}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const res = await request.json();
  const serviceAreasEnabled = res.data[0].chatbot.serviceAreasEnabled;
  const worldwideService = res.data[0].chatbot.serviceAreas.worldwide;
  const serviceAreas = res.data[0].chatbot.serviceAreas.areas;
  const baseLocation = res.data[0].chatbot.serviceAreas.baseLocation;

  console.log("serviceAreasEnabled", serviceAreasEnabled);
  console.log("worldwideService", worldwideService);
  console.log("serviceAreas", serviceAreas);
  console.log("baseLocation", baseLocation);

  if (!serviceRequestAreaData) {
    return NextResponse.json({
      error: "Service request area data is required",
      statusCode: 400,
    });
  }

  if (!serviceAreasEnabled) {
    return NextResponse.json({
      message: "Service areas are not enabled for this domain",
      statusCode: 200,
      inServiceArea: true,
    });
  }

  if (worldwideService) {
    return NextResponse.json({
      message: "Worldwide service is enabled for this domain",
      statusCode: 200,
      inServiceArea: true,
    });
  }

  console.log("serviceRequestAreaData", serviceRequestAreaData);

  // Get geocoded coordinates from the serviceRequestAreaData
  const geocodeData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/geocode`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: serviceRequestAreaData.city,
        state: serviceRequestAreaData.state,
        country: serviceRequestAreaData.country,
      }),
    },
  );

  const geocodeResult = await geocodeData.json();

  const { latitude, longitude } = geocodeResult;

  if (!latitude || !longitude) {
    return NextResponse.json({
      error: "Failed to geocode the service request area data",
      statusCode: 400,
      inServiceArea: false,
    });
  }

  // Check if the geocoded coordinates are within the service areas

  if (!geocodeResult.success) {
    return NextResponse.json({
      error: "Failed to geocode the service request area data",
      statusCode: 400,
      inServiceArea: false,
    });
  }

  const serviceAreasLatLng = await Promise.all(
    serviceAreas.map(async (area) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/geocode`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: area.city,
            state: area.state,
            country: area.country,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed for ${area.city}`);
      }

      const data = await response.json();

      return {
        ...area,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }),
  );

  console.log("serviceAreasLatLng", serviceAreasLatLng);
  console.log("latitude", latitude);
  console.log("longitude", longitude);

  // Check if the geocoded coordinates are within any of the service areas
  const isWithinServiceArea = serviceAreasLatLng.some((serviceArea) =>
    isPointWithinRadius(
      { latitude, longitude },
      { latitude: serviceArea.latitude, longitude: serviceArea.longitude },
      serviceArea.radius.unit === "miles"
        ? serviceArea.radius.value * 1609.34
        : serviceArea.radius.value * 1000 || 50000, // 50 km radius
    ),
  );

  console.log("isWithinServiceArea", isWithinServiceArea);

  return NextResponse.json({
    status: "success",
    statusCode: 200,
    inServiceArea: isWithinServiceArea,
  });
}

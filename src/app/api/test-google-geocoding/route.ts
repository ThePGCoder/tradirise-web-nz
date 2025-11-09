// src/app/api/test-google-geocoding/route.ts
// Optional test route to verify your Google Geocoding setup

import { geocodeAddress } from "@/lib/geocoding-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address") || "Auckland, New Zealand";

  try {
    const result = await geocodeAddress(address);

    return NextResponse.json({
      input_address: address,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        input_address: address,
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Usage examples:
// http://localhost:3000/api/test-google-geocoding
// http://localhost:3000/api/test-google-geocoding?address=123%20Queen%20Street%20Auckland

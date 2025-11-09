// src/lib/geocoding-service.ts

export interface GeocodeResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
  error?: string;
}

interface GoogleGeocodeResponse {
  status: string;
  results?: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address: string;
  }>;
  error_message?: string;
}

// Extended NZ bounds to include all territories
const NZ_BOUNDS = {
  minLat: -52.6, // Includes Subantarctic Islands
  maxLat: -29.0, // Includes Kermadec Islands
  minLng: 160.6, // Includes Chatham Islands
  maxLng: -175.0, // Chatham Islands (crosses dateline)
};

function isWithinNewZealand(lat: number, lng: number): boolean {
  // Handle dateline crossing for Chatham Islands
  const lngInRange =
    (lng >= NZ_BOUNDS.minLng && lng <= 180) ||
    (lng >= -180 && lng <= NZ_BOUNDS.maxLng);

  return lat >= NZ_BOUNDS.minLat && lat <= NZ_BOUNDS.maxLat && lngInRange;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("❌ Google Maps API key not found");
    return {
      success: false,
      error: "Geocoding service not configured",
    };
  }

  const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";
  const params = new URLSearchParams({
    address: `${address}, New Zealand`,
    key: apiKey,
    region: "nz",
    components: "country:NZ",
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${baseUrl}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google API HTTP error: ${response.status}`);
    }

    const data: GoogleGeocodeResponse = await response.json();

    // Handle different status codes
    switch (data.status) {
      case "OK":
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const { lat, lng } = result.geometry.location;

          // Validate coordinates are within New Zealand
          if (!isWithinNewZealand(lat, lng)) {
            console.warn(`⚠️ Coordinates outside NZ bounds: ${lat}, ${lng}`);
            return {
              success: false,
              error: "Address appears to be outside New Zealand",
            };
          }

          return {
            success: true,
            latitude: lat,
            longitude: lng,
            formatted_address: result.formatted_address,
          };
        }
        break;

      case "ZERO_RESULTS":
        return {
          success: false,
          error: "Address not found",
        };

      case "OVER_QUERY_LIMIT":
        console.error("❌ Google Maps API quota exceeded");
        return {
          success: false,
          error: "Geocoding quota exceeded. Please try again later.",
        };

      case "REQUEST_DENIED":
        console.error("❌ Google Maps API request denied:", data.error_message);
        return {
          success: false,
          error: "Geocoding service unavailable",
        };

      case "INVALID_REQUEST":
        return {
          success: false,
          error: "Invalid address format",
        };

      default:
        console.error(`❌ Geocoding failed with status: ${data.status}`);
        return {
          success: false,
          error: `Geocoding failed: ${data.status}`,
        };
    }

    return {
      success: false,
      error: "No results found",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("❌ Geocoding request timed out");
        return {
          success: false,
          error: "Request timed out. Please try again.",
        };
      }

      console.error("❌ Geocoding error:", error);
      return {
        success: false,
        error: error.message || "Geocoding request failed",
      };
    }

    console.error("❌ Unknown error:", error);
    return {
      success: false,
      error: "Geocoding request failed",
    };
  }
}

// Smart geocoding with fallback strategies
export async function smartGeocodeAddress(formData: {
  street_address?: string;
  suburb?: string;
  city: string;
  region?: string;
  postal_code?: string;
}): Promise<GeocodeResult> {
  // Validate required fields
  if (!formData.city || formData.city.trim().length === 0) {
    return {
      success: false,
      error: "City is required for geocoding",
    };
  }

  // Build address combinations in order of precision
  const addressCombinations = [
    // Most specific first
    [
      formData.street_address,
      formData.suburb,
      formData.city,
      formData.postal_code,
    ]
      .filter(Boolean)
      .join(", "),
    [formData.street_address, formData.city, formData.postal_code]
      .filter(Boolean)
      .join(", "),
    [formData.street_address, formData.city].filter(Boolean).join(", "),
    [formData.suburb, formData.city].filter(Boolean).join(", "),
    formData.city,
  ].filter((addr) => addr.trim().length > 0);

  console.log(
    `🔍 Attempting to geocode ${addressCombinations.length} address combinations`
  );

  // Try each combination until one succeeds
  for (let i = 0; i < addressCombinations.length; i++) {
    const address = addressCombinations[i];
    console.log(
      `📍 Attempt ${i + 1}/${addressCombinations.length}: ${address}`
    );

    const result = await geocodeAddress(address);

    if (result.success) {
      console.log(
        `✅ Geocoding succeeded: ${result.latitude}, ${result.longitude}`
      );
      return result;
    }

    // Don't retry if we hit quota limit
    if (result.error?.includes("quota")) {
      return result;
    }

    // Small delay between attempts to avoid rate limiting
    if (i < addressCombinations.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  console.error("❌ All geocoding attempts failed");
  return {
    success: false,
    error: "Could not find coordinates for any address combination",
  };
}

// Helper function to validate if geocoding is available
export function isGeocodingAvailable(): boolean {
  return !!process.env.GOOGLE_MAPS_API_KEY;
}

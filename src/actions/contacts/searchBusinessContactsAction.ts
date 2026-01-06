"use server";
import type { ActionResult } from "@/types/common";

export interface BusinessContact {
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  placeId: string;
}

/**
 * Server Action to search for business contacts using Google Places API
 *
 * @param businessType - Type of business (e.g., "restaurant", "gym", "cafe")
 * @param location - Location (e.g., "Miami, FL" or coordinates "25.7617,-80.1918")
 * @param radius - Search radius in meters (default: 5000)
 * @param maxResults - Maximum number of results (default: 20)
 */
export async function searchBusinessContactsAction(
  businessType: string,
  location: string,
  radius: number = 5000,
  maxResults: number = 20
): Promise<ActionResult<{ businesses: BusinessContact[]; count: number }>> {
  try {
    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!GOOGLE_PLACES_API_KEY) {
      return {
        success: false,
        error:
          "Google Places API key is not configured. Add GOOGLE_PLACES_API_KEY to your .env file",
      };
    }

    if (!businessType || !location) {
      return {
        success: false,
        error: "Business type and location are required",
      };
    }

    // 1. Geocode location if it's text (not coordinates)
    let coordinates = location;
    if (!location.match(/^-?\d+\.?\d*,-?\d+\.?\d*$/)) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_PLACES_API_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status === "OK" && geocodeData.results[0]) {
        const { lat, lng } = geocodeData.results[0].geometry.location;
        coordinates = `${lat},${lng}`;
      } else {
        return {
          success: false,
          error: `Could not find location: ${location}. Please verify it's spelled correctly.`,
        };
      }
    }

    // 2. Search for places using Places API Text Search
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessType)}&location=${coordinates}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status === "ZERO_RESULTS") {
      return {
        success: true,
        data: { businesses: [], count: 0 },
      };
    }

    if (searchData.status !== "OK") {
      console.error("Google Places API error:", searchData);
      return {
        success: false,
        error: `Google Places API error: ${searchData.status}. ${searchData.error_message || ""}`,
      };
    }

    // 3. Get details for each place (phone, website, etc.)
    const businesses: BusinessContact[] = [];
    const results = searchData.results.slice(0, maxResults);

    for (const place of results) {
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,formatted_address,international_phone_number&key=${GOOGLE_PLACES_API_KEY}`;

        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (detailsData.status === "OK" && detailsData.result) {
          const result = detailsData.result;

          // Try to infer email from website domain
          let inferredEmail: string | undefined;
          if (result.website) {
            try {
              const domain = new URL(result.website).hostname.replace(
                "www.",
                ""
              );
              // Infer generic email - NOTE: This does NOT guarantee it's valid
              inferredEmail = `info@${domain}`;
            } catch {
              // Ignore if URL cannot be parsed
            }
          }

          businesses.push({
            name: result.name || place.name,
            phone:
              result.international_phone_number ||
              result.formatted_phone_number,
            email: inferredEmail,
            website: result.website,
            address: result.formatted_address,
            placeId: place.place_id,
          });
        }

        // Small delay to avoid Google rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching details for ${place.name}:`, error);
        // Continue with next business
      }
    }

    return {
      success: true,
      data: {
        businesses,
        count: businesses.length,
      },
    };
  } catch (error) {
    console.error("Error in searchBusinessContactsAction:", error);
    return {
      success: false,
      error: "Error searching for businesses. Please try again.",
    };
  }
}

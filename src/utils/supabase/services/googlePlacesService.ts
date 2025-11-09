// lib/googlePlacesService.ts

// This interface extends the standard Google Maps global declaration
// to include AutocompleteService and PlacesServiceStatus.
/*declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          PlacesServiceStatus: typeof google.maps.places.PlacesServiceStatus;
        };
      };
    };
  }
}*/

export async function fetchGooglePlaceSuggestions(
  input: string,
  mode: "suburb" | "region"
): Promise<string[]> {
  return new Promise((resolve) => {
    // Check if window and google.maps are defined (client-side execution)
    if (
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places
    ) {
      // In a Next.js environment, this might be called server-side during SSR.
      // Google Maps API is a client-side library.
      // Therefore, resolve with an empty array if not in a client-side browser environment.
      console.warn("Google Maps API not loaded or not in browser environment.");
      return resolve([]);
    }

    const service = new window.google.maps.places.AutocompleteService();

    // Determine the 'types' parameter based on the requested mode
    let types: string[];
    if (mode === "suburb") {
      // For suburbs, we typically look for geocodes or cities and then filter more precisely.
      // "(cities)" type includes sublocality, locality, administrative_area_level_3, etc.
      // "geocode" is broader and often includes addresses and locations without specific categories.
      types = ["(cities)"];
    } else {
      // For regions, "(regions)" is the most appropriate base type.
      types = ["(regions)"];
    }

    service.getPlacePredictions(
      {
        input,
        types: types, // Use the dynamically determined types
        componentRestrictions: { country: "nz" }, // New Zealand only
      },
      (predictions, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          // console.error("Google Places Autocomplete error:", status);
          return resolve([]);
        }

        const filtered = predictions
          .filter((p) => {
            const placeTypes = p.types || []; // Ensure types array exists
            if (mode === "suburb") {
              // A suburb can be 'sublocality_level_1' (most common for suburbs),
              // 'sublocality', or even 'locality' if it's a small town/city considered a suburb.
              return (
                placeTypes.includes("sublocality_level_1") ||
                placeTypes.includes("sublocality") ||
                placeTypes.includes("locality")
              );
            }
            if (mode === "region") {
              // Administrative areas represent regions, states, provinces.
              // Level 1 is typically a state/province/region (e.g., Wellington Region).
              // Level 2 might be a county or district (less common for "region" in NZ context).
              return (
                placeTypes.includes("administrative_area_level_1") ||
                placeTypes.includes("administrative_area_level_2")
              );
            }
            return false; // Should not happen given the initial 'types' filter
          })
          .map((p) => p.description);

        resolve(filtered);
      }
    );
  });
}

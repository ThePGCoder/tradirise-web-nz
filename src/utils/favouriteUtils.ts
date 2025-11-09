// utils/favouritesUtils.ts

/**
 * Check if an item is favourited by the current user
 */
export async function checkIsFavourited(
  itemType: "personnel" | "business" | "position" | "project",
  itemId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/my-favourites?item_type=${itemType}&item_id=${itemId}`,
      {
        method: "HEAD",
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error checking favourite status:", error);
    return false;
  }
}

/**
 * Add an item to favourites
 */
export async function addToFavourites(
  itemType: "personnel" | "business" | "position" | "project",
  itemId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/my-favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_type: itemType, item_id: itemId, notes }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to add favourite" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding to favourites:", error);
    return { success: false, error: "Failed to add favourite" };
  }
}

/**
 * Remove an item from favourites
 */
export async function removeFromFavourites(
  itemType: "personnel" | "business" | "position" | "project",
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `/api/my-favourites?item_type=${itemType}&item_id=${itemId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      return { success: false, error: "Failed to remove favourite" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error removing from favourites:", error);
    return { success: false, error: "Failed to remove favourite" };
  }
}

/**
 * Toggle favourite status for an item
 */
export async function toggleFavourite(
  itemType: "personnel" | "business" | "position" | "project",
  itemId: string,
  currentlyFavourited: boolean,
  notes?: string
): Promise<{ success: boolean; newState: boolean; error?: string }> {
  if (currentlyFavourited) {
    const result = await removeFromFavourites(itemType, itemId);
    return { ...result, newState: false };
  } else {
    const result = await addToFavourites(itemType, itemId, notes);
    return { ...result, newState: true };
  }
}

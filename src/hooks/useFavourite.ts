// hooks/useFavourite.ts
import {
  addToFavourites,
  checkIsFavourited,
  removeFromFavourites,
} from "@/utils/favouriteUtils";
import { useState, useEffect, useCallback } from "react";

interface UseFavouriteReturn {
  isFavourited: boolean;
  isLoading: boolean;
  isToggling: boolean;
  toggleFavourite: () => Promise<void>;
  error: string | null;
}

/**
 * Hook to manage favourite state for various item types
 * @param itemType - Type of item: "personnel", "business", "position", "project", "vehicle", "plant", or "material"
 * @param itemId - ID of the item
 * @param onToggle - Optional callback when favourite is toggled
 */
export function useFavourite(
  itemType:
    | "personnel"
    | "business"
    | "position"
    | "project"
    | "vehicle"
    | "plant"
    | "material",
  itemId: string,
  onToggle?: (isFavourited: boolean) => void
): UseFavouriteReturn {
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check initial favourite status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const status = await checkIsFavourited(itemType, itemId);
        setIsFavourited(status);
      } catch (err) {
        console.error("Error checking favourite status:", err);
        setError("Failed to check favourite status");
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      checkStatus();
    }
  }, [itemType, itemId]);

  // Toggle favourite status
  const toggleFavourite = useCallback(async () => {
    setIsToggling(true);
    setError(null);

    try {
      let result;

      if (isFavourited) {
        // Remove from favourites
        result = await removeFromFavourites(itemType, itemId);
        if (result.success) {
          setIsFavourited(false);
          if (onToggle) {
            onToggle(false);
          }
        } else {
          setError(result.error || "Failed to remove favourite");
        }
      } else {
        // Add to favourites
        result = await addToFavourites(itemType, itemId);
        if (result.success) {
          setIsFavourited(true);
          if (onToggle) {
            onToggle(true);
          }
        } else {
          setError(result.error || "Failed to add favourite");
        }
      }
    } catch (err) {
      console.error("Error toggling favourite:", err);
      setError("Failed to update favourite");
    } finally {
      setIsToggling(false);
    }
  }, [itemType, itemId, isFavourited, onToggle]);

  return {
    isFavourited,
    isLoading,
    isToggling,
    toggleFavourite,
    error,
  };
}

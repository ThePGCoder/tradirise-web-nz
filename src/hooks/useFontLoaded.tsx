"use client";
// hooks/useFontLoaded.ts
import { useEffect, useState } from "react";

export function useFontLoaded(fontName: string): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts) {
      const checkFont = async () => {
        try {
          await document.fonts.load(`1rem "${fontName}"`);
          setLoaded(true);
        } catch (err) {
          console.error(`Failed to load font: ${fontName}`, err);
        }
      };
      checkFont();
    } else {
      // Fallback: assume loaded if API is unsupported
      setLoaded(true);
    }
  }, [fontName]);

  return loaded;
}

// utils/shareUtils.ts

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface ShareResult {
  success: boolean;
  method?: "native" | "clipboard" | "social";
  cancelled?: boolean;
  error?: string;
}

/**
 * Attempts to share data via native Web Share API.
 * Falls back to clipboard copy if unavailable or fails.
 */
async function tryShare(shareData: ShareData): Promise<ShareResult> {
  if (navigator.share) {
    try {
      const canShare = !navigator.canShare || navigator.canShare(shareData);
      if (canShare) {
        await navigator.share(shareData);
        return { success: true, method: "native" };
      }
    } catch (error) {
      const err = error as Error;
      if (err.name === "AbortError") return { success: false, cancelled: true };
      console.warn("Native share failed, falling back to clipboard:", err);
    }
  }

  return copyToClipboard(shareData.url);
}

/**
 * Helper function to copy text to clipboard with fallback.
 */
async function copyToClipboard(text: string): Promise<ShareResult> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true, method: "clipboard" };
    }

    // Legacy fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (success) return { success: true, method: "clipboard" };
    throw new Error("Copy command was unsuccessful");
  } catch (error) {
    console.error("Clipboard copy failed:", error);
    return {
      success: false,
      error: "Failed to copy to clipboard. Please copy the link manually.",
    };
  }
}

/**
 * Share a position listing.
 */
export async function sharePosition(position: {
  id: string;
  title: string;
  trade: string;
  region: string;
}): Promise<ShareResult> {
  const shareData: ShareData = {
    title: `${position.title} - ${position.trade}`,
    text: `Check out this position: ${position.title} in ${position.region}\n\n${window.location.origin}/listings/positions/${position.id}`,
    url: `${window.location.origin}/listings/positions/${position.id}`,
  };

  return tryShare(shareData);
}

/**
 * Share a project listing.
 */
export async function shareProject(project: {
  id: string;
  title: string;
  project_type: string;
  region: string;
}): Promise<ShareResult> {
  const shareData: ShareData = {
    title: `${project.title} - ${project.project_type}`,
    text: `Check out this project: ${project.title} in ${project.region}\n\n${window.location.origin}/listings/projects/${project.id}`,
    url: `${window.location.origin}/listings/projects/${project.id}`,
  };

  return tryShare(shareData);
}

/**
 * Share a personnel profile.
 */
export async function sharePersonnel(person: {
  id: string;
  first_name: string;
  last_name: string;
  primary_trade_role?: string;
  region?: string;
}): Promise<ShareResult> {
  const shareData: ShareData = {
    title: `${person.first_name} ${person.last_name} - ${
      person.primary_trade_role || "Personnel"
    }`,
    text: `Check out ${person.first_name} ${person.last_name}, a ${
      person.primary_trade_role || "professional"
    } in ${person.region || "your area"}.\n\n${
      window.location.origin
    }/personnel/${person.id}`,
    url: `${window.location.origin}/personnel/${person.id}`,
  };

  return tryShare(shareData);
}

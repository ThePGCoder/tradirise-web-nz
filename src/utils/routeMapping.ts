import { protectedNavData, publicNavData } from "@/lib/data/navItemData";

// Generate route map from nav data
function generateRouteMap(navData: typeof protectedNavData) {
  const routeMap: Record<string, string> = {};

  navData.forEach((item) => {
    // Add main item if it has a link
    if (item.link) {
      routeMap[item.link] = item.title;
    }

    // Add submenu items
    if (item.subMenu) {
      item.subMenu.forEach((subItem) => {
        if (subItem.link) {
          routeMap[subItem.link] = subItem.title;
        }
      });
    }
  });

  return routeMap;
}

// Generate both public and protected route maps
export const protectedRouteMap = generateRouteMap(protectedNavData);
export const publicRouteMap = generateRouteMap(publicNavData);

// Combined route map (protected takes precedence)
export const routeMap = {
  ...publicRouteMap,
  ...protectedRouteMap,
};

// Helper function to get route name from pathname
export function getRouteNameFromPathname(
  pathname: string,
  isAuthenticated: boolean = true
): string {
  const mapToUse = isAuthenticated ? protectedRouteMap : publicRouteMap;

  // Direct match
  if (mapToUse[pathname]) {
    return mapToUse[pathname];
  }

  // Try to match with trailing slash
  const normalizedPath = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  if (mapToUse[normalizedPath]) {
    return mapToUse[normalizedPath];
  }

  // Try to match parent route (e.g., /listings/personnel/123 -> /listings/personnel)
  const segments = pathname.split("/").filter(Boolean);
  for (let i = segments.length; i > 0; i--) {
    const potentialPath = "/" + segments.slice(0, i).join("/");
    if (mapToUse[potentialPath]) {
      return mapToUse[potentialPath];
    }
  }

  // Fallback: capitalize first segment
  if (segments.length > 0) {
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  }

  return "Home";
}

"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Business } from "@/types/business";

interface GoogleMapsBusinessMapProps {
  businesses: Business[];
  height?: string | number;
  onBusinessSelect?: (business: Business) => void;
  onViewDetails?: (businessId: string) => void;
}

interface BusinessCluster {
  businesses: Business[];
  latitude: number;
  longitude: number;
  locationKey: string;
}

interface RegionCluster {
  region: string;
  city: string;
  businesses: Business[];
  centerLat: number;
  centerLng: number;
  count: number;
}

declare global {
  interface Window {
    google?: typeof google;
    initGoogleMaps?: () => void;
    viewBusinessDetails?: (businessId: string) => void;
    mapInstance?: google.maps.Map;
  }
}

/** Overlay that renders an HTML label on top of Google Maps using OverlayView */
class BusinessLabelOverlay {
  private position: google.maps.LatLngLiteral;
  private content: string;
  private map: google.maps.Map;
  public div?: HTMLDivElement;
  public overlayView?: google.maps.OverlayView;

  constructor(
    position: google.maps.LatLngLiteral,
    content: string,
    map: google.maps.Map
  ) {
    this.position = position;
    this.content = content;
    this.map = map;

    if (window.google?.maps?.OverlayView) {
      const overlay = new window.google.maps.OverlayView();
      this.overlayView = overlay;

      overlay.onAdd = () => {
        const div = document.createElement("div");
        div.innerHTML = this.content;
        div.style.position = "absolute";
        div.style.pointerEvents = "none";
        div.style.userSelect = "none";
        div.style.zIndex = "1000";

        this.div = div;
        const panes = overlay.getPanes();
        panes?.overlayLayer.appendChild(div);
      };

      overlay.draw = () => {
        if (!this.div) return;
        const proj = overlay.getProjection();
        if (!proj) return;
        const pos = proj.fromLatLngToDivPixel(
          new window.google.maps.LatLng(this.position)
        );
        if (pos) {
          this.div.style.left = pos.x + "px";
          this.div.style.top = pos.y + "px";
        }
      };

      overlay.onRemove = () => {
        if (this.div?.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = undefined;
        }
      };

      overlay.setMap(map);
    }
  }

  remove() {
    if (this.overlayView) {
      this.overlayView.setMap(null);
    }
  }
}

const getRegionClusters = (businesses: Business[]): RegionCluster[] => {
  const regionMap = new Map<string, Business[]>();

  businesses.forEach((business) => {
    const lat = parseFloat(String(business.latitude));
    const lng = parseFloat(String(business.longitude));

    if (
      business.latitude &&
      business.longitude &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      business.geocoding_status === "success"
    ) {
      const key = business.city || business.region || "Unknown";
      if (!regionMap.has(key)) {
        regionMap.set(key, []);
      }
      regionMap.get(key)!.push(business);
    }
  });

  const clusters: RegionCluster[] = [];
  regionMap.forEach((businessList) => {
    const avgLat =
      businessList.reduce((sum, b) => sum + parseFloat(String(b.latitude)), 0) /
      businessList.length;
    const avgLng =
      businessList.reduce(
        (sum, b) => sum + parseFloat(String(b.longitude)),
        0
      ) / businessList.length;

    clusters.push({
      region: businessList[0].region || businessList[0].city || "Unknown",
      city: businessList[0].city || businessList[0].region || "Unknown",
      businesses: businessList,
      centerLat: avgLat,
      centerLng: avgLng,
      count: businessList.length,
    });
  });

  return clusters;
};

const GoogleMapsBusinessMap: React.FC<GoogleMapsBusinessMapProps> = ({
  businesses,
  height = 600,
  onBusinessSelect,
  onViewDetails,
}) => {
  const theme = useTheme();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const labelsRef = useRef<BusinessLabelOverlay[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(6);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const businessClusters = useMemo((): BusinessCluster[] => {
    const clusters: BusinessCluster[] = [];
    const locationMap = new Map<string, Business[]>();

    businesses.forEach((business) => {
      const lat = parseFloat(String(business.latitude));
      const lng = parseFloat(String(business.longitude));

      if (
        business.latitude &&
        business.longitude &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        business.geocoding_status === "success"
      ) {
        const locationKey = `${lat.toFixed(6)}_${lng.toFixed(6)}`;
        if (!locationMap.has(locationKey)) {
          locationMap.set(locationKey, []);
        }
        locationMap.get(locationKey)!.push(business);
      }
    });

    locationMap.forEach((businessList, locationKey) => {
      const firstBusiness = businessList[0];
      clusters.push({
        businesses: businessList,
        latitude: parseFloat(String(firstBusiness.latitude)),
        longitude: parseFloat(String(firstBusiness.longitude)),
        locationKey,
      });
    });

    return clusters;
  }, [businesses]);

  const businessStats = useMemo(() => {
    const withLocation = businesses.filter((business) => {
      const lat = parseFloat(String(business.latitude));
      const lng = parseFloat(String(business.longitude));
      return (
        business.latitude &&
        business.longitude &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        business.geocoding_status === "success"
      );
    });

    const pending = businesses.filter((b) => b.geocoding_status === "pending");
    const failed = businesses.filter((b) => b.geocoding_status === "failed");

    return {
      total: businesses.length,
      withLocation,
      pending: pending.length,
      failed: failed.length,
      withoutLocation: businesses.length - withLocation.length,
      clusters: businessClusters.length,
      multiBusinessLocations: businessClusters.filter(
        (c) => c.businesses.length > 1
      ).length,
    };
  }, [businesses, businessClusters]);

  // Load Google Maps script once
  useEffect(() => {
    if (window.google) {
      setIsMapLoaded(true);
      return;
    }

    if (!googleMapsApiKey) {
      setMapError("Google Maps API key not configured.");
      return;
    }

    const script = document.createElement("script");
    // callback parameter will set window.initGoogleMaps
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry,places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    window.initGoogleMaps = () => {
      setIsMapLoaded(true);
    };

    script.onerror = () => {
      setMapError("Failed to load Google Maps.");
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.initGoogleMaps;
    };
  }, [googleMapsApiKey]);

  // initialize map when the script is loaded
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.google) return;

    try {
      const nzCenter = { lat: -41.2858, lng: 174.7868 };

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: nzCenter,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        restriction: {
          latLngBounds: {
            north: -34.0,
            south: -47.5,
            west: 165.0,
            east: 179.0,
          },
          strictBounds: false,
        },
      });

      mapInstanceRef.current = map;
      window.mapInstance = map;
      infoWindowRef.current = new window.google.maps.InfoWindow();

      window.google.maps.event.addListener(map, "zoom_changed", () => {
        setCurrentZoom(map.getZoom() ?? 6);
      });

      // create markers after map has been created
      // createMarkersAndLabels has its own memoization via useCallback and will run in the next effect
    } catch {
      setMapError("Failed to initialize map.");
    }
    // only run once when isMapLoaded flips to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded, mapRef.current]);

  // createMarkersAndLabels must be stable for useEffect dependencies -> useCallback
  const createMarkersAndLabels = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    // clear previous markers and labels
    markersRef.current.forEach((m) => m.setMap(null));
    labelsRef.current.forEach((l) => l.remove());
    markersRef.current = [];
    labelsRef.current = [];

    const showDetailedLabels = currentZoom >= 12;
    const showRegionClusters = currentZoom < 10;

    // Helper to build safe HTML escaping for business names (minimal)
    const escapeHtml = (str: string) =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    if (showRegionClusters) {
      const regionClusters = getRegionClusters(businessStats.withLocation);

      regionClusters.forEach((cluster) => {
        const isSelected = cluster.businesses.some(
          (b) => b.id === selectedBusiness?.id
        );

        const markerIcon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="18" fill="${
                  isSelected ? "#ff6b35" : theme.palette.primary.main
                }" stroke="white" stroke-width="3"/>
                <text x="24" y="29" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${
                  cluster.count
                }</text>
              </svg>
            `),
          scaledSize: new window.google.maps.Size(48, 48),
          anchor: new window.google.maps.Point(24, 24),
        };

        const marker = new window.google.maps.Marker({
          position: { lat: cluster.centerLat, lng: cluster.centerLng },
          map,
          title: `${cluster.count} businesses in ${cluster.city}`,
          icon: markerIcon,
          zIndex: isSelected ? 1000 : 100,
        });

        const labelContent = `
          <div style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(4px);
            padding: 6px 12px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            font-family: ${escapeHtml(String(theme.typography.fontFamily))};
            font-size: 13px;
            font-weight: 600;
            color: #1a1a1a;
            white-space: nowrap;
            transform: translateY(-50%);
          ">${escapeHtml(cluster.city)}</div>
        `;

        const labelPosition = {
          lat: cluster.centerLat,
          lng: cluster.centerLng,
        };
        const label = new BusinessLabelOverlay(
          labelPosition,
          labelContent,
          map
        );

        if (label.overlayView) {
          label.overlayView.draw = function () {
            if (!label.div) return;
            const overlayProjection = this.getProjection();
            const position = overlayProjection.fromLatLngToDivPixel(
              new window.google.maps.LatLng(labelPosition)
            );
            if (position) {
              label.div.style.left = position.x + 30 + "px";
              label.div.style.top = position.y + "px";
            }
          };
        }

        labelsRef.current.push(label);

        marker.addListener("click", () => {
          const businessList = cluster.businesses
            .slice(0, 10)
            .map((business) => {
              const logoHtml = business.logo_url
                ? `<img src="${escapeHtml(
                    business.logo_url
                  )}" style="width: 28px; height: 28px; border-radius: 4px; object-fit: cover;">`
                : `<div style="width: 28px; height: 28px; border-radius: 4px; background: ${
                    theme.palette.primary.main
                  }; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${escapeHtml(
                    business.business_name.charAt(0).toUpperCase()
                  )}</div>`;

              return `
                <div style="display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #eee;">
                  ${logoHtml}
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(
                      business.business_name
                    )}</div>
                    <div style="font-size: 11px; color: #666;">${escapeHtml(
                      String(business.business_type || "")
                    )}</div>
                  </div>
                  <button onclick="window.viewBusinessDetails && window.viewBusinessDetails('${escapeHtml(
                    business.id
                  )}')" style="background: ${
                theme.palette.primary.main
              }; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; white-space: nowrap;">View</button>
                </div>
              `;
            })
            .join("");

          const moreText =
            cluster.count > 10
              ? `<div style="padding: 8px 0; text-align: center; color: #666; font-size: 12px;">+ ${
                  cluster.count - 10
                } more businesses</div>`
              : "";

          const infoContent = `
            <div style="max-width: 350px; padding: 12px; font-family: ${escapeHtml(
              String(theme.typography.fontFamily)
            )};">
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">${escapeHtml(
                cluster.city
              )}</h3>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">${
                cluster.count
              } business${cluster.count !== 1 ? "es" : ""}</p>
              <div style="max-height: 300px; overflow-y: auto;">${businessList}</div>
              ${moreText}
              <button onclick="window.mapInstance && window.mapInstance.setZoom(12); window.mapInstance && window.mapInstance.setCenter({lat: ${
                cluster.centerLat
              }, lng: ${
            cluster.centerLng
          }});" style="width: 100%; background: transparent; color: ${
            theme.palette.primary.main
          }; border: 1px solid ${
            theme.palette.primary.main
          }; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 13px; margin-top: 8px; font-weight: 500;">Zoom to see individual businesses</button>
            </div>
          `;

          infoWindowRef.current?.setContent(infoContent);
          infoWindowRef.current?.open(map, marker);
        });

        markersRef.current.push(marker);
      });

      return;
    }

    // Detailed or overview markers
    businessClusters.forEach((cluster) => {
      const isMultiBusiness = cluster.businesses.length > 1;
      const primaryBusiness = cluster.businesses[0];
      const isSelected =
        selectedBusiness?.id === primaryBusiness.id ||
        cluster.businesses.some((b) => b.id === selectedBusiness?.id);

      let markerIcon: google.maps.Icon | undefined;

      if (showDetailedLabels && !isMultiBusiness) {
        markerIcon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="${
                isSelected ? "#ff6b35" : theme.palette.primary.main
              }" stroke="white" stroke-width="2"/>
              <circle cx="10" cy="10" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(20, 20),
          anchor: new window.google.maps.Point(10, 10),
        };
      } else {
        markerIcon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="14" fill="${
                isSelected ? "#ff6b35" : theme.palette.primary.main
              }" stroke="white" stroke-width="3"/>
              ${
                isMultiBusiness
                  ? `<text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${cluster.businesses.length}</text>`
                  : `<circle cx="18" cy="18" r="5" fill="white"/>`
              }
            </svg>
          `),
          scaledSize: new window.google.maps.Size(36, 36),
          anchor: new window.google.maps.Point(18, 18),
        };
      }

      const marker = new window.google.maps.Marker({
        position: { lat: cluster.latitude, lng: cluster.longitude },
        map,
        title: isMultiBusiness
          ? `${cluster.businesses.length} businesses`
          : primaryBusiness.business_name,
        icon: markerIcon,
        zIndex: isSelected ? 1000 : isMultiBusiness ? 500 : 1,
      });

      if (showDetailedLabels) {
        cluster.businesses.forEach((business, index) => {
          let offsetX = 25;
          let offsetY = -50;

          if (cluster.businesses.length > 1) {
            offsetY = -50 + index * 40;
            if (index % 2 === 1) {
              offsetX = -225;
            }
          }

          const logoHtml = business.logo_url
            ? `<img src="${escapeHtml(
                business.logo_url
              )}" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover; flex-shrink: 0;">`
            : `<div style="width: 24px; height: 24px; border-radius: 4px; background: ${
                theme.palette.primary.main
              }; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; flex-shrink: 0;">${escapeHtml(
                business.business_name.charAt(0).toUpperCase()
              )}</div>`;

          const labelContent = `
            <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.95); padding: 8px 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-family: ${escapeHtml(
              String(theme.typography.fontFamily)
            )}; font-size: 13px; font-weight: 500; color: #1a1a1a; max-width: 200px; transform: translateY(-50%); z-index: ${
            1000 + index
          }; position: relative;">
              ${logoHtml}
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(
                  business.business_name
                )}</div>
                <div style="font-size: 11px; color: #666; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(
                  String(business.business_type || "")
                )}</div>
              </div>
            </div>
          `;

          const labelPosition = {
            lat: cluster.latitude,
            lng: cluster.longitude,
          };
          const label = new BusinessLabelOverlay(
            labelPosition,
            labelContent,
            map
          );

          if (label.overlayView) {
            label.overlayView.draw = function () {
              if (!label.div) return;
              const overlayProjection = this.getProjection();
              const position = overlayProjection.fromLatLngToDivPixel(
                new window.google.maps.LatLng(labelPosition)
              );
              if (position) {
                label.div.style.left = position.x + offsetX + "px";
                label.div.style.top = position.y + offsetY + "px";
              }
            };
          }

          labelsRef.current.push(label);
        });
      }

      marker.addListener("click", () => {
        if (isMultiBusiness) {
          const businessList = cluster.businesses
            .map((business) => {
              const logoHtml = business.logo_url
                ? `<img src="${escapeHtml(
                    business.logo_url
                  )}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover;">`
                : `<div style="width: 32px; height: 32px; border-radius: 4px; background: ${
                    theme.palette.primary.main
                  }; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${escapeHtml(
                    business.business_name.charAt(0).toUpperCase()
                  )}</div>`;

              return `
                <div style="display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #eee;">
                  ${logoHtml}
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 2px;">${escapeHtml(
                      business.business_name
                    )}</div>
                    <div style="font-size: 12px; color: #666;">${escapeHtml(
                      String(business.business_type || "")
                    )}</div>
                    <button onclick="window.viewBusinessDetails && window.viewBusinessDetails('${escapeHtml(
                      business.id
                    )}')" style="background: ${
                theme.palette.primary.main
              }; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; margin-top: 4px;">View Details</button>
                  </div>
                </div>
              `;
            })
            .join("");

          infoWindowRef.current?.setContent(
            `<div style="max-width: 300px; padding: 12px; font-family: ${escapeHtml(
              String(theme.typography.fontFamily)
            )};"><h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">${
              cluster.businesses.length
            } Businesses</h3><div style="max-height: 300px; overflow-y: auto;">${businessList}</div></div>`
          );
          infoWindowRef.current?.open(map, marker);
        } else {
          const business = primaryBusiness;
          setSelectedBusiness(business);
          onBusinessSelect?.(business);

          const workTypesDisplay = (business.types_of_work_undertaken || [])
            .slice(0, 2)
            .map(
              (work) =>
                `<span style="display: inline-block; background: ${
                  theme.palette.primary.light
                }; padding: 3px 8px; border-radius: 12px; font-size: 11px; margin: 2px 4px 2px 0;">${escapeHtml(
                  work
                )}</span>`
            )
            .join("");
          const moreWorkTypes =
            (business.types_of_work_undertaken || []).length > 2
              ? `<span style="display: inline-block; background: #f0f0f0; color: #666; padding: 3px 8px; border-radius: 12px; font-size: 11px; margin: 2px 4px 2px 0;">+${
                  (business.types_of_work_undertaken || []).length - 2
                } more</span>`
              : "";

          const locationText =
            business.formatted_address ||
            [business.street_address, business.suburb, business.city]
              .filter(Boolean)
              .join(", ") ||
            business.city ||
            business.region ||
            "Location verified";

          const infoHtml = `
            <div style="max-width: 300px; padding: 12px; font-family: ${escapeHtml(
              String(theme.typography.fontFamily)
            )};">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                ${
                  business.logo_url
                    ? `<img src="${escapeHtml(
                        business.logo_url
                      )}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover;">`
                    : `<div style="width: 8px; height: 8px; background: #4caf50; border-radius: 50%;"></div>`
                }
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${escapeHtml(
                  business.business_name
                )}</h3>
              </div>
              <div style="margin-bottom: 8px;">
                <p style="margin: 0; color: ${
                  theme.palette.primary.main
                }; font-size: 14px; font-weight: 500;">${escapeHtml(
            String(business.business_type || "")
          )}</p>
                <p style="margin: 2px 0 0 0; color: #666; font-size: 13px;">📍 ${escapeHtml(
                  locationText
                )}</p>
              </div>
              <div style="display: flex; gap: 16px; margin-bottom: 10px; font-size: 12px; color: #888;">
                <span><strong>${escapeHtml(
                  String(business.years_in_trading || "")
                )}</strong> years</span>
                <span><strong>${escapeHtml(
                  String(business.employees || "")
                )}</strong></span>
              </div>
              <div style="margin-bottom: 12px;">${workTypesDisplay}${moreWorkTypes}</div>
              <div style="display: flex; gap: 8px;">
                <button onclick="window.viewBusinessDetails && window.viewBusinessDetails('${escapeHtml(
                  business.id
                )}')" style="background: ${
            theme.palette.primary.main
          }; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; flex: 1;">View Details</button>
                ${
                  business.website
                    ? `<button onclick="window.open('${escapeHtml(
                        business.website
                      )}', '_blank')" style="background: transparent; color: ${
                        theme.palette.primary.main
                      }; border: 1px solid ${
                        theme.palette.primary.main
                      }; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px;">Website</button>`
                    : ""
                }
              </div>
            </div>
          `;

          infoWindowRef.current?.setContent(infoHtml);
          infoWindowRef.current?.open(map, marker);
        }
        // refresh markers/labels to reflect selection state
        // but avoid infinite recursion: do not re-call if map is not ready (we are inside click handler so it's safe)
        // createMarkersAndLabels(); // not required here because we update selection state and effect will run
      });

      markersRef.current.push(marker);
    });

    // expose view handler to window for inline onclicks in info windows/HTML
    window.viewBusinessDetails = (businessId: string) => {
      onViewDetails?.(businessId);
      infoWindowRef.current?.close();
    };
  }, [
    businessClusters,
    businessStats.withLocation,
    currentZoom,
    selectedBusiness,
    onBusinessSelect,
    onViewDetails,
    theme.typography.fontFamily,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ]);

  // re-create markers when clusters, zoom, or selection change
  useEffect(() => {
    if (mapInstanceRef.current && isMapLoaded) {
      createMarkersAndLabels();
    }
  }, [
    businessClusters.length,
    currentZoom,
    isMapLoaded,
    selectedBusiness,
    createMarkersAndLabels,
  ]);

  const fitMapToBounds = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google || businessClusters.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    businessClusters.forEach((cluster) =>
      bounds.extend({ lat: cluster.latitude, lng: cluster.longitude })
    );
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    });

    const listener = window.google?.maps.event.addListener(map, "idle", () => {
      const zoom = map.getZoom();

      // Only set zoom if we actually have a valid number
      if (typeof zoom === "number" && zoom > 15) {
        map.setZoom(15);
      }

      // Safely remove listener
      window.google?.maps.event.removeListener(listener);
    });
  }, [businessClusters]);

  const resetMapView = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setCenter({ lat: -41.2858, lng: 174.7868 });
    map.setZoom(6);
    setSelectedBusiness(null);
    infoWindowRef.current?.close();
  }, []);

  if (mapError) {
    return (
      <Paper
        elevation={2}
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
        }}
      >
        <Box textAlign="center" sx={{ p: 3 }}>
          <Icon
            icon="mdi:map-marker-off"
            style={{
              fontSize: 64,
              color: theme.palette.error.main,
              marginBottom: 16,
            }}
          />
          <Typography color="error" variant="h6" gutterBottom>
            Map Unavailable
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {mapError}
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (!isMapLoaded) {
    return (
      <Paper
        elevation={2}
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
        }}
      >
        <Box textAlign="center" sx={{ p: 3 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography color="text.secondary" variant="body1">
            Loading Interactive Map...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{ position: "relative", height, borderRadius: 2, overflow: "hidden" }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 150,
          right: 12,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Tooltip title="Fit to all businesses" placement="left">
          <span>
            <IconButton
              size="small"
              onClick={fitMapToBounds}
              disabled={businessClusters.length === 0}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 2,
                border: 1,
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover", boxShadow: 3 },
                "&:disabled": { bgcolor: "action.disabledBackground" },
              }}
            >
              <Icon icon="mdi:fit-to-page-outline" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Reset to New Zealand view" placement="left">
          <IconButton
            size="small"
            onClick={resetMapView}
            sx={{
              bgcolor: "background.paper",
              boxShadow: 2,
              border: 1,
              borderColor: "divider",
              "&:hover": { bgcolor: "action.hover", boxShadow: 3 },
            }}
          >
            <Icon icon="mdi:home" />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper
        elevation={1}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1000,
          p: 1,
          borderRadius: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {currentZoom < 10
            ? "Region View"
            : currentZoom >= 12
            ? "Detailed View"
            : "Overview"}{" "}
          (Zoom: {currentZoom})
        </Typography>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          bottom: 12,
          left: 12,
          zIndex: 1000,
          p: 2,
          borderRadius: 2,
          minWidth: 200,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.primary"
          gutterBottom
        >
          Business Locations
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Icon
            icon="mdi:map-marker"
            style={{ color: theme.palette.success.main }}
          />
          <Typography variant="body2" fontWeight={500}>
            {businessStats.withLocation.length} businesses at{" "}
            {businessStats.clusters} locations
          </Typography>
        </Box>
        {businessStats.multiBusinessLocations > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Icon
              icon="mdi:map-marker-multiple"
              style={{ color: theme.palette.info.main }}
            />
            <Typography variant="body2" color="info.main">
              {businessStats.multiBusinessLocations} shared locations
            </Typography>
          </Box>
        )}
        {businessStats.pending > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CircularProgress size={12} />
            <Typography variant="caption" color="warning.main">
              {businessStats.pending} being located...
            </Typography>
          </Box>
        )}
        {businessStats.failed > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Icon
              icon="mdi:map-marker-off"
              style={{ color: theme.palette.error.main, fontSize: 14 }}
            />
            <Typography variant="caption" color="error.main">
              {businessStats.failed} location failed
            </Typography>
          </Box>
        )}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mt: 1, fontStyle: "italic" }}
        >
          {currentZoom < 10
            ? "Zoom in to see individual locations"
            : "Zoom in for business names"}{" "}
          • Total: {businessStats.total}
        </Typography>
      </Paper>

      {businessStats.withoutLocation > businessStats.withLocation.length &&
        businessStats.total > 5 && (
          <Alert
            severity="info"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 1000,
              maxWidth: 400,
            }}
          >
            <Typography variant="body2">
              <strong>Tip:</strong> Add complete addresses to businesses to show
              them on the map.
            </Typography>
          </Alert>
        )}

      <Box
        ref={mapRef}
        sx={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      />
    </Paper>
  );
};

export default GoogleMapsBusinessMap;

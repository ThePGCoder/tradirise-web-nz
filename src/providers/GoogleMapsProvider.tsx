"use client";

import { LoadScript } from "@react-google-maps/api";
import { ReactNode } from "react";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
      loadingElement={<div style={{ display: "none" }}>Loading...</div>}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;

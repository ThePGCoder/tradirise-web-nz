// components/PlaceSearchBox.tsx
"use client";

import React, { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import TextField from "@mui/material/TextField";

interface PlaceSearchBoxProps {
  onPlaceSelected: (data: {
    suburb: string | null;
    city: string | null;
  }) => void;
}

const PlaceSearchBox: React.FC<PlaceSearchBoxProps> = ({ onPlaceSelected }) => {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autoCompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    const place = autoCompleteRef.current?.getPlace();
    if (!place?.address_components) return;

    const getComponent = (type: string) =>
      place.address_components?.find((c) => c.types.includes(type))
        ?.long_name || null;

    const suburb =
      getComponent("sublocality") ||
      getComponent("sublocality_level_1") ||
      null;
    const city =
      getComponent("locality") || getComponent("postal_town") || null;

    onPlaceSelected({ suburb, city });
  };

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
      <TextField
        inputRef={inputRef}
        label="Search suburb or city"
        fullWidth
        variant="outlined"
        size="medium"
      />
    </Autocomplete>
  );
};

export default PlaceSearchBox;

// src/components/GooglePlaceField.tsx (simplified version)
"use client";

import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";

interface GooglePlaceFieldProps {
  label: string;
  placeholder: string;
  onChange: (suburb: string, city: string) => void;
}

const GooglePlaceField: React.FC<GooglePlaceFieldProps> = ({
  label,
  placeholder,
  onChange,
}) => {
  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "nz" },
    },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const addressComponents = results[0].address_components;

      const getComponent = (type: string) =>
        addressComponents?.find((c) => c.types.includes(type))?.long_name ?? "";

      const suburb =
        getComponent("sublocality") ||
        getComponent("sublocality_level_1") ||
        getComponent("neighborhood") ||
        "";

      const city =
        getComponent("locality") ||
        getComponent("postal_town") ||
        getComponent("administrative_area_level_2") ||
        "";

      onChange(suburb, city);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={data.map((suggestion) => suggestion.description)}
      value={value}
      onChange={(_, newValue) => {
        if (newValue) {
          handleSelect(newValue);
        }
      }}
      onInputChange={(_, newInputValue) => {
        setValue(newInputValue);
      }}
      disabled={!ready}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required
        />
      )}
    />
  );
};

export default GooglePlaceField;

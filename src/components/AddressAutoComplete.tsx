// src/components/AddressAutocomplete.tsx
"use client";

import React from "react";
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (addressData: {
    streetAddress: string;
    suburb: string;
    city: string;
    region: string;
    postalCode: string;
  }) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  disabled?: boolean;
  googleRegionMap: { [key: string]: string };
}

// Type definition for Google Places API address component
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Type definition for Google Places API geocode result
interface GeocodeResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  place_id: string;
  types: string[];
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onAddressSelect,
  label = "Street Address",
  placeholder = "Start typing your address...",
  required = false,
  size = "medium",
  fullWidth = true,
  disabled = false,
  googleRegionMap,
}) => {
  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "nz" },
      types: ["address"],
    },
    debounce: 300,
  });

  const normalizeRegion = (googleRegion: string): string => {
    return googleRegionMap[googleRegion] || googleRegion;
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();
    onChange(description);

    if (onAddressSelect) {
      try {
        const results = await getGeocode({ address: description });
        if (results && results[0]) {
          const place = results[0] as GeocodeResult;

          let streetNumber = "";
          let route = "";
          let suburb = "";
          let city = "";
          let region = "";
          let postalCode = "";

          place.address_components.forEach((component: AddressComponent) => {
            const types = component.types;

            if (types.includes("street_number")) {
              streetNumber = component.long_name;
            }
            if (types.includes("route")) {
              route = component.long_name;
            }
            if (types.includes("locality")) {
              city = component.long_name;
            }
            if (
              types.includes("sublocality_level_1") ||
              types.includes("sublocality")
            ) {
              suburb = component.long_name;
            }
            if (types.includes("administrative_area_level_2") && !city) {
              city = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
              region = normalizeRegion(component.long_name);
            }
            if (types.includes("postal_code")) {
              postalCode = component.long_name;
            }
          });

          if (!city) {
            place.address_components.forEach((component: AddressComponent) => {
              if (
                !city &&
                (component.types.includes("postal_town") ||
                  component.types.includes("administrative_area_level_3"))
              ) {
                city = component.long_name;
              }
            });
          }

          const streetAddress = [streetNumber, route].filter(Boolean).join(" ");

          onAddressSelect({
            streetAddress,
            suburb,
            city,
            region,
            postalCode,
          });
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        label={label}
        value={value}
        onChange={handleInputChange}
        disabled={!ready || disabled}
        fullWidth={fullWidth}
        placeholder={placeholder}
        required={required}
        size={size}
        InputProps={{
          sx: { userSelect: "text" },
        }}
      />
      {status === "OK" && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 9999,
            maxHeight: 300,
            overflow: "auto",
            mt: 0.5,
          }}
          elevation={3}
        >
          <List>
            {data.map((suggestion) => {
              const {
                place_id,
                structured_formatting: { main_text, secondary_text },
              } = suggestion;

              return (
                <ListItem key={place_id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelect(suggestion.description)}
                  >
                    <ListItemText
                      primary={main_text}
                      secondary={secondary_text}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default AddressAutocomplete;

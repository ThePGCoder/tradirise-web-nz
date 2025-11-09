// src/components/ServiceAreasSelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Alert,
  Paper,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";

interface ServiceAreasSelectorProps {
  mainLocation: string;
  selectedAreas: string[];
  onAreasChange: (areas: string[]) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  maxSuggestions?: number;
}

// Location suggestions mapping - you can expand this based on your needs
const locationSuggestions: Record<string, string[]> = {
  // Wellington region - multiple variations
  wellington: [
    "Wellington City",
    "Lower Hutt",
    "Upper Hutt",
    "Porirua",
    "Kapiti Coast",
    "Carterton",
    "Masterton",
    "South Wairarapa",
  ],
  "wellington city": [
    "Lower Hutt",
    "Upper Hutt",
    "Porirua",
    "Kapiti Coast",
    "Miramar",
    "Newtown",
    "Mount Victoria",
  ],
  "wellington central": [
    "Lower Hutt",
    "Upper Hutt",
    "Porirua",
    "Wellington City",
    "Miramar",
    "Newtown",
  ],
  "wellington, wellington region": [
    "Lower Hutt",
    "Upper Hutt",
    "Porirua",
    "Kapiti Coast",
    "Wellington City",
  ],
  "wellington region": [
    "Wellington City",
    "Lower Hutt",
    "Upper Hutt",
    "Porirua",
    "Kapiti Coast",
  ],

  // Auckland region - multiple variations
  auckland: [
    "Auckland Central",
    "North Shore",
    "Waitakere",
    "Manukau",
    "Rodney",
    "Franklin",
    "Papakura",
    "Hibiscus Coast",
  ],
  "auckland central": [
    "North Shore",
    "Waitakere",
    "Manukau",
    "Newmarket",
    "Ponsonby",
    "Parnell",
    "Mount Eden",
  ],
  "auckland city": ["North Shore", "Waitakere", "Manukau", "Auckland Central"],

  // Christchurch region
  christchurch: [
    "Christchurch Central",
    "Riccarton",
    "Papanui",
    "Linwood",
    "Addington",
    "Burnside",
    "Cashmere",
    "Selwyn",
  ],
  "christchurch city": [
    "Riccarton",
    "Papanui",
    "Linwood",
    "Christchurch Central",
  ],

  // Hamilton region
  hamilton: [
    "Hamilton Central",
    "Hamilton East",
    "Hamilton West",
    "Hillcrest",
    "Cambridge",
    "Te Awamutu",
    "Morrinsville",
  ],

  // Tauranga region
  tauranga: [
    "Mount Maunganui",
    "Papamoa",
    "Bethlehem",
    "Welcome Bay",
    "Katikati",
    "Te Puke",
    "Rotorua",
  ],

  // Dunedin region
  dunedin: [
    "Dunedin Central",
    "North Dunedin",
    "South Dunedin",
    "Mosgiel",
    "Port Chalmers",
    "Balclutha",
  ],

  // Add more common formats
  "lower hutt": ["Wellington City", "Upper Hutt", "Porirua"],
  "upper hutt": ["Wellington City", "Lower Hutt", "Porirua"],
  "north shore": ["Auckland Central", "Waitakere", "Rodney"],
};

const ServiceAreasSelector: React.FC<ServiceAreasSelectorProps> = ({
  mainLocation,
  selectedAreas,
  onAreasChange,
  label = "Service Areas",
  helperText = "Add areas where you provide services",
  placeholder = "e.g., Lower Hutt, Upper Hutt",
  required = false,
  maxSuggestions = 8,
}) => {
  const [customArea, setCustomArea] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get suggestions based on main location
  useEffect(() => {
    if (!mainLocation) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    console.log("Main location:", mainLocation); // Debug log

    const locationKey = mainLocation.toLowerCase().trim();
    let foundSuggestions: string[] = [];

    // Try exact match first
    if (locationSuggestions[locationKey]) {
      foundSuggestions = locationSuggestions[locationKey];
      console.log("Exact match found:", locationKey, foundSuggestions); // Debug log
    } else {
      // Try partial matches - check if any key words are in the location
      Object.keys(locationSuggestions).forEach((key) => {
        const keyWords = key.split(" ");
        const locationWords = locationKey.split(" ");

        // Check if any key word matches any location word
        const hasMatch = keyWords.some((keyWord) =>
          locationWords.some(
            (locationWord) =>
              locationWord.includes(keyWord) || keyWord.includes(locationWord)
          )
        );

        if (hasMatch) {
          foundSuggestions = [...foundSuggestions, ...locationSuggestions[key]];
          console.log("Partial match found:", key, locationSuggestions[key]); // Debug log
        }
      });
    }

    // Remove duplicates and already selected areas
    foundSuggestions = [...new Set(foundSuggestions)]
      .filter((suggestion) => !selectedAreas.includes(suggestion))
      .slice(0, maxSuggestions);

    console.log("Final suggestions:", foundSuggestions); // Debug log

    setSuggestions(foundSuggestions);
    setShowSuggestions(foundSuggestions.length > 0);
  }, [mainLocation, selectedAreas, maxSuggestions]);

  const handleAddCustomArea = () => {
    if (customArea.trim() && !selectedAreas.includes(customArea.trim())) {
      onAreasChange([...selectedAreas, customArea.trim()]);
      setCustomArea("");
    }
  };

  const handleAddSuggestion = (suggestion: string) => {
    if (!selectedAreas.includes(suggestion)) {
      onAreasChange([...selectedAreas, suggestion]);
    }
  };

  const handleRemoveArea = (area: string) => {
    onAreasChange(selectedAreas.filter((item) => item !== area));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomArea();
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
        {required && (
          <Typography component="span" color="error.main">
            {" "}
            *
          </Typography>
        )}
      </Typography>

      {helperText && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {helperText}
        </Typography>
      )}

      {/* Suggestions based on main location */}
      {showSuggestions && (
        <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
          <Typography variant="subtitle2" pb={2} color="primary">
            <Icon
              icon="mdi:lightbulb-outline"
              style={{ marginRight: 4, verticalAlign: "text-bottom" }}
            />
            Suggested areas near {mainLocation}:
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {suggestions.map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                onClick={() => handleAddSuggestion(suggestion)}
                clickable
                size="small"
                color="info"
                variant="outlined"
                icon={<Icon icon="mdi:plus" width={14} />}
              />
            ))}
          </Stack>
        </Paper>
      )}

      {/* Custom area input */}
      <Flex gap={1} mb={2}>
        <TextField
          label="Add Custom Area"
          value={customArea}
          onChange={(e) => setCustomArea(e.target.value)}
          placeholder={placeholder}
          sx={{ flexGrow: 1 }}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={handleAddCustomArea}
          variant="text"
          disabled={!customArea.trim()}
          sx={{ minWidth: 100 }}
          startIcon={<Icon icon="mdi:plus" />}
        >
          Add
        </Button>
      </Flex>

      {/* Selected areas */}
      <Flex gap={1} flexWrap="wrap" mb={2}>
        {selectedAreas.map((area, index) => (
          <Chip
            key={index}
            label={area}
            onDelete={() => handleRemoveArea(area)}
            color="info"
            variant="filled"
            deleteIcon={<Icon icon="mdi:close" width={16} />}
          />
        ))}
      </Flex>

      {/* Status messages */}
      {selectedAreas.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {required
            ? "Please add at least one service area"
            : "No service areas added yet. This is optional."}
        </Typography>
      )}

      {selectedAreas.length > 0 && (
        <Alert severity="success" sx={{ mt: 1 }}>
          <Typography variant="body2">
            {selectedAreas.length} service area
            {selectedAreas.length > 1 ? "s" : ""} added
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ServiceAreasSelector;

// src/components/steps/LocationContactStep.tsx
"use client";

import React from "react";
import {
  Typography,
  TextField,
  Stack,
  Alert,
  Box,
  Grid,
  MenuItem,
  InputAdornment,
  Divider,
  IconButton,
  Button,
  Card,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";

import {
  BusinessFormData,
  MobileContact,
  BranchAddress,
} from "../../business-form-types";
import AddressAutocomplete from "@/components/AddressAutoComplete";
import { googleRegionMap } from "@/lib/data/googleRegions";
import { nzRegions } from "@/lib/data/regions";

interface LocationContactStepProps {
  formData: BusinessFormData;
  onInputChange: <K extends keyof BusinessFormData>(
    field: K,
    value: BusinessFormData[K]
  ) => void;
  activeStep: number;
}

const LocationContactStep: React.FC<LocationContactStepProps> = ({
  formData,
  onInputChange,
  activeStep,
}) => {
  // Mobile contact handlers
  const addMobileContact = () => {
    onInputChange("mobile_contacts", [
      ...formData.mobile_contacts,
      { name: "", number: "" },
    ]);
  };

  const updateMobileContact = (
    index: number,
    field: keyof MobileContact,
    value: string
  ) => {
    const updated = formData.mobile_contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );
    onInputChange("mobile_contacts", updated);
  };

  const removeMobileContact = (index: number) => {
    const updated = formData.mobile_contacts.filter((_, i) => i !== index);
    onInputChange("mobile_contacts", updated);
  };

  // Branch address handlers
  const addBranchAddress = () => {
    onInputChange("branch_addresses", [
      ...formData.branch_addresses,
      {
        name: "",
        street_address: "",
        suburb: "",
        city: "",
        region: "",
        postal_code: "",
      },
    ]);
  };

  const updateBranchAddress = (
    index: number,
    field: keyof BranchAddress,
    value: string
  ) => {
    const updated = formData.branch_addresses.map((address, i) =>
      i === index ? { ...address, [field]: value } : address
    );
    onInputChange("branch_addresses", updated);
  };

  const removeBranchAddress = (index: number) => {
    const updated = formData.branch_addresses.filter((_, i) => i !== index);
    onInputChange("branch_addresses", updated);
  };

  // Handle branch address autocomplete selection
  const handleBranchAddressSelect = (
    index: number,
    addressData: {
      streetAddress: string;
      suburb: string;
      city: string;
      region: string;
      postalCode: string;
    }
  ) => {
    const updated = formData.branch_addresses.map((addr, i) =>
      i === index
        ? {
            ...addr,
            street_address: addressData.streetAddress,
            suburb: addressData.suburb,
            city: addressData.city,
            region: addressData.region,
            postal_code: addressData.postalCode,
          }
        : addr
    );
    onInputChange("branch_addresses", updated);
  };

  // Fixed website URL handler - only clean on blur, not on every keystroke
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange("website", value);
  };

  const handleWebsiteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim()) {
      const cleanValue = value
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "");
      onInputChange("website", cleanValue);
    }
  };

  return (
    <Box sx={{ userSelect: "none" }}>
      <Stack spacing={3}>
        <Typography variant="h6" component="h3">
          Location & Contact Details
        </Typography>

        <Alert severity="info" icon={<Icon icon="mdi:google-maps" />}>
          <Typography variant="subtitle2" gutterBottom>
            Real-time Location Verification
          </Typography>
          We&#39;ll verify your address with Google Maps immediately when you
          submit. Your business will appear on our map instantly if the address
          is found.
        </Alert>

        {/* Main Business Address */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Primary Business Address
          </Typography>
          <Stack spacing={2}>
            <AddressAutocomplete
              value={formData.street_address || ""}
              onChange={(value) => onInputChange("street_address", value)}
              onAddressSelect={(addressData) => {
                onInputChange("street_address", addressData.streetAddress);
                onInputChange("suburb", addressData.suburb);
                onInputChange("city", addressData.city);
                onInputChange("region", addressData.region);
                onInputChange("postal_code", addressData.postalCode);
              }}
              label="Street Address"
              placeholder="Start typing your address..."
              googleRegionMap={googleRegionMap}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Suburb"
                  value={formData.suburb}
                  onChange={(e) => onInputChange("suburb", e.target.value)}
                  fullWidth
                  placeholder="e.g., Central"
                  InputProps={{
                    sx: { userSelect: "text" },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="City"
                  value={formData.city}
                  onChange={(e) => onInputChange("city", e.target.value)}
                  required
                  fullWidth
                  placeholder="e.g., Auckland"
                  error={!formData.city.trim() && activeStep > 1}
                  helperText={
                    !formData.city.trim() && activeStep > 1
                      ? "City is required"
                      : ""
                  }
                  InputProps={{
                    sx: { userSelect: "text" },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  select
                  label="Region"
                  value={formData.region}
                  onChange={(e) => onInputChange("region", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Region</em>
                  </MenuItem>
                  {nzRegions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Postal Code"
                  value={formData.postal_code}
                  onChange={(e) => onInputChange("postal_code", e.target.value)}
                  fullWidth
                  placeholder="1010"
                  InputProps={{
                    sx: { userSelect: "text" },
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>

        {/* Multi-Branch Section */}
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_multi_branch}
                onChange={(e) =>
                  onInputChange("is_multi_branch", e.target.checked)
                }
              />
            }
            label="Multi-branch business"
          />

          {formData.is_multi_branch && (
            <Box sx={{ mt: 2 }}>
              <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Additional Branch Locations
                </Typography>
                <Button
                  onClick={addBranchAddress}
                  size="small"
                  startIcon={<Icon icon="mdi:plus" />}
                  variant="outlined"
                >
                  Add Branch
                </Button>
              </Flex>
              {formData.branch_addresses.map((branch, index) => (
                <Card key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Stack spacing={2}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">
                        Branch {index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => removeBranchAddress(index)}
                        color="error"
                        size="small"
                      >
                        <Icon icon="mdi:delete" />
                      </IconButton>
                    </Flex>
                    <TextField
                      label="Branch Name"
                      value={branch.name}
                      onChange={(e) =>
                        updateBranchAddress(index, "name", e.target.value)
                      }
                      fullWidth
                      size="small"
                      placeholder="e.g., North Shore Branch"
                      InputProps={{
                        sx: { userSelect: "text" },
                      }}
                    />
                    <AddressAutocomplete
                      value={branch.street_address}
                      onChange={(value) =>
                        updateBranchAddress(index, "street_address", value)
                      }
                      onAddressSelect={(addressData) =>
                        handleBranchAddressSelect(index, addressData)
                      }
                      label="Street Address"
                      placeholder="Start typing address..."
                      size="small"
                      googleRegionMap={googleRegionMap}
                    />
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <TextField
                          label="Suburb"
                          value={branch.suburb}
                          onChange={(e) =>
                            updateBranchAddress(index, "suburb", e.target.value)
                          }
                          fullWidth
                          size="small"
                          InputProps={{
                            sx: { userSelect: "text" },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          label="City"
                          value={branch.city}
                          onChange={(e) =>
                            updateBranchAddress(index, "city", e.target.value)
                          }
                          fullWidth
                          size="small"
                          required
                          InputProps={{
                            sx: { userSelect: "text" },
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid size={8}>
                        <TextField
                          select
                          label="Region"
                          value={branch.region}
                          onChange={(e) =>
                            updateBranchAddress(index, "region", e.target.value)
                          }
                          fullWidth
                          size="small"
                        >
                          <MenuItem value="">
                            <em>Select Region</em>
                          </MenuItem>
                          {nzRegions.map((region) => (
                            <MenuItem key={region} value={region}>
                              {region}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          label="Postal Code"
                          value={branch.postal_code}
                          onChange={(e) =>
                            updateBranchAddress(
                              index,
                              "postal_code",
                              e.target.value
                            )
                          }
                          fullWidth
                          size="small"
                          InputProps={{
                            sx: { userSelect: "text" },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        <Divider />

        {/* Contact Information */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Contact Information
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            At least one contact method (email, mobile, or office phone) is
            required.
          </Alert>

          <Stack spacing={2}>
            <TextField
              label="Business Email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => onInputChange("contact_email", e.target.value)}
              fullWidth
              helperText="Primary email for business inquiries"
              InputProps={{
                sx: { userSelect: "text" },
              }}
            />

            <TextField
              label="Office/Landline Phone"
              value={formData.office_phone}
              onChange={(e) => onInputChange("office_phone", e.target.value)}
              fullWidth
              placeholder="+64 9 123 4567"
              helperText="Office or landline phone number"
              InputProps={{
                sx: { userSelect: "text" },
              }}
            />

            <Box>
              <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Mobile Contacts
                </Typography>
                <Button
                  onClick={addMobileContact}
                  size="small"
                  startIcon={<Icon icon="mdi:plus" />}
                  variant="outlined"
                >
                  Add Mobile Contact
                </Button>
              </Flex>
              {formData.mobile_contacts.map((contact, index) => (
                <Box key={index} mb={2}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Contact Name"
                        value={contact.name}
                        onChange={(e) =>
                          updateMobileContact(index, "name", e.target.value)
                        }
                        placeholder="e.g., John Smith"
                        fullWidth
                        size="small"
                        InputProps={{
                          sx: { userSelect: "text" },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Mobile Number"
                        value={contact.number}
                        onChange={(e) =>
                          updateMobileContact(index, "number", e.target.value)
                        }
                        placeholder="+64 21 123 4567"
                        fullWidth
                        size="small"
                        InputProps={{
                          sx: { userSelect: "text" },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <IconButton
                        onClick={() => removeMobileContact(index)}
                        color="error"
                        size="small"
                      >
                        <Icon icon="mdi:delete" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              {formData.mobile_contacts.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Add mobile contacts for key personnel
                </Typography>
              )}
            </Box>

            <TextField
              label="Website (Optional)"
              value={formData.website}
              onChange={handleWebsiteChange}
              onBlur={handleWebsiteBlur}
              fullWidth
              placeholder="yourwebsite.com"
              helperText="Your business website (without http://)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="body2" color="text.secondary">
                      https://
                    </Typography>
                  </InputAdornment>
                ),
                sx: { userSelect: "text" },
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default LocationContactStep;

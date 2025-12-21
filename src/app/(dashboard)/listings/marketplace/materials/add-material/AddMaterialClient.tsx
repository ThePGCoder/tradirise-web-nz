// app/listings/marketplace/material/add/AddMaterialClient.tsx
"use client";

import React, { useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Box, Alert, LinearProgress, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import CustomStepper from "@/components/CustomStepper";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";

import MaterialDetailsStep from "./steps/MaterialDetailsStep";

import MaterialLocationStep from "./steps/MaterialLocationStep";
import MaterialImagesContactStep from "./steps/MaterialImagesContactStep";
import MaterialReviewStep from "./steps/MaterialReviewStep";
import { createMaterialAction } from "./material-actions";
import { MaterialFormData } from "../material-form-types";
import MaterialQuantityPricingStep from "./steps/MaterialQuantityPricingStep";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AddMaterialClientProps {
  currentUser: User;
}

const steps = [
  "Material Details",
  "Quantity & Pricing",
  "Location",
  "Images & Contact",
  "Review & Submit",
];

const AddMaterialClient: React.FC<AddMaterialClientProps> = ({
  currentUser,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<MaterialFormData>({
    title: "",
    description: "",
    material_type: "",
    category: "",
    condition: "",
    quantity: 0,
    unit: "",
    price: 0,
    price_type: "fixed",
    images: [],
    contact_name: `${currentUser.first_name} ${currentUser.last_name}`,
    contact_email: currentUser.email,
    contact_phone: "",
    delivery_available: false,
    region: "",
    is_business_listing: false,
  });

  useEffect(() => {
    changeActiveRoute("Add Materials");
  }, [changeActiveRoute]);

  const handleInputChange = <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Material Details
        return !!(
          formData.title?.trim() &&
          formData.description?.trim().length >= 20 &&
          formData.material_type?.trim() &&
          formData.category?.trim() &&
          formData.condition?.trim()
        );
      case 1: // Quantity & Pricing
        return !!(
          formData.quantity > 0 &&
          formData.unit?.trim() &&
          formData.price > 0 &&
          formData.price_type?.trim()
        );
      case 2: // Location
        return !!formData.region?.trim();
      case 3: // Images & Contact
        return !!(
          formData.contact_name?.trim() &&
          formData.contact_email?.trim() &&
          /\S+@\S+\.\S+/.test(formData.contact_email) &&
          formData.contact_phone?.trim()
        );
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const result = await createMaterialAction(formData);
        if (result.success) {
          setSuccess("Material listing created successfully!");
          setTimeout(
            () => router.push("/listings/marketplace?tab=materials"),
            2000
          );
        } else {
          setError(result.error || "Failed to create listing");
        }
      } catch (err) {
        console.error("Submit error:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      }
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <MaterialDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <MaterialQuantityPricingStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <MaterialLocationStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <MaterialImagesContactStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return <MaterialReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        onClick={() => router.back()}
        startIcon={<Icon icon="mdi:arrow-left" />}
        sx={{ mb: 3 }}
        variant="outlined"
        disabled={isPending}
      >
        Back to Marketplace
      </Button>
      <CustomCard sx={{ overflow: "visible" }}>
        <Box sx={{ p: 3, overflow: "visible" }}>
          <Typography variant="h5" gutterBottom>
            Create Material Listing
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            List your building materials, aggregates, or supplies for sale in
            the marketplace.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Listing Tips</strong>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2.5 }}>
              <Typography component="li" variant="body2">
                Upload clear photos showing material condition and quality
              </Typography>
              <Typography component="li" variant="body2">
                Include accurate quantity and unit measurements
              </Typography>
              <Typography component="li" variant="body2">
                Specify grade, quality level, and any certifications
              </Typography>
              <Typography component="li" variant="body2">
                Be transparent about storage conditions and material age
              </Typography>
            </Box>
          </Alert>
          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Creating listing...
              </Typography>
            </Box>
          )}
          <CustomStepper
            steps={steps}
            activeStep={activeStep}
            stepSpacing={160}
          />
          <Box sx={{ mb: 4, mt: 4, overflow: "visible" }}>
            {renderStepContent(activeStep)}
          </Box>
          <Flex justifyContent="space-between">
            <Button
              disabled={activeStep === 0 || isPending}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={isPending || !isStepValid(activeStep)}
                startIcon={
                  isPending ? (
                    <Icon icon="mdi:loading" className="animate-spin" />
                  ) : (
                    <Icon icon="mdi:check" />
                  )
                }
              >
                {isPending ? "Creating Listing..." : "Create Listing"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={!isStepValid(activeStep) || isPending}
              >
                Next
              </Button>
            )}
          </Flex>
        </Box>
      </CustomCard>
    </>
  );
};

export default AddMaterialClient;

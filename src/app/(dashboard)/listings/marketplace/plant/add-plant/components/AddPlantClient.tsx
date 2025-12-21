// app/listings/marketplace/plant/add/components/AddPlantClient.tsx
"use client";

import React, { useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Box, Alert, LinearProgress, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import CustomStepper from "@/components/CustomStepper";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import { PlantFormData } from "../plant-form-types";
import PlantDetailsStep from "../steps/PlantDetailStep";
import PlantFeaturesLocationStep from "../steps/PlantFeaturesLocationStep";
import PlantImagesContactStep from "../steps/PlantImagesContactStep";
import PlantPricingStep from "../steps/PlantPricingStep";
import PlantReviewStep from "../steps/PlantReviewStep";
import { createPlantAction } from "../plant-actions";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AddPlantClientProps {
  currentUser: User;
}

const steps = [
  "Equipment Details",
  "Pricing & Options",
  "Features & Location",
  "Images & Contact",
  "Review & Submit",
];

const AddPlantClient: React.FC<AddPlantClientProps> = ({ currentUser }) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<PlantFormData>({
    title: "",
    description: "",
    equipment_type: "",
    category: "",
    condition: "",
    sale_price: 0,
    price_type: "negotiable",
    features: [],
    region: "",
    images: [],
    contact_name: `${currentUser.first_name} ${currentUser.last_name}`,
    contact_email: currentUser.email,
    contact_phone: "",
    delivery_available: false,
    is_business_listing: false,
  });

  useEffect(() => {
    changeActiveRoute("Add Plant & Equipment");
  }, [changeActiveRoute]);

  const handleInputChange = <K extends keyof PlantFormData>(
    field: K,
    value: PlantFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(
          formData.title?.trim() &&
          formData.description?.trim().length >= 20 &&
          formData.equipment_type?.trim() &&
          formData.category?.trim() &&
          formData.condition?.trim()
        );
      case 1:
        return !!(formData.sale_price > 0 && formData.price_type?.trim());
      case 2:
        return !!formData.region?.trim();
      case 3:
        return !!(
          formData.contact_name?.trim() &&
          formData.contact_email?.trim() &&
          /\S+@\S+\.\S+/.test(formData.contact_email) &&
          formData.contact_phone?.trim()
        );
      case 4:
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
        const result = await createPlantAction(formData);
        if (result.success) {
          setSuccess("Plant & equipment listing created successfully!");
          setTimeout(
            () => router.push("/listings/marketplace?tab=plant"),
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
          <PlantDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <PlantPricingStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <PlantFeaturesLocationStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <PlantImagesContactStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return <PlantReviewStep formData={formData} />;
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
            Create Plant & Equipment Listing
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            List your plant or equipment for sale or hire in the marketplace.
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
                Upload clear photos showing equipment condition
              </Typography>
              <Typography component="li" variant="body2">
                Include service history and maintenance records
              </Typography>
              <Typography component="li" variant="body2">
                Be transparent about hours used and any issues
              </Typography>
              <Typography component="li" variant="body2">
                Set competitive rates based on market research
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

export default AddPlantClient;

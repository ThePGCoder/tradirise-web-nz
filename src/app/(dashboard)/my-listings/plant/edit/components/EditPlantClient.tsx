// app/my-listings/plant/edit/[id]/components/EditPlantClient.tsx
"use client";

import React, { useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  Avatar,
  Typography,
  LinearProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import CustomStepper from "@/components/CustomStepper";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import { PlantFormData } from "@/app/(dashboard)/listings/marketplace/plant/add-plant/plant-form-types";
import PlantDetailsStep from "@/app/(dashboard)/listings/marketplace/plant/add-plant/steps/PlantDetailStep";
import PlantFeaturesLocationStep from "@/app/(dashboard)/listings/marketplace/plant/add-plant/steps/PlantFeaturesLocationStep";
import PlantImagesContactStep from "@/app/(dashboard)/listings/marketplace/plant/add-plant/steps/PlantImagesContactStep";
import PlantPricingStep from "@/app/(dashboard)/listings/marketplace/plant/add-plant/steps/PlantPricingStep";
import PlantReviewStep from "@/app/(dashboard)/listings/marketplace/plant/add-plant/steps/PlantReviewStep";
import { updatePlantListing } from "../../../actions";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface PlantAd {
  id: string;
  title: string;
  description: string;
  equipment_type: string;
  category: string;
  make?: string;
  model?: string;
  year?: number;
  condition: string;
  sale_price?: number;
  price_type: string;
  hours_used?: number;
  delivery_available: boolean;
  region: string;
  features: string[];
  images: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

interface EditPlantClientProps {
  currentUser: User;
  plantAd: PlantAd;
}

const steps = [
  "Equipment Details",
  "Pricing",
  "Features & Location",
  "Images & Contact",
  "Review & Submit",
];

const EditPlantClient: React.FC<EditPlantClientProps> = ({
  currentUser,
  plantAd,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<PlantFormData>({
    title: plantAd.title,
    description: plantAd.description,
    equipment_type: plantAd.equipment_type,
    category: plantAd.category,
    make: plantAd.make,
    model: plantAd.model,
    year: plantAd.year,
    condition: plantAd.condition,
    sale_price: plantAd.sale_price || 0,
    price_type: plantAd.price_type,
    hours_used: plantAd.hours_used,
    delivery_available: plantAd.delivery_available,
    region: plantAd.region,
    features: plantAd.features || [],
    images: plantAd.images || [],
    contact_name: plantAd.contact_name,
    contact_email: plantAd.contact_email,
    contact_phone: plantAd.contact_phone,
    is_business_listing: false,
  });

  useEffect(() => {
    changeActiveRoute("Edit Equipment");
  }, [changeActiveRoute]);

  const handleInputChange = <K extends keyof PlantFormData>(
    field: K,
    value: PlantFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(
          formData.title?.trim().length >= 5 &&
          formData.equipment_type?.trim() &&
          formData.category?.trim() &&
          formData.condition?.trim() &&
          formData.description?.trim().length >= 20
        );
      case 1:
        return !!(formData.sale_price && formData.price_type);
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
        const result = await updatePlantListing(plantAd.id, formData);

        if (result.success) {
          setSuccess("Equipment listing updated successfully!");
          setTimeout(() => {
            router.push("/my-listings");
          }, 2000);
        } else {
          setError(result.error || "Failed to update equipment listing");
        }
      } catch (err) {
        console.error("Submit error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again."
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
        Back to Listings
      </Button>

      <CustomCard sx={{ overflow: "visible" }}>
        <Box sx={{ p: 3, overflow: "visible" }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Flex alignItems="center" gap={2}>
                <Avatar
                  src={currentUser.avatar_url}
                  sx={{ width: 60, height: 60 }}
                >
                  <Icon icon="mdi:excavator" width={30} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Edit Equipment Listing</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.title}
                  </Typography>
                </Box>
              </Flex>
            </CardContent>
          </Card>

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
            <strong>Update Your Equipment Listing</strong>
            <br />
            Keep your information current to attract potential buyers or hirers.
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Updating equipment listing...
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
                disabled={isPending}
                startIcon={
                  isPending ? (
                    <Icon icon="mdi:loading" className="animate-spin" />
                  ) : (
                    <Icon icon="mdi:check" />
                  )
                }
              >
                {isPending ? "Updating Listing..." : "Update Listing"}
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

export default EditPlantClient;

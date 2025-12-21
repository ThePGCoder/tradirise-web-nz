// app/listings/marketplace/vehicles/add/components/AddVehicleClient.tsx
"use client";

import React, { useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Box, Alert, LinearProgress, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import CustomStepper from "@/components/CustomStepper";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import { VehicleFormData } from "../vehicle-form-types";
import VehicleDetailsStep from "./steps/VehicleDetailsStep";
import SpecificationsStep from "./steps/SpecificationsStep";

import ImagesContactStep from "./steps/ImagesContactStep";
import VehicleReviewStep from "./steps/VehicleReviewStep";
import { createVehicleAction } from "../vehicle-actions";
import PricingLocationStep from "./steps/PricingLocationStep";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AddVehicleClientProps {
  currentUser: User;
}

const steps = [
  "Vehicle Details",
  "Specifications",
  "Pricing & Location",
  "Images & Contact",
  "Review & Submit",
];

const AddVehicleClient: React.FC<AddVehicleClientProps> = ({ currentUser }) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleFormData>({
    title: "",
    description: "",
    vehicle_type: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    condition: "",
    price: 0,
    price_type: "negotiable",
    mileage: undefined,
    registration_expires: undefined,
    wof_expires: undefined,
    transmission: undefined,
    fuel_type: undefined,
    features: [],
    region: "",
    images: [],
    contact_name: `${currentUser.first_name} ${currentUser.last_name}`,
    contact_email: currentUser.email,
    contact_phone: "",
    is_business_listing: false,
    business_id: undefined,
  });

  useEffect(() => {
    changeActiveRoute("Add Vehicle");
  }, [changeActiveRoute]);

  const handleInputChange = <K extends keyof VehicleFormData>(
    field: K,
    value: VehicleFormData[K]
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
      case 0: // Vehicle Details
        return !!(
          formData.title?.trim() &&
          formData.description?.trim().length >= 20 &&
          formData.vehicle_type?.trim() &&
          formData.make?.trim() &&
          formData.model?.trim() &&
          formData.year >= 1900 &&
          formData.year <= new Date().getFullYear() + 1 &&
          formData.condition?.trim()
        );
      case 1: // Specifications (all optional)
        return true;
      case 2: // Pricing & Location
        return !!(
          formData.price > 0 &&
          formData.price_type?.trim() &&
          formData.region?.trim()
        );
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
        const result = await createVehicleAction(formData);

        if (result.success) {
          setSuccess("Vehicle listing created successfully!");
          setTimeout(() => {
            router.push("/listings/marketplace?tab=vehicles");
          }, 2000);
        } else {
          setError(result.error || "Failed to create vehicle listing");
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
          <VehicleDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <SpecificationsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <PricingLocationStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <ImagesContactStep
            formData={formData}
            onInputChange={handleInputChange}
            currentUserEmail={currentUser.email}
            currentUserName={`${currentUser.first_name} ${currentUser.last_name}`}
          />
        );
      case 4:
        return <VehicleReviewStep formData={formData} />;
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
            Create Vehicle Listing
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sell your vehicle by creating a detailed listing that potential
            buyers can view in the marketplace.
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
            <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
              <li>Upload clear photos from multiple angles</li>
              <li>Provide honest and detailed descriptions</li>
              <li>Include service history and any issues</li>
              <li>Price competitively based on market research</li>
            </ul>
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Creating vehicle listing...
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

export default AddVehicleClient;

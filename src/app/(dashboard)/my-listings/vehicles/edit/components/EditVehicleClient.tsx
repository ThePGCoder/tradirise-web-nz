// app/my-listings/vehicles/edit/[id]/components/EditVehicleClient.tsx
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
import { updateVehicleListing } from "../../../actions";
import ImagesContactStep from "@/app/(dashboard)/listings/marketplace/vehicles/add-vehicle/components/steps/ImagesContactStep";
import PricingLocationStep from "@/app/(dashboard)/listings/marketplace/vehicles/add-vehicle/components/steps/PricingLocationStep";
import SpecificationsStep from "@/app/(dashboard)/listings/marketplace/vehicles/add-vehicle/components/steps/SpecificationsStep";
import VehicleDetailsStep from "@/app/(dashboard)/listings/marketplace/vehicles/add-vehicle/components/steps/VehicleDetailsStep";
import VehicleReviewStep from "@/app/(dashboard)/listings/marketplace/vehicles/add-vehicle/components/steps/VehicleReviewStep";
import { VehicleFormData } from "@/app/(dashboard)/listings/marketplace/vehicles/add-vehicle/vehicle-form-types";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface VehicleAd {
  id: string;
  title: string;
  description: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  price: number;
  price_type: string;
  mileage?: number;
  registration_expires?: string;
  wof_expires?: string;
  transmission?: string;
  fuel_type?: string;
  body_type?: string;
  engine_size?: string;
  doors?: number;
  seats?: number;
  color?: string;
  vin?: string;
  region: string;
  features?: string[];
  images?: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

interface EditVehicleClientProps {
  currentUser: User;
  vehicleAd: VehicleAd;
}

const steps = [
  "Vehicle Details",
  "Specifications",
  "Pricing & Location",
  "Images & Contact",
  "Review & Submit",
];

const EditVehicleClient: React.FC<EditVehicleClientProps> = ({
  currentUser,
  vehicleAd,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleFormData>({
    title: vehicleAd.title,
    description: vehicleAd.description,
    vehicle_type: vehicleAd.vehicle_type,
    make: vehicleAd.make,
    model: vehicleAd.model,
    year: vehicleAd.year,
    condition: vehicleAd.condition,
    price: vehicleAd.price,
    price_type: vehicleAd.price_type,
    mileage: vehicleAd.mileage,
    registration_expires: vehicleAd.registration_expires,
    wof_expires: vehicleAd.wof_expires,
    transmission: vehicleAd.transmission,
    fuel_type: vehicleAd.fuel_type,
    region: vehicleAd.region,
    features: vehicleAd.features || [],
    images: vehicleAd.images || [],
    contact_name: vehicleAd.contact_name,
    contact_email: vehicleAd.contact_email,
    contact_phone: vehicleAd.contact_phone,
    is_business_listing: false,
  });

  useEffect(() => {
    changeActiveRoute("Edit Vehicle");
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

  const currentYear = new Date().getFullYear();

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(
          formData.title?.trim().length >= 5 &&
          formData.vehicle_type?.trim() &&
          formData.make?.trim() &&
          formData.model?.trim() &&
          formData.year >= 1900 &&
          formData.year <= currentYear + 1 &&
          formData.condition?.trim() &&
          formData.description?.trim().length >= 20
        );
      case 1:
        return true; // Specifications are optional
      case 2:
        return !!(
          formData.price > 0 &&
          formData.price_type?.trim() &&
          formData.region?.trim()
        );
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
        const result = await updateVehicleListing(vehicleAd.id, formData);

        if (result.success) {
          setSuccess("Vehicle listing updated successfully!");
          setTimeout(() => {
            router.push("/my-listings");
            router.refresh();
          }, 2000);
        } else {
          setError(result.error || "Failed to update vehicle listing");
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
                  <Icon icon="mdi:car" width={30} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Edit Vehicle Listing</Typography>
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
            <strong>Update Your Vehicle Listing</strong>
            <br />
            Keep your information current to attract potential buyers.
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Updating vehicle listing...
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

export default EditVehicleClient;

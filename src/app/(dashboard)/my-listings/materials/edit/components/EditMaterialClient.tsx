// app/my-listings/materials/edit/[id]/components/EditMaterialClient.tsx
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
import { updateMaterialListing } from "../../../actions";
import MaterialDetailsStep from "@/app/(dashboard)/listings/marketplace/materials/add-material/steps/MaterialDetailsStep";
import MaterialImagesContactStep from "@/app/(dashboard)/listings/marketplace/materials/add-material/steps/MaterialImagesContactStep";
import MaterialLocationStep from "@/app/(dashboard)/listings/marketplace/materials/add-material/steps/MaterialLocationStep";
import MaterialQuantityPricingStep from "@/app/(dashboard)/listings/marketplace/materials/add-material/steps/MaterialQuantityPricingStep";
import MaterialReviewStep from "@/app/(dashboard)/listings/marketplace/materials/add-material/steps/MaterialReviewStep";
import { MaterialFormData } from "@/app/(dashboard)/listings/marketplace/materials/material-form-types";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface MaterialAd {
  id: string;
  title: string;
  description: string;
  material_type: string;
  category: string;
  condition: string;
  quantity: number;
  unit: string;
  price: number;
  price_type: string;
  price_unit?: string;
  grade_quality?: string;
  dimensions?: string;
  brand?: string;
  delivery_available: boolean;
  delivery_cost?: string;
  minimum_order?: string;
  available_quantity?: number;
  location_details?: string;
  region: string;
  images?: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

interface EditMaterialClientProps {
  currentUser: User;
  materialAd: MaterialAd;
}

const steps = [
  "Material Details",
  "Quantity & Pricing",
  "Location",
  "Images & Contact",
  "Review & Submit",
];

const EditMaterialClient: React.FC<EditMaterialClientProps> = ({
  currentUser,
  materialAd,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<MaterialFormData>({
    title: materialAd.title,
    description: materialAd.description,
    material_type: materialAd.material_type,
    category: materialAd.category,
    condition: materialAd.condition,
    quantity: materialAd.quantity,
    unit: materialAd.unit,
    price: materialAd.price,
    price_type: materialAd.price_type,
    price_unit: materialAd.price_unit,
    grade_quality: materialAd.grade_quality,
    dimensions: materialAd.dimensions,
    brand: materialAd.brand,
    delivery_available: materialAd.delivery_available,
    delivery_cost: materialAd.delivery_cost,
    minimum_order: materialAd.minimum_order,
    available_quantity: materialAd.available_quantity,
    location_details: materialAd.location_details,
    region: materialAd.region,
    images: materialAd.images || [],
    contact_name: materialAd.contact_name,
    contact_email: materialAd.contact_email,
    contact_phone: materialAd.contact_phone,
    is_business_listing: false,
  });

  useEffect(() => {
    changeActiveRoute("Edit Material");
  }, [changeActiveRoute]);

  const handleInputChange = <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K]
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
          formData.material_type?.trim() &&
          formData.category?.trim() &&
          formData.condition?.trim() &&
          formData.description?.trim().length >= 20
        );
      case 1:
        return !!(
          formData.quantity > 0 &&
          formData.unit?.trim() &&
          formData.price > 0 &&
          formData.price_type?.trim()
        );
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
        const result = await updateMaterialListing(materialAd.id, formData);

        if (result.success) {
          setSuccess("Material listing updated successfully!");
          setTimeout(() => {
            router.push("/my-listings");
            router.refresh();
          }, 2000);
        } else {
          setError(result.error || "Failed to update material listing");
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
                  <Icon icon="mdi:package-variant" width={30} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Edit Material Listing</Typography>
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
            <strong>Update Your Material Listing</strong>
            <br />
            Keep your information current to attract potential buyers.
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Updating material listing...
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

export default EditMaterialClient;

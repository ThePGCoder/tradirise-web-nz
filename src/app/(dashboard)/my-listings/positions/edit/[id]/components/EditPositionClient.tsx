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

import RequirementsBenefitsStep from "@/app/(dashboard)/listings/positions/add-position/components/steps/RequirementsBenefitsStep";
import LocationRateStep from "@/app/(dashboard)/listings/positions/add-position/components/steps/LocationRateStep";
import BasicDetailsStep from "@/app/(dashboard)/listings/positions/add-position/components/steps/BasicDetailsStep";
import ReviewStep from "@/app/(dashboard)/listings/positions/add-position/components/steps/ReviewStep";
import { PositionFormData } from "@/app/(dashboard)/listings/positions/add-position/position-form-types";
import { updatePositionAction } from "@/app/(dashboard)/listings/positions/add-position/position-actions";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
  contact_email: string;
  phone_number?: string;
  website?: string;
}

interface PositionAd {
  id: string;
  title: string;
  trade: string;
  description: string;
  region: string;
  rate: string;
  rate_type?: "hourly" | "daily" | "weekly" | "project";
  remuneration: "wages" | "labour_only" | "negotiable";
  start_date: string;
  good_to_have: string[];
  requirements: string[];
  benefits: string[];
  website?: string;
  contact_email: string;
  contact_phone?: string;
  posted_by: string;
  is_business_listing: boolean;
  business_id?: string;
}

interface EditPositionClientProps {
  currentUser: User;
  positionAd: PositionAd;
  business?: Business;
}

const steps = [
  "Basic Details",
  "Location & Rate",
  "Requirements & Benefits",
  "Review & Submit",
];

const EditPositionClient: React.FC<EditPositionClientProps> = ({
  currentUser,
  positionAd,
  business,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Parse region to extract suburb and city
  const parseRegion = (regionString: string) => {
    if (regionString.includes(",")) {
      const parts = regionString.split(",").map((p) => p.trim());
      return {
        suburb: parts[0] || "",
        city: parts[1] || "",
      };
    }
    return {
      suburb: "",
      city: regionString,
    };
  };

  const parsedLocation = parseRegion(positionAd.region);

  const [formData, setFormData] = useState<PositionFormData>({
    title: positionAd.title,
    trade: positionAd.trade,
    description: positionAd.description,
    region: positionAd.region.split(",").pop()?.trim() || positionAd.region,
    suburb: parsedLocation.suburb,
    city: parsedLocation.city,
    rate: positionAd.rate,
    rate_type: positionAd.rate_type,
    remuneration: positionAd.remuneration,
    start_date: positionAd.start_date,
    good_to_have: positionAd.good_to_have,
    requirements: positionAd.requirements,
    benefits: positionAd.benefits,
    website: positionAd.website || "",
    contact_email: positionAd.contact_email,
    contact_phone: positionAd.contact_phone || "",
    posted_by: positionAd.posted_by,
    is_business_listing: positionAd.is_business_listing,
    business_id: positionAd.business_id,
  });

  useEffect(() => {
    changeActiveRoute("Edit Position");
  }, [changeActiveRoute]);

  const handleInputChange = <K extends keyof PositionFormData>(
    field: K,
    value: PositionFormData[K]
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
          formData.trade?.trim() &&
          formData.description?.trim().length >= 50
        );
      case 1:
        return !!(
          formData.region?.trim() &&
          formData.city?.trim() &&
          formData.rate?.trim() &&
          formData.remuneration &&
          formData.start_date?.trim() &&
          formData.contact_email?.trim() &&
          /\S+@\S+\.\S+/.test(formData.contact_email)
        );
      case 2:
        return formData.requirements.length > 0;
      case 3:
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
        const submissionData = {
          ...formData,
          website: formData.website
            ? formData.website.startsWith("http")
              ? formData.website
              : `https://${formData.website}`
            : undefined,
        };

        const result = await updatePositionAction(
          positionAd.id,
          submissionData
        );

        if (result.success) {
          setSuccess("Position listing updated successfully!");
          setTimeout(() => {
            router.push("/listings/positions");
          }, 2000);
        } else {
          setError(result.error || "Failed to update position listing");
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
          <BasicDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <LocationRateStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <RequirementsBenefitsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <ReviewStep formData={formData} selectedBusiness={business || null} />
        );
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
        Back to Positions
      </Button>

      <CustomCard sx={{ overflow: "visible" }}>
        <Box sx={{ p: 3, overflow: "visible" }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Flex alignItems="center" gap={2}>
                <Avatar
                  src={
                    formData.is_business_listing
                      ? business?.logo_url
                      : currentUser.avatar_url
                  }
                  sx={{ width: 60, height: 60 }}
                >
                  {formData.is_business_listing
                    ? business?.business_name[0]
                    : currentUser.first_name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">Edit Position Listing</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.is_business_listing
                      ? `Posted for ${business?.business_name}`
                      : `Posted by ${currentUser.username}`}
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

          {formData.is_business_listing && (
            <Alert severity="info" sx={{ mb: 3 }}>
              This listing appears with your business branding and contact
              details.
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Update Your Position</strong>
            <br />
            Keep your listing current to attract the right candidates.
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Updating position listing...
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

export default EditPositionClient;

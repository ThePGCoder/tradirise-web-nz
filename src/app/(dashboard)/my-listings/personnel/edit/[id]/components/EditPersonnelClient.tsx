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

import PersonalInfoStep from "@/app/(dashboard)/listings/personnel/add-personnel/components/steps/PersonalInfoStep";
import TradeDetailsStep from "@/app/(dashboard)/listings/personnel/add-personnel/components/steps/TradeDetailsStep";
import LocationAvailabilityStep from "@/app/(dashboard)/listings/personnel/add-personnel/components/steps/LocationAvailabilityStep";
import SkillsCredentialsStep from "@/app/(dashboard)/listings/personnel/add-personnel/components/steps/SkillsCredentialsStep";
import ReviewStep from "@/app/(dashboard)/listings/personnel/add-personnel/components/steps/ReviewStep";
import {
  PersonnelFormData,
  SkillItem,
  AccreditationItem,
} from "@/app/(dashboard)/listings/personnel/add-personnel/personnel-form-types";
import { updatePersonnelAction } from "@/app/(dashboard)/listings/personnel/add-personnel/personnel-actions";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface PersonnelAd {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  contact_email: string;
  mobile: string;
  website?: string;
  region: string;
  suburb?: string;
  city: string;
  primary_trade_role: string;
  secondary_trade_roles: string[];
  max_servicable_radius: number;
  skills: string[];
  accreditations: string[];
  available_from: string;
  is_for_self: boolean;
  posted_by_name: string;
}

interface EditPersonnelClientProps {
  currentUser: User;
  personnelAd: PersonnelAd;
}

const steps = [
  "Personal Information",
  "Trade Details",
  "Location & Availability",
  "Skills & Credentials",
  "Review & Submit",
];

// Helper function to convert string format back to object format
// "Plumber: Drainage" -> {trade: "Plumber", skill: "Drainage"}
const parseSkillString = (skillString: string): SkillItem | null => {
  if (!skillString || !skillString.includes(":")) return null;

  const parts = skillString.split(":");
  if (parts.length !== 2) return null;

  return {
    trade: parts[0].trim(),
    skill: parts[1].trim(),
  };
};

// Helper function to convert accreditation string back to object format
// "Electrical: Registered Electrician" -> {category: "Electrical", accreditation: "Registered Electrician"}
const parseAccreditationString = (
  accreditationString: string
): AccreditationItem | null => {
  if (!accreditationString || !accreditationString.includes(":")) return null;

  const parts = accreditationString.split(":");
  if (parts.length !== 2) return null;

  return {
    category: parts[0].trim(),
    accreditation: parts[1].trim(),
  };
};

const EditPersonnelClient: React.FC<EditPersonnelClientProps> = ({
  currentUser,
  personnelAd,
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

  const parsedLocation = parseRegion(personnelAd.region);

  // Convert string arrays to object arrays for the form
  const parsedSkills: SkillItem[] = personnelAd.skills
    .map(parseSkillString)
    .filter((skill): skill is SkillItem => skill !== null);

  const parsedAccreditations: AccreditationItem[] = personnelAd.accreditations
    .map(parseAccreditationString)
    .filter((acc): acc is AccreditationItem => acc !== null);

  const [formData, setFormData] = useState<PersonnelFormData>({
    first_name: personnelAd.first_name,
    last_name: personnelAd.last_name,
    bio: personnelAd.bio,
    contact_email: personnelAd.contact_email,
    mobile: personnelAd.mobile,
    website: personnelAd.website || "",
    region: personnelAd.region.split(",").pop()?.trim() || personnelAd.region,
    suburb: parsedLocation.suburb,
    city: parsedLocation.city,
    primary_trade_role: personnelAd.primary_trade_role,
    secondary_trade_roles: personnelAd.secondary_trade_roles,
    max_servicable_radius: personnelAd.max_servicable_radius,
    skills: parsedSkills, // Now converted to objects
    accreditations: parsedAccreditations, // Now converted to objects
    available_from: personnelAd.available_from,
    is_for_self: personnelAd.is_for_self,
    posted_by_name: personnelAd.posted_by_name,
  });

  useEffect(() => {
    changeActiveRoute("Edit Personnel");
  }, [changeActiveRoute]);

  const handleInputChange = <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K]
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
          formData.first_name?.trim().length >= 2 &&
          formData.last_name?.trim().length >= 2 &&
          formData.contact_email?.trim() &&
          /\S+@\S+\.\S+/.test(formData.contact_email) &&
          formData.mobile?.trim()
        );
      case 1:
        return !!(
          formData.primary_trade_role?.trim() &&
          formData.bio?.trim().length >= 20
        );
      case 2:
        return !!(
          formData.region?.trim() &&
          formData.city?.trim() &&
          formData.available_from?.trim() &&
          formData.max_servicable_radius > 0
        );
      case 3:
        return formData.skills.length > 0;
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
        const submissionData = {
          ...formData,
          website: formData.website
            ? formData.website.startsWith("http")
              ? formData.website
              : `https://${formData.website}`
            : undefined,
          posted_by_name: formData.is_for_self
            ? `${formData.first_name} ${formData.last_name}`
            : formData.posted_by_name,
        };

        const result = await updatePersonnelAction(
          personnelAd.id,
          submissionData
        );

        if (result.success) {
          setSuccess("Personnel listing updated successfully!");
          setTimeout(() => {
            router.push("/listings/personnel");
          }, 2000);
        } else {
          setError(result.error || "Failed to update personnel listing");
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
          <PersonalInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            activeStep={activeStep}
          />
        );
      case 1:
        return (
          <TradeDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
            activeStep={activeStep}
          />
        );
      case 2:
        return (
          <LocationAvailabilityStep
            formData={formData}
            onInputChange={handleInputChange}
            activeStep={activeStep}
          />
        );
      case 3:
        return (
          <SkillsCredentialsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return <ReviewStep formData={formData} />;
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
        Back to Personnel
      </Button>

      <CustomCard sx={{ overflow: "visible" }}>
        <Box sx={{ p: 3, overflow: "visible" }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Flex alignItems="center" gap={2}>
                <Avatar
                  src={
                    formData.is_for_self ? currentUser.avatar_url : undefined
                  }
                  sx={{ width: 60, height: 60 }}
                >
                  {formData.first_name?.[0]}
                  {formData.last_name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">Edit Personnel Listing</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.is_for_self
                      ? `Editing listing for ${formData.first_name} ${formData.last_name}`
                      : `Editing listing posted by ${formData.posted_by_name}`}
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

          {!formData.is_for_self && (
            <Alert severity="info" sx={{ mb: 3 }}>
              This listing was created on behalf of another worker. Their
              contact details will be shown to potential employers.
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Update Your Trade Profile</strong>
            <br />
            Keep your information current to attract the right opportunities.
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Updating personnel listing...
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

export default EditPersonnelClient;

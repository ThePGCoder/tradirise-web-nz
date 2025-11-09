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

import { ProjectFormData } from "@/app/(dashboard)/listings/projects/add-project/project-form-types";

import BudgetTimelineStep from "@/app/(dashboard)/listings/projects/add-project/components/steps/BudgetTimelineStep";
import ContactDetailsStep from "@/app/(dashboard)/listings/projects/add-project/components/steps/ContactDetailsStep";
import ProjectOverviewStep from "@/app/(dashboard)/listings/projects/add-project/components/steps/ProjectOverviewStep";
import { updateProjectAction } from "@/app/(dashboard)/listings/projects/add-project/project-actions";
import ReviewStep from "@/app/(dashboard)/listings/projects/add-project/components/steps/ReviewStep";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string;
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

interface ProjectAd {
  id: string;
  title: string;
  required_trades: string[];
  description: string;
  region: string;
  price_range: string;
  project_type: string;
  project_duration: string;
  proposed_start_date: string;
  materials_provided: string[];
  contact_email: string;
  contact_phone?: string;
  company_name: string;
  posted_by: string;
  is_business_listing: boolean;
  business_id?: string;
}

interface EditProjectClientProps {
  currentUser: User;
  projectAd: ProjectAd;
  business?: Business;
}

const steps = [
  "Project Overview",
  "Budget & Timeline",
  "Contact Details",
  "Review & Submit",
];

const EditProjectClient: React.FC<EditProjectClientProps> = ({
  currentUser,
  projectAd,
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

  // Parse budget from price_range
  const parseBudget = (priceRange: string) => {
    if (priceRange.includes("-")) {
      // Budget range: "$5000 - $10000"
      const parts = priceRange
        .split("-")
        .map((p) => p.trim().replace(/\$/g, ""));
      return {
        budget_type: "range",
        budget_min: parts[0] || "",
        budget_max: parts[1] || "",
        price_range: "",
      };
    } else if (priceRange.includes("/hour")) {
      // Hourly: "$50/hour"
      return {
        budget_type: "hourly",
        budget_min: "",
        budget_max: "",
        price_range: priceRange.replace(/\$/g, "").replace("/hour", ""),
      };
    } else if (priceRange.includes("per trade")) {
      // Per trade: "$2000 per trade"
      return {
        budget_type: "per_trade",
        budget_min: "",
        budget_max: "",
        price_range: priceRange,
      };
    } else {
      // Fixed: "$5000"
      return {
        budget_type: "fixed",
        budget_min: "",
        budget_max: "",
        price_range: priceRange.replace(/\$/g, ""),
      };
    }
  };

  const parsedLocation = parseRegion(projectAd.region);
  const parsedBudget = parseBudget(projectAd.price_range);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: projectAd.title,
    required_trades: projectAd.required_trades,
    description: projectAd.description,
    region: projectAd.region.split(",").pop()?.trim() || projectAd.region,
    suburb: parsedLocation.suburb,
    city: parsedLocation.city,
    price_range: parsedBudget.price_range,
    budget_type: parsedBudget.budget_type,
    budget_min: parsedBudget.budget_min,
    budget_max: parsedBudget.budget_max,
    proposed_start_date: projectAd.proposed_start_date,
    project_duration: projectAd.project_duration,
    contact_email: projectAd.contact_email,
    contact_phone: projectAd.contact_phone || "",
    company_name: projectAd.company_name,
    project_type: projectAd.project_type,
    materials_provided: projectAd.materials_provided,
    posted_by: projectAd.posted_by,
    is_business_listing: projectAd.is_business_listing,
    business_id: projectAd.business_id,
  });

  useEffect(() => {
    changeActiveRoute("Edit Project");
  }, [changeActiveRoute]);

  const handleInputChange = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
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
          formData.title?.trim().length >= 3 &&
          formData.required_trades.length > 0 &&
          formData.description?.trim().length >= 10 &&
          formData.region?.trim() &&
          formData.city?.trim() &&
          formData.project_type?.trim()
        );
      case 1:
        return !!(
          formData.budget_type &&
          formData.proposed_start_date &&
          formData.project_duration &&
          (formData.budget_type === "range"
            ? formData.budget_min && formData.budget_max
            : formData.price_range)
        );
      case 2:
        return !!(
          formData.contact_email?.trim() &&
          /\S+@\S+\.\S+/.test(formData.contact_email) &&
          formData.company_name?.trim()
        );
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
        const result = await updateProjectAction(projectAd.id, formData);

        if (result.success) {
          setSuccess("Project listing updated successfully!");
          setTimeout(() => {
            router.push("/listings/projects");
          }, 2000);
        } else {
          setError(result.error || "Failed to update project listing");
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
          <ProjectOverviewStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <BudgetTimelineStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <ContactDetailsStep
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
        Back to Projects
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
                  <Typography variant="h6">Edit Project Listing</Typography>
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
            <strong>Update Your Project</strong>
            <br />
            Keep your listing current to attract the right contractors.
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Updating project listing...
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
                {isPending ? "Updating Project..." : "Update Project"}
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

export default EditProjectClient;

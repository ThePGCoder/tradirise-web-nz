// src/app/listings/projects/add-project/components/AddProjectClient.tsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import CustomStepper from "@/components/CustomStepper";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import dayjs from "dayjs";

import { ProjectFormData } from "../project-form-types";

import { createProjectAction } from "../project-actions";
import BudgetTimelineStep from "./steps/BudgetTimelineStep";
import ContactDetailsStep from "./steps/ContactDetailsStep";
import ProjectOverviewStep from "./steps/ProjectOverviewStep";
import ReviewStep from "./steps/ReviewStep";

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

interface AddProjectClientProps {
  currentUser: User;
  userBusinesses: Business[];
}

const steps = [
  "Project Overview",
  "Budget & Timeline",
  "Contact Details",
  "Review & Submit",
];

const AddProjectClient: React.FC<AddProjectClientProps> = ({
  currentUser,
  userBusinesses,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initialModalOpen, setInitialModalOpen] = useState(true);
  const [businessSelectionModalOpen, setBusinessSelectionModalOpen] =
    useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isTypeDecided, setIsTypeDecided] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    required_trades: [],
    description: "",
    region: "",
    suburb: "",
    city: "",
    price_range: "",
    budget_type: "",
    budget_min: "",
    budget_max: "",
    proposed_start_date: dayjs().add(2, "week").format("YYYY-MM-DD"),
    project_duration: "",
    contact_email: currentUser.email,
    contact_phone: currentUser.phone || "",
    company_name: `${currentUser.first_name} ${currentUser.last_name}`.trim(),
    project_type: "",
    materials_provided: [],
    posted_by: currentUser.username,
    is_business_listing: false,
    business_id: undefined,
  });

  useEffect(() => {
    changeActiveRoute("Add Project");
  }, [changeActiveRoute]);

  const handleListingTypeChoice = (type: "personal" | "business") => {
    if (type === "personal") {
      setFormData((prev) => ({
        ...prev,
        is_business_listing: false,
        business_id: undefined,
        contact_email: currentUser.email,
        contact_phone: currentUser.phone || "",
        company_name:
          `${currentUser.first_name} ${currentUser.last_name}`.trim(),
        posted_by: currentUser.username,
      }));
      setInitialModalOpen(false);
      setIsTypeDecided(true);
    } else {
      if (userBusinesses.length > 0) {
        setInitialModalOpen(false);
        setBusinessSelectionModalOpen(true);
      } else {
        setError(
          "You don't have any businesses registered. Please create a business first."
        );
      }
    }
  };

  const handleBusinessSelection = (business: Business) => {
    setSelectedBusiness(business);
    setFormData((prev) => ({
      ...prev,
      is_business_listing: true,
      business_id: business.id,
      contact_email: business.contact_email,
      contact_phone: business.phone_number || "",
      company_name: business.business_name,
      posted_by: currentUser.username,
    }));
    setBusinessSelectionModalOpen(false);
    setIsTypeDecided(true);
  };

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
        const result = await createProjectAction(formData);

        if (result.success) {
          setSuccess("Project listing created successfully!");
          setTimeout(() => {
            router.push("/listings/projects");
          }, 2000);
        } else {
          setError(result.error || "Failed to create project listing");
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

  const handleChangeListingType = () => {
    setIsTypeDecided(false);
    setSelectedBusiness(null);
    setBusinessSelectionModalOpen(false);
    setInitialModalOpen(true);
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
          <ReviewStep formData={formData} selectedBusiness={selectedBusiness} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* First Modal - Personal vs Business */}
      <Dialog open={initialModalOpen} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" textAlign="center">
            Who is posting this project?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center" mb={3}>
            Are you posting this project personally or on behalf of a business?
          </Typography>

          <Stack spacing={2}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => handleListingTypeChoice("personal")}
            >
              <CardContent>
                <Flex alignItems="center" gap={2}>
                  <Box sx={{ color: "primary.main", display: "flex" }}>
                    <Icon icon="mdi:account" width={40} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Personal Project
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Post as yourself for a personal project
                    </Typography>
                  </Box>
                </Flex>
              </CardContent>
            </Card>

            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => handleListingTypeChoice("business")}
            >
              <CardContent>
                <Flex alignItems="center" gap={2}>
                  <Box sx={{ color: "primary.main", display: "flex" }}>
                    <Icon icon="mdi:domain" width={40} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Business Project
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Post on behalf of your company or business
                    </Typography>
                  </Box>
                </Flex>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => router.back()} variant="text" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Second Modal - Business Selection */}
      <Dialog open={businessSelectionModalOpen} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" textAlign="center">
            Select Your Business
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center" mb={3}>
            Select which business you&#39;re posting for:
          </Typography>

          <Stack spacing={2}>
            {userBusinesses.map((business) => (
              <Card
                key={business.id}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleBusinessSelection(business)}
              >
                <CardContent>
                  <Flex alignItems="center" gap={2}>
                    <Avatar
                      src={business.logo_url}
                      sx={{ width: 50, height: 50 }}
                    >
                      {business.business_name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {business.business_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {business.contact_email}
                      </Typography>
                    </Box>
                  </Flex>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setBusinessSelectionModalOpen(false);
              setInitialModalOpen(true);
            }}
            color="inherit"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              setBusinessSelectionModalOpen(false);
              router.back();
            }}
            variant="text"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        onClick={() => router.back()}
        startIcon={<Icon icon="mdi:arrow-left" />}
        sx={{ mb: 3 }}
        variant="outlined"
        disabled={isPending || !isTypeDecided}
      >
        Back to Projects
      </Button>

      <CustomCard sx={{ overflow: "visible" }}>
        <Box sx={{ p: 3, overflow: "visible" }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Flex alignItems="center" gap={2} justifyContent="space-between">
                <Flex alignItems="center" gap={2}>
                  <Avatar
                    src={
                      formData.is_business_listing
                        ? selectedBusiness?.logo_url
                        : currentUser.avatar_url
                    }
                    sx={{ width: 60, height: 60 }}
                  >
                    {formData.is_business_listing
                      ? selectedBusiness?.business_name[0]
                      : currentUser.first_name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Create Project Listing</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.is_business_listing
                        ? `Posting for ${selectedBusiness?.business_name}`
                        : `Posting as ${currentUser.username}`}
                    </Typography>
                  </Box>
                </Flex>
                {isTypeDecided && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleChangeListingType}
                    startIcon={<Icon icon="mdi:swap-horizontal" />}
                  >
                    Change Type
                  </Button>
                )}
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
              This listing will appear with your business branding and contact
              details.
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Post a Project</strong>
            <br />
            Find skilled professionals and contractors for your construction
            project.
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Creating project listing...
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
                {isPending ? "Creating Project..." : "Create Project"}
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

export default AddProjectClient;

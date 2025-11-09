// src/app/listings/positions/add-position/components/AddPositionClient.tsx
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

import { PositionFormData } from "../position-form-types";

import RequirementsBenefitsStep from "./steps/RequirementsBenefitsStep";

import { createPositionAction } from "../position-actions";
import BasicDetailsStep from "./steps/BasicDetailsStep";
import LocationRateStep from "./steps/LocationRateStep";
import ReviewStep from "./steps/ReviewStep";

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
  phone_number?: string; // Changed from contact_phone
  website?: string;
}

interface AddPositionClientProps {
  currentUser: User;
  userBusinesses: Business[];
}

const steps = [
  "Basic Details",
  "Location & Rate",
  "Requirements & Benefits",
  "Review & Submit",
];

const AddPositionClient: React.FC<AddPositionClientProps> = ({
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
  const [listingType, setListingType] = useState<
    "personal" | "business" | null
  >(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isTypeDecided, setIsTypeDecided] = useState(false);

  const [formData, setFormData] = useState<PositionFormData>({
    title: "",
    trade: "",
    description: "",
    region: "",
    suburb: "",
    city: "",
    rate: "",
    rate_type: undefined,
    remuneration: "wages",
    start_date: "",
    good_to_have: [],
    requirements: [],
    benefits: [],
    website: "",
    contact_email: currentUser.email,
    contact_phone: "",
    posted_by: `${currentUser.first_name} ${currentUser.last_name}`,
    is_business_listing: false,
    business_id: undefined,
  });

  useEffect(() => {
    changeActiveRoute("Add Position");
  }, [changeActiveRoute]);

  const handleListingTypeChoice = (type: "personal" | "business") => {
    setListingType(type);

    if (type === "personal") {
      setFormData((prev) => ({
        ...prev,
        is_business_listing: false,
        business_id: undefined,
        contact_email: currentUser.email,
        posted_by: `${currentUser.first_name} ${currentUser.last_name}`,
      }));
      setInitialModalOpen(false);
      setIsTypeDecided(true);
    } else {
      // Show business selection if they have businesses
      if (userBusinesses.length > 0) {
        setInitialModalOpen(false);
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
      contact_phone: business.phone_number || "", // Changed from contact_phone
      website: business.website || "",
      posted_by: business.business_name,
    }));
    setInitialModalOpen(false);
    setIsTypeDecided(true);
  };

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

        const result = await createPositionAction(submissionData);

        if (result.success) {
          setSuccess("Position listing created successfully!");
          setTimeout(() => {
            router.push("/listings/positions");
          }, 2000);
        } else {
          setError(result.error || "Failed to create position listing");
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
    setListingType(null);
    setSelectedBusiness(null);
    setInitialModalOpen(true);
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
          <ReviewStep formData={formData} selectedBusiness={selectedBusiness} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Listing Type Modal */}
      <Dialog open={initialModalOpen} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" textAlign="center">
            {listingType === null
              ? "Who is posting this position?"
              : "Select Your Business"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {listingType === null ? (
            <>
              <Typography variant="body1" textAlign="center" mb={3}>
                Are you posting this position personally or on behalf of a
                business?
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
                          Personal Listing
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Post as yourself for a personal project or contract
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
                          Business Listing
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Post on behalf of your company or business
                        </Typography>
                      </Box>
                    </Flex>
                  </CardContent>
                </Card>
              </Stack>
            </>
          ) : (
            <>
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          {listingType === "business" && (
            <Button onClick={() => setListingType(null)} color="inherit">
              Back
            </Button>
          )}
          <Button onClick={() => router.back()} variant="text" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        onClick={() => router.back()}
        startIcon={<Icon icon="mdi:arrow-left" />}
        sx={{ mb: 3 }}
        variant="text"
        disabled={isPending || !isTypeDecided}
      >
        Back to Positions
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
                    <Typography variant="h6">
                      Create Position Listing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.is_business_listing
                        ? `Posting for ${selectedBusiness?.business_name}`
                        : `Posting as ${currentUser.username}`}
                    </Typography>
                  </Box>
                </Flex>
                {isTypeDecided && (
                  <Button
                    variant="text"
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
            <strong>Post a Position</strong>
            <br />
            Find skilled trade professionals for your construction or building
            project.
          </Alert>

          {isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Creating position listing...
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

export default AddPositionClient;

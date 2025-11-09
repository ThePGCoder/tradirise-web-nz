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

import { PersonnelFormData } from "../personnel-form-types";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import TradeDetailsStep from "./steps/TradeDetailsStep";
import LocationAvailabilityStep from "./steps/LocationAvailabilityStep";
import SkillsCredentialsStep from "./steps/SkillsCredentialsStep";
import ReviewStep from "./steps/ReviewStep";
import { createClient } from "@/utils/supabase/client";
import { createPersonnelAction } from "../personnel-actions";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface AddPersonnelClientProps {
  currentUser: User;
}

const steps = [
  "Personal Information",
  "Trade Details",
  "Location & Availability",
  "Skills & Credentials",
  "Review & Submit",
];

const AddPersonnelClient: React.FC<AddPersonnelClientProps> = ({
  currentUser,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initialModalOpen, setInitialModalOpen] = useState(true);
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [adType, setAdType] = useState<"self" | "worker" | null>(null);
  const [isForSelfDecided, setIsForSelfDecided] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [formData, setFormData] = useState<PersonnelFormData>({
    first_name: "",
    last_name: "",
    bio: "",
    contact_email: "",
    mobile: "",
    website: "",
    region: "",
    suburb: "",
    city: "",
    primary_trade_role: "",
    secondary_trade_roles: [],
    max_servicable_radius: 50,
    skills: [],
    accreditations: [],
    available_from: "",
    is_for_self: true,
    posted_by_name: `${currentUser.first_name} ${currentUser.last_name}`,
  });

  useEffect(() => {
    changeActiveRoute("Add Personnel");
  }, [changeActiveRoute]);

  const handleAdTypeChoice = (type: "self" | "worker") => {
    setAdType(type);
    setFormData((prev) => ({ ...prev, is_for_self: type === "self" }));
    setInitialModalOpen(false);
    setChoiceModalOpen(true);
  };

  const handleAutopopulate = async () => {
    const supabase = createClient();
    setLoadingProfile(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setError("Could not fetch profile data");
        } else if (profile) {
          setFormData((prev) => ({
            ...prev,
            first_name: profile.first_name || currentUser.first_name || "",
            last_name: profile.last_name || currentUser.last_name || "",
            bio: profile.bio || "",
            contact_email: profile.contact_email || currentUser.email,
            mobile: profile.mobile || "",
            website: profile.website || "",
            region: profile.region || "",
            suburb: profile.suburb || "",
            city: profile.city || "",
            primary_trade_role: profile.primary_trade_role || "",
            secondary_trade_roles: profile.secondary_trade_roles || [],
            max_servicable_radius: profile.max_servicable_radius || 50,
            skills: profile.skills || [],
            accreditations: profile.accreditations || [],
            is_for_self: true,
            posted_by_name: `${currentUser.first_name} ${currentUser.last_name}`,
          }));
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load profile data");
    } finally {
      setLoadingProfile(false);
      setChoiceModalOpen(false);
      setIsForSelfDecided(true);
    }
  };

  const handleCreateFromScratch = () => {
    if (adType === "self") {
      setFormData({
        ...formData,
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        contact_email: currentUser.email,
        is_for_self: true,
        posted_by_name: `${currentUser.first_name} ${currentUser.last_name}`,
      });
    } else {
      setFormData({
        ...formData,
        first_name: "",
        last_name: "",
        contact_email: "",
        mobile: "",
        website: "",
        is_for_self: false,
        posted_by_name: `${currentUser.first_name} ${currentUser.last_name}`,
      });
    }
    setChoiceModalOpen(false);
    setIsForSelfDecided(true);
  };

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
        return true;
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

        const result = await createPersonnelAction(submissionData);

        if (result.success) {
          setSuccess("Personnel listing created successfully!");
          setTimeout(() => {
            router.push("/listings/personnel");
          }, 2000);
        } else {
          setError(result.error || "Failed to create personnel listing");
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

  const handleChangeAdType = () => {
    setIsForSelfDecided(false);
    setAdType(null);
    setInitialModalOpen(true);
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
      {/* Initial Choice Modal - For Self or Worker */}
      <Dialog open={initialModalOpen} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" textAlign="center">
            Who is this ad for?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center" mb={3}>
            Are you creating this personnel listing for yourself or for another
            worker?
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
              onClick={() => handleAdTypeChoice("self")}
            >
              <CardContent>
                <Flex alignItems="center" gap={2}>
                  <Box sx={{ color: "primary.main", display: "flex" }}>
                    <Icon icon="mdi:account" width={40} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      For Myself
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      I&#39;m looking for work opportunities for myself
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
              onClick={() => handleAdTypeChoice("worker")}
            >
              <CardContent>
                <Flex alignItems="center" gap={2}>
                  <Box sx={{ color: "primary.main", display: "flex" }}>
                    <Icon icon="mdi:account-group" width={40} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      For Another Worker
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      I&#39;m posting on behalf of an employee or contractor
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

      {/* Second Modal - Autopopulate or Start Fresh */}
      <Dialog open={choiceModalOpen} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" textAlign="center">
            {adType === "self"
              ? "Create Your Listing"
              : "Create Worker Listing"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center" mb={3}>
            {adType === "self"
              ? "How would you like to create your personnel listing?"
              : "How would you like to create the worker's listing?"}
          </Typography>

          <Stack spacing={2}>
            {adType === "self" && (
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={handleAutopopulate}
              >
                <CardContent>
                  <Flex alignItems="center" gap={2}>
                    <Box sx={{ color: "primary.main", display: "flex" }}>
                      <Icon icon="mdi:account-circle" width={40} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Use My Profile
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Auto-populate from your existing profile information
                      </Typography>
                    </Box>
                  </Flex>
                </CardContent>
              </Card>
            )}

            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-2px)",
                },
              }}
              onClick={handleCreateFromScratch}
            >
              <CardContent>
                <Flex alignItems="center" gap={2}>
                  <Box sx={{ color: "primary.main", display: "flex" }}>
                    <Icon icon="mdi:file-plus" width={40} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {adType === "self"
                        ? "Start From Scratch"
                        : "Enter Worker Details"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {adType === "self"
                        ? "Create a new listing with custom information"
                        : "Enter all the worker's information manually"}
                    </Typography>
                  </Box>
                </Flex>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setChoiceModalOpen(false);
              setInitialModalOpen(true);
            }}
            color="inherit"
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        onClick={() => router.back()}
        startIcon={<Icon icon="mdi:arrow-left" />}
        sx={{ mb: 3 }}
        variant="outlined"
        disabled={isPending || !isForSelfDecided}
      >
        Back to Personnel
      </Button>

      <CustomCard sx={{ overflow: "visible" }}>
        <Box sx={{ p: 3, overflow: "visible" }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Flex alignItems="center" gap={2} justifyContent="space-between">
                <Flex alignItems="center" gap={2}>
                  <Avatar
                    src={
                      formData.is_for_self ? currentUser.avatar_url : undefined
                    }
                    sx={{ width: 60, height: 60 }}
                  >
                    {formData.first_name?.[0] || currentUser.first_name?.[0]}
                    {formData.last_name?.[0] || currentUser.last_name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      Create Personnel Listing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.is_for_self
                        ? `Creating listing for ${currentUser.username}`
                        : `Creating listing on behalf of someone else`}
                    </Typography>
                  </Box>
                </Flex>
                {isForSelfDecided && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleChangeAdType}
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

          {!formData.is_for_self && (
            <Alert severity="info" sx={{ mb: 3 }}>
              You are creating this listing on behalf of another worker. Their
              contact details will be shown to potential employers.
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Create Your Trade Profile</strong>
            <br />
            Connect with potential employers and showcase your skills and
            experience in the building and construction industry.
          </Alert>

          {(isPending || loadingProfile) && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                {loadingProfile
                  ? "Loading profile data..."
                  : "Creating personnel listing..."}
              </Typography>
            </Box>
          )}

          <CustomStepper
            steps={steps}
            activeStep={activeStep}
            //minWidth="900px"
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

export default AddPersonnelClient;

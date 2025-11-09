// src/app/listings/businesses/add-business/components/AddBusinessClient.tsx
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
import { createBusinessAction } from "@/lib/actions/business-actions";
import { BusinessFormData } from "../business-form-types";
import BusinessInfoStep from "./steps/BusinessInformationStep";
import AdditionalDetailsStep from "./steps/DetailsStep";
import LocationContactStep from "./steps/LocationContactsStep";
import ReviewStep from "./steps/ReviewStep";
import ServicesOperationsStep from "./steps/ServicesOperationsStep";
import { defaultOperatingHours } from "@/lib/data/businessData";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface AddBusinessClientProps {
  currentUser: User;
}

const steps = [
  "Business Information",
  "Location & Contact",
  "Services & Operations",
  "Additional Details",
  "Review & Submit",
];

const AddBusinessClient: React.FC<AddBusinessClientProps> = ({
  currentUser,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);

  const [formData, setFormData] = useState<BusinessFormData>({
    business_name: "",
    business_type: "",
    nzbn_number: "",
    legality_type: "",
    years_in_trading: 0,
    website: "",
    contact_email: currentUser.email,
    mobile_contacts: [],
    office_phone: "",
    types_of_work_undertaken: [],
    employees: "",
    logo_file: undefined,
    cover_file: undefined,
    gallery_files: [],
    street_address: "",
    suburb: "",
    city: "",
    region: "",
    postal_code: "",
    is_multi_branch: false,
    branch_addresses: [],
    gst_registered: false,
    insurance_policies: [],
    operating_hours: defaultOperatingHours,
    out_of_zone_working: false,
    social_media_links: {},
    availability_date: "",
    certifications: [],
  });

  useEffect(() => {
    changeActiveRoute("Add Business");
  }, [changeActiveRoute]);

  // Cleanup function for image previews
  useEffect(() => {
    return () => {
      // Cleanup all image previews when component unmounts
      if (formData.logo_file) {
        URL.revokeObjectURL(formData.logo_file.preview);
      }
      if (formData.cover_file) {
        URL.revokeObjectURL(formData.cover_file.preview);
      }
      formData.gallery_files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  const handleInputChange = <K extends keyof BusinessFormData>(
    field: K,
    value: BusinessFormData[K]
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
      case 0: // Business Information
        return !!(
          formData.business_name?.trim().length >= 2 &&
          formData.business_type &&
          formData.legality_type &&
          formData.years_in_trading >= 0
        );
      case 1: // Location & Contact
        const hasContact =
          formData.contact_email?.trim() ||
          formData.mobile_contacts.some((c) => c.number.trim()) ||
          formData.office_phone?.trim();
        return !!(formData.city?.trim() && hasContact);
      case 2: // Services & Operations
        return !!(
          formData.types_of_work_undertaken.length > 0 &&
          formData.employees?.trim()
        );
      case 3: // Additional Details
        return true; // All fields in this step are optional
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  // Client-side upload function using your existing API route
  const uploadFileToR2Client = async (
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const formData = new FormData();
      const fileName = `business-images/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}-${file.name}`;

      formData.append("file", file);
      formData.append("fileName", fileName);

      const response = await fetch("/api/r2/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || "Upload failed" };
      }

      const result = await response.json();
      return { success: true, url: result.publicUrl };
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false, error: "Upload failed" };
    }
  };

  // Upload all images function
  const uploadAllImages = async (): Promise<{
    logo_url?: string;
    cover_url?: string;
    gallery_urls: string[];
  }> => {
    const results = {
      logo_url: undefined as string | undefined,
      cover_url: undefined as string | undefined,
      gallery_urls: [] as string[],
    };

    setUploadingImages(true);

    try {
      // Upload logo
      if (formData.logo_file) {
        const logoResult = await uploadFileToR2Client(formData.logo_file.file);
        if (logoResult.success && logoResult.url) {
          results.logo_url = logoResult.url;
        } else {
          throw new Error(`Logo upload failed: ${logoResult.error}`);
        }
      }

      // Upload cover image
      if (formData.cover_file) {
        const coverResult = await uploadFileToR2Client(
          formData.cover_file.file
        );
        if (coverResult.success && coverResult.url) {
          results.cover_url = coverResult.url;
        } else {
          throw new Error(`Cover image upload failed: ${coverResult.error}`);
        }
      }

      // Upload gallery images
      for (const galleryFile of formData.gallery_files) {
        const galleryResult = await uploadFileToR2Client(galleryFile.file);
        if (galleryResult.success && galleryResult.url) {
          results.gallery_urls.push(galleryResult.url);
        } else {
          throw new Error(
            `Gallery image upload failed: ${galleryResult.error}`
          );
        }
      }

      return results;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        // Upload all images first
        const imageUrls = await uploadAllImages();

        // Prepare form data with uploaded image URLs
        const submissionData = {
          ...formData,
          logo_url: imageUrls.logo_url,
          cover_url: imageUrls.cover_url,
          gallery_urls: imageUrls.gallery_urls,
          // Convert website to full URL if needed
          website: formData.website
            ? formData.website.startsWith("http")
              ? formData.website
              : `https://${formData.website}`
            : undefined,
          // Convert social media links to full URLs
          social_media_links: Object.fromEntries(
            Object.entries(formData.social_media_links).map(
              ([platform, handle]) => [
                platform,
                handle && !handle.startsWith("http")
                  ? `https://${
                      platform === "twitter" ? "x.com" : `${platform}.com`
                    }/${handle}`
                  : handle,
              ]
            )
          ),
        };

        const result = await createBusinessAction(submissionData);

        if (result.success) {
          if (result.geocoded) {
            setSuccess("Business created successfully and added to map!");
          } else {
            setSuccess(
              "Business created successfully! Location verification may have failed, but your business is live."
            );
            if (result.geocoding_error) {
              console.warn("Geocoding error:", result.geocoding_error);
            }
          }
          // Redirect after showing success message
          setTimeout(() => {
            router.push("/listings/businesses");
          }, 2000);
        } else {
          setError(result.error || "Failed to create business");
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
          <BusinessInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            activeStep={activeStep}
          />
        );
      case 1:
        return (
          <LocationContactStep
            formData={formData}
            onInputChange={handleInputChange}
            activeStep={activeStep}
          />
        );
      case 2:
        return (
          <ServicesOperationsStep
            formData={formData}
            onInputChange={handleInputChange}
            activeStep={activeStep}
          />
        );
      case 3:
        return (
          <AdditionalDetailsStep
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
        Back to Businesses
      </Button>

      <CustomCard sx={{ overflow: "visible" }}>
        {" "}
        {/* ADD overflow: visible HERE */}
        <Box sx={{ p: 3, overflow: "visible" }}>
          {" "}
          {/* AND HERE */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Flex alignItems="center" gap={2}>
                <Avatar
                  src={currentUser.avatar_url}
                  sx={{ width: 60, height: 60, bgcolor: "primary.main" }}
                >
                  {!currentUser.avatar_url ? (
                    <Icon
                      icon="mdi:account-circle"
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <>
                      {currentUser.first_name?.[0]}
                      {currentUser.last_name?.[0]}
                    </>
                  )}
                </Avatar>
                <Box>
                  <Typography variant="h6">Create Business Listing</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Adding business for {currentUser.username}
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
            <strong>Powered by Google Maps</strong>
            <br />
            Real-time address verification and instant map placement for better
            customer discovery. Images will be uploaded when you submit the
            form.
          </Alert>
          {(isPending || uploadingImages) && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                {uploadingImages
                  ? "Uploading images..."
                  : "Creating business and verifying location..."}
              </Typography>
            </Box>
          )}
          <CustomStepper
            steps={steps}
            activeStep={activeStep}
            stepSpacing={160}
          />
          <Box sx={{ mb: 4, mt: 4, overflow: "visible" }}>
            {" "}
            {/* AND HERE */}
            {renderStepContent(activeStep)}
          </Box>
          <Flex justifyContent="space-between">
            <Button
              disabled={activeStep === 0 || isPending || uploadingImages}
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
                disabled={isPending || uploadingImages}
                startIcon={
                  isPending || uploadingImages ? (
                    <Icon icon="mdi:loading" className="animate-spin" />
                  ) : (
                    <Icon icon="mdi:check" />
                  )
                }
              >
                {isPending || uploadingImages
                  ? uploadingImages
                    ? "Uploading Images..."
                    : "Creating Business..."
                  : "Create Business"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={
                  !isStepValid(activeStep) || isPending || uploadingImages
                }
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

export default AddBusinessClient;

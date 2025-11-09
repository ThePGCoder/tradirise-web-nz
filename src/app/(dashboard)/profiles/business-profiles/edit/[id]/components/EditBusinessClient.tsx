// src/app/listings/businesses/edit-business/[id]/components/EditBusinessClient.tsx
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
import {
  BranchAddress,
  BusinessFormData,
  MobileContact,
  OperatingHours,
  SocialMediaLinks,
} from "@/app/(dashboard)/profiles/business-profiles/add-business/business-form-types";
import { updateBusinessAction } from "@/app/(dashboard)/profiles/business-profiles/add-business/actions";
import BusinessInfoStep from "@/app/(dashboard)/profiles/business-profiles/add-business/components/steps/BusinessInformationStep";
import LocationContactStep from "@/app/(dashboard)/profiles/business-profiles/add-business/components/steps/LocationContactsStep";
import ServicesOperationsStep from "@/app/(dashboard)/profiles/business-profiles/add-business/components/steps/ServicesOperationsStep";
import AdditionalDetailsStep from "@/app/(dashboard)/profiles/business-profiles/add-business/components/steps/DetailsStep";
import ReviewStep from "@/app/(dashboard)/profiles/business-profiles/add-business/components/steps/ReviewStep";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface BusinessData {
  id: string;
  auth_id: string;
  business_name: string;
  business_type: string;
  nzbn_number?: string;
  legality_type: string;
  years_in_trading: number;
  website?: string;
  contact_email: string;
  mobile_contacts: MobileContact[];
  office_phone?: string;
  types_of_work_undertaken: string[];
  employees: string;
  logo_url?: string;
  cover_url?: string;
  gallery_urls: string[];
  street_address?: string;
  suburb?: string;
  city: string;
  region?: string;
  postal_code?: string;
  is_multi_branch: boolean;
  branch_addresses: BranchAddress[];
  gst_registered: boolean;
  insurance_policies: string[];
  operating_hours: OperatingHours;
  out_of_zone_working: boolean;
  social_media_links: SocialMediaLinks;
  availability_date?: string;
  certifications: string[];
}

interface EditBusinessClientProps {
  currentUser: User;
  business: BusinessData;
}

const steps = [
  "Business Information",
  "Location & Contact",
  "Services & Operations",
  "Additional Details",
  "Review & Submit",
];

const EditBusinessClient: React.FC<EditBusinessClientProps> = ({
  business,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);

  const [formData, setFormData] = useState<BusinessFormData>({
    business_name: business.business_name,
    business_type: business.business_type,
    nzbn_number: business.nzbn_number || "",
    legality_type: business.legality_type,
    years_in_trading: business.years_in_trading,
    website: business.website || "",
    contact_email: business.contact_email,
    mobile_contacts: business.mobile_contacts || [],
    office_phone: business.office_phone || "",
    types_of_work_undertaken: business.types_of_work_undertaken || [],
    employees: business.employees,
    logo_file: undefined,
    cover_file: undefined,
    gallery_files: [],
    street_address: business.street_address || "",
    suburb: business.suburb || "",
    city: business.city,
    region: business.region || "",
    postal_code: business.postal_code || "",
    is_multi_branch: business.is_multi_branch || false,
    branch_addresses: business.branch_addresses || [],
    gst_registered: business.gst_registered || false,
    insurance_policies: business.insurance_policies || [],
    operating_hours: business.operating_hours || {
      monday: "7:30-17:00",
      tuesday: "7:30-17:00",
      wednesday: "7:30-17:00",
      thursday: "7:30-17:00",
      friday: "7:30-17:00",
      saturday: "Closed",
      sunday: "Closed",
    },
    out_of_zone_working: business.out_of_zone_working || false,
    social_media_links: business.social_media_links || {},
    availability_date: business.availability_date || "",
    certifications: business.certifications || [],
  });

  const [existingImages] = useState({
    logo_url: business.logo_url,
    cover_url: business.cover_url,
    gallery_urls: business.gallery_urls || [],
  });

  useEffect(() => {
    changeActiveRoute("Edit Business");
  }, [changeActiveRoute]);

  useEffect(() => {
    return () => {
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
  }, [formData.logo_file, formData.cover_file, formData.gallery_files]);

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
      case 0:
        return !!(
          formData.business_name?.trim().length >= 2 &&
          formData.business_type &&
          formData.legality_type &&
          formData.years_in_trading >= 0
        );
      case 1:
        const hasContact =
          formData.contact_email?.trim() ||
          formData.mobile_contacts.some((c) => c.number.trim()) ||
          formData.office_phone?.trim();
        return !!(formData.city?.trim() && hasContact);
      case 2:
        return !!(
          formData.types_of_work_undertaken.length > 0 &&
          formData.employees?.trim()
        );
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

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

  const uploadAllImages = async (): Promise<{
    logo_url?: string;
    cover_url?: string;
    gallery_urls: string[];
  }> => {
    const results = {
      logo_url: existingImages.logo_url,
      cover_url: existingImages.cover_url,
      gallery_urls: [...existingImages.gallery_urls],
    };

    setUploadingImages(true);

    try {
      if (formData.logo_file) {
        const logoResult = await uploadFileToR2Client(formData.logo_file.file);
        if (logoResult.success && logoResult.url) {
          results.logo_url = logoResult.url;
        } else {
          throw new Error(`Logo upload failed: ${logoResult.error}`);
        }
      }

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

      for (const galleryFile of formData.gallery_files) {
        if (!galleryFile.uploaded) {
          const galleryResult = await uploadFileToR2Client(galleryFile.file);
          if (galleryResult.success && galleryResult.url) {
            results.gallery_urls.push(galleryResult.url);
          } else {
            throw new Error(
              `Gallery image upload failed: ${galleryResult.error}`
            );
          }
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
        const imageUrls = await uploadAllImages();

        const submissionData = {
          id: business.id,
          ...formData,
          logo_url: imageUrls.logo_url,
          cover_url: imageUrls.cover_url,
          gallery_urls: imageUrls.gallery_urls,
          website: formData.website
            ? formData.website.startsWith("http")
              ? formData.website
              : `https://${formData.website}`
            : undefined,
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
          ) as SocialMediaLinks,
        };

        const result = await updateBusinessAction(submissionData);

        if (result.success) {
          setSuccess("Business updated successfully!");
          setTimeout(() => {
            router.push("/listings/businesses");
          }, 2000);
        } else {
          setError(result.error || "Failed to update business");
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
            existingLogoUrl={existingImages.logo_url}
            existingCoverUrl={existingImages.cover_url}
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
        <Box sx={{ p: 3, overflow: "visible" }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Flex alignItems="center" gap={2}>
                <Avatar src={business.logo_url} sx={{ width: 60, height: 60 }}>
                  {business.business_name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">Edit Business Listing</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Editing: {business.business_name}
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
            <strong>Update Your Business</strong>
            <br />
            Make changes to your business information. New images will be
            uploaded when you submit the form.
          </Alert>

          {(isPending || uploadingImages) && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                {uploadingImages
                  ? "Uploading images..."
                  : "Updating business..."}
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
                    : "Updating Business..."
                  : "Update Business"}
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

export default EditBusinessClient;

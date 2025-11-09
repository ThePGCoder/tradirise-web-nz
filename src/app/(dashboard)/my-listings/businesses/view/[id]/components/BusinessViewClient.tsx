// app/my-listings/businesses/view/[id]/components/BusinessViewClient.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Avatar,
  Chip,
  Button,
  Box,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import ShareButton from "@/components/ShareButton";
import { Business } from "@/types/business";
import BusinessStandardLayout from "./BusinessStandardLayout";
import BusinessTabbedLayout from "./BusinessTabbedLayout";

interface SubscriptionPlan {
  name: string;
  display_name: string;
}

interface BusinessWithSubscription extends Business {
  subscription_plan?: SubscriptionPlan;
}

interface BusinessViewClientProps {
  business: BusinessWithSubscription;
}

const BusinessViewClient: React.FC<BusinessViewClientProps> = ({
  business,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if business is on Business plan
  const isBusinessPlan = business.subscription_plan?.name === "business";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/businesses/${business.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete business");
      }

      router.push("/my-listings/businesses");
      router.refresh();
    } catch (error) {
      console.error("Error deleting business:", error);
      alert("Failed to delete business. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleVisitWebsite = () => {
    if (business?.website) {
      window.open(
        business.website.startsWith("http")
          ? business.website
          : `https://${business.website}`,
        "_blank"
      );
    }
  };

  return (
    <Box margin="auto" width="100%" maxWidth={1400} pt={3}>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<Icon icon="mdi:arrow-left" />}
          onClick={() => router.back()}
          variant="text"
        >
          Back to Listings
        </Button>
      </Flex>

      <CustomCard sx={{ mb: 3 }}>
        {/* Cover Image */}
        {business.cover_url && (
          <CardMedia
            component="img"
            height="200"
            image={business.cover_url}
            alt={`${business.business_name} cover`}
            sx={{ objectFit: "cover" }}
          />
        )}

        <Box sx={{ p: 3 }}>
          {/* Header Section */}
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Flex alignItems="center" gap={2}>
              {business.logo_url && (
                <Avatar
                  sx={{ height: 80, width: 80 }}
                  src={business.logo_url}
                  alt={`${business.business_name} logo`}
                />
              )}
              <Box>
                <Flex alignItems="center" gap={1}>
                  <Typography variant="h4" fontWeight={600}>
                    {business.business_name}
                  </Typography>
                  {business.is_verified && (
                    <Chip
                      icon={<Icon icon="mdi:check-decagram" />}
                      label="Verified"
                      color="success"
                      size="small"
                    />
                  )}
                  {isBusinessPlan && (
                    <Chip
                      label={
                        business.subscription_plan?.display_name ||
                        "Premium Business"
                      }
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Flex>
                <Flex gap={1} mt={1} flexWrap="wrap">
                  <Chip label={business.business_type} color="primary" />
                  <Chip label={business.legality_type} variant="outlined" />
                  {business.gst_registered && (
                    <Chip label="GST Registered" color="info" size="small" />
                  )}
                </Flex>
              </Box>
            </Flex>
          </Flex>

          {/* Content - Tabbed for Business Plan, Standard for Free/Pro */}
          {isBusinessPlan ? (
            <BusinessTabbedLayout
              business={business}
              showContactInfo={true}
              onVisitWebsite={handleVisitWebsite}
            />
          ) : (
            <BusinessStandardLayout
              business={business}
              showContactInfo={true}
              onVisitWebsite={handleVisitWebsite}
            />
          )}

          {/* Action Buttons */}
          <Flex gap={2} justifyContent="flex-end" mt={3}>
            <ShareButton
              useModal={true}
              variant="text"
              buttonText="Share"
              color="success"
              shareData={{
                url: `${window.location.origin}/businesses/${business.id}`,
                title: business.business_name,
                description: `${business.business_name} - ${business.business_type} in ${business.region}`,
              }}
            />

            {business.website && (
              <Button
                variant="text"
                color="primary"
                onClick={handleVisitWebsite}
                startIcon={<Icon icon="mdi:web" />}
              >
                Visit Website
              </Button>
            )}

            <Button
              startIcon={<Icon icon="mdi:pencil" />}
              onClick={() =>
                router.push(`/my-listings/businesses/edit/${business.id}`)
              }
              variant="text"
              color="primary"
            >
              Edit
            </Button>

            <Button
              startIcon={<Icon icon="mdi:delete" />}
              onClick={() => setDeleteDialogOpen(true)}
              variant="text"
              color="error"
            >
              Delete
            </Button>
          </Flex>
        </Box>
      </CustomCard>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Business</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this business? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={
              isDeleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Icon icon="mdi:delete" />
              )
            }
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessViewClient;

// src/app/businesses/[id]/components/BusinessDetailClient.tsx
"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Avatar,
  Chip,
  Button,
  Box,
  Divider,
  CardMedia,
  Snackbar,
  Alert,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";

import BusinessTabbedLayout from "./BusinessTabbedLayout";
import BusinessStandardLayout from "./BusinessStandardLayout";

import { Business } from "@/types/business";
import { BusinessEndorsementData } from "../../types/endorsements";
import ContactBusinessDialog from "../../components/ContactBusinessDialog";

interface SubscriptionPlan {
  name: string;
  display_name: string;
}

interface BusinessWithSubscription extends Business {
  subscription_plan?: SubscriptionPlan;
}

interface BusinessDetailClientProps {
  business: BusinessWithSubscription;
  endorsementData: BusinessEndorsementData;
}

const BusinessDetailClient: React.FC<BusinessDetailClientProps> = ({
  business,
  endorsementData,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isBusinessPlan = business.subscription_plan?.name === "business";

  useEffect(() => {
    changeActiveRoute("Business Details");
  }, [changeActiveRoute]);

  const handleContactSuccess = () => {
    setSuccess(
      "Message sent successfully! The business will receive your inquiry."
    );
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
    <>
      <Box sx={{ p: 3, pb: 10 }}>
        <Button
          onClick={() => router.back()}
          startIcon={<Icon icon="mdi:arrow-left" />}
          sx={{ mb: 2 }}
          variant="text"
        >
          Back to Businesses List
        </Button>

        <CustomCard sx={{ mb: 3 }}>
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

            {/* Content - Pass endorsementData to both layouts */}
            {isBusinessPlan ? (
              <BusinessTabbedLayout
                business={business}
                showContactInfo={false}
                onVisitWebsite={handleVisitWebsite}
                endorsementData={endorsementData}
              />
            ) : (
              <BusinessStandardLayout
                business={business}
                showContactInfo={false}
                onVisitWebsite={handleVisitWebsite}
                endorsementData={endorsementData}
              />
            )}

            <Divider sx={{ my: 3 }} />
            <Flex gap={2} justifyContent="flex-end">
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
                variant="contained"
                color="primary"
                onClick={() => setContactDialogOpen(true)}
                startIcon={<Icon icon="mdi:email" />}
              >
                Contact Business
              </Button>
            </Flex>
          </Box>
        </CustomCard>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Box>

      {/* Contact Dialog */}
      <ContactBusinessDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        businessId={business.id}
        businessName={business.business_name}
        businessType={business.business_type}
        onSuccess={handleContactSuccess}
      />
    </>
  );
};

export default BusinessDetailClient;

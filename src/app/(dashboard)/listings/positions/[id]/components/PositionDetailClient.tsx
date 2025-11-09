// app/listings/positions/[id]/PositionDetailClient.tsx
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
  Alert,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import Flex from "@/global/Flex";
import FavouriteButton from "@/app/(dashboard)/my-favourites/components/FavouriteButton";
import ShareButton from "@/components/ShareButton";
import ContactPositionDialog from "../../components/ContactPositionDialog";

interface PositionData {
  id: string;
  title: string;
  trade: string;
  rate: string;
  region: string;
  description: string;
  start_date: string;
  remuneration: string;
  posted_date: string;
  posted_by: string;
  is_business_listing: boolean;
  business_id?: string;
  auth_id: string;
  requirements?: string[];
  benefits?: string[];
  duration?: string;
  employment_type?: string;
  suburb?: string;
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
  businesses?: {
    business_name: string;
    logo_url: string;
  } | null;
}

interface PositionDetailClientProps {
  position: PositionData;
}

const PositionDetailClient: React.FC<PositionDetailClientProps> = ({
  position,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();

  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingResponse, setIsCheckingResponse] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    changeActiveRoute("Position Details");
    checkExistingResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkExistingResponse = async () => {
    try {
      const response = await fetch(
        `/api/ad-responses/check-existing?ad_id=${position.id}&ad_type=position`
      );
      if (response.ok) {
        const data = await response.json();
        setHasApplied(data.has_responded);
      }
    } catch (err) {
      console.error("Error checking existing response:", err);
    } finally {
      setIsCheckingResponse(false);
    }
  };

  const handleContactSuccess = () => {
    setHasApplied(true);
    setSuccess(
      "Application submitted! The employer will review your profile and contact you directly."
    );
  };

  const getExpiryDate = (postedDate: string) =>
    dayjs(postedDate).add(30, "days");

  const getDaysUntil = (dateString: string) => {
    const date = dayjs(dateString);
    const diff = date.diff(dayjs(), "day");
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    return `in ${diff} days`;
  };

  const expiryDate = getExpiryDate(position.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);

  const displayAvatar = position.is_business_listing
    ? position.businesses?.logo_url || null
    : position.profiles?.avatar_url || null;

  const displayName = position.is_business_listing
    ? position.businesses?.business_name || position.posted_by
    : position.posted_by;

  const avatarFallback = position.is_business_listing
    ? position.businesses?.business_name?.[0] || position.posted_by?.[0] || "B"
    : position.profiles?.first_name?.[0] ||
      position.profiles?.username?.[0] ||
      position.posted_by?.[0] ||
      "U";

  return (
    <>
      <Box margin="auto" width="100%" maxWidth={1400} px={4} py={2}>
        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            startIcon={<Icon icon="mdi:arrow-left" />}
            onClick={() => router.back()}
            variant="text"
          >
            Back to Positions List
          </Button>
        </Flex>

        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight={600}>
              {position.title}
            </Typography>
            <Chip
              label={isExpired ? "Expired Ad" : "Current Ad"}
              size="medium"
              color={isExpired ? "error" : "success"}
              sx={{ fontSize: "1rem", height: 32 }}
            />
          </Flex>

          {/* Position Description */}
          {position.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {position.description}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Main Content */}
        <Stack spacing={2} my={3}>
          {/* Posted By Information */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Posted By
              </Typography>

              <Flex alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={displayAvatar || ""}
                  sx={{ width: 80, height: 80 }}
                >
                  {avatarFallback}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {displayName || "Company"}
                  </Typography>
                  {position.is_business_listing ? (
                    <Chip
                      label="Business Listing"
                      color="primary"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      @{position.profiles?.username || position.posted_by}
                    </Typography>
                  )}
                </Box>
              </Flex>

              <Divider sx={{ my: 2 }} />

              {/* Application Status */}
              {isCheckingResponse ? (
                <Box sx={{ py: 2, textAlign: "center" }}>
                  <CircularProgress size={40} />
                </Box>
              ) : hasApplied ? (
                <Alert severity="success">
                  <Typography variant="body2" fontWeight={600}>
                    You have applied for this position
                  </Typography>
                  <Typography variant="body2">
                    The employer will review your application and contact you if
                    you&#39;re selected.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    Click the &quot;Apply&quot; button below to send your
                    application. Your contact details will be shared with the
                    employer via email.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Ad Details */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Ad Details
              </Typography>

              <Box
                sx={{
                  display: { xs: "block", md: "flex" },
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 4,
                }}
              >
                {/* Left Column */}
                <Box sx={{ flex: 1, mb: { xs: 3, md: 0 } }}>
                  {/* Posted Date */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Posted Date
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(position.posted_date).format("DD MMM YYYY")}
                    </Typography>
                  </Box>

                  {/* Expiry Date */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Expiry Date
                    </Typography>
                    <Typography variant="body1">
                      {expiryDate.format("DD MMM YYYY")} (
                      {getDaysUntil(expiryDate.toISOString())})
                    </Typography>
                  </Box>

                  {/* Position Duration */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Position Duration
                    </Typography>
                    <Typography variant="body1">
                      {position.duration || "Not specified"}
                    </Typography>
                  </Box>

                  {/* Employment Type */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Employment Type
                    </Typography>
                    <Typography variant="body1">
                      {position.employment_type
                        ? position.employment_type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : "Not specified"}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Column */}
                <Box sx={{ flex: 1 }}>
                  {/* Trade */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Trade
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: { md: "right" } }}
                    >
                      {position.trade}
                    </Typography>
                  </Box>

                  {/* Rate */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Rate
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: { md: "right" } }}
                    >
                      {position.rate}
                    </Typography>
                  </Box>

                  {/* Location */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Location
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: { md: "right" } }}
                    >
                      {position.suburb
                        ? `${position.suburb}, ${position.region}`
                        : position.region}
                    </Typography>
                  </Box>

                  {/* Start Date */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Start Date
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: { md: "right" } }}
                    >
                      {position.start_date === "ASAP"
                        ? "ASAP"
                        : dayjs(position.start_date).format("DD MMM YYYY")}
                    </Typography>
                  </Box>

                  {/* Remuneration Type */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Remuneration Type
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary.main"
                      fontWeight={600}
                      sx={{ textAlign: { md: "right" } }}
                    >
                      {position.remuneration === "labour_only"
                        ? "Labour Only"
                        : position.remuneration.charAt(0).toUpperCase() +
                          position.remuneration.slice(1)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Requirements */}
          {position.requirements && position.requirements.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Requirements
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                  mb={1}
                >
                  Required Skills:
                </Typography>
                <Stack spacing={1}>
                  {position.requirements.map((requirement, index) => (
                    <Typography key={index} variant="body2">
                      • {requirement}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {position.benefits && position.benefits.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Benefits & Perks
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                  mb={1}
                >
                  Offered Benefits:
                </Typography>
                <Grid container spacing={1}>
                  {position.benefits.map((benefit, index) => (
                    <Grid key={index}>
                      <Chip
                        label={benefit}
                        color="success"
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Apply Action */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Apply for this Position
              </Typography>

              {hasApplied ? (
                <Alert severity="success">
                  <Typography variant="body1" fontWeight={600} mb={1}>
                    Application Submitted!
                  </Typography>
                  <Typography variant="body2">
                    Your application has been sent. The employer will review
                    your profile and contact you if you&#39;re selected.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Send your application to apply for this position. Your email
                  and contact details will be shared with the employer.
                </Alert>
              )}

              {/* Desktop Buttons */}
              <Flex
                gap={2}
                justifyContent="flex-end"
                mt={2}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <FavouriteButton
                  itemType="position"
                  itemId={position.id}
                  size="medium"
                  onToggle={(isFavourited) => {
                    if (isFavourited) {
                      setSuccess("Position saved to your favorites!");
                    }
                  }}
                />

                <ShareButton
                  useModal={true}
                  variant="text"
                  buttonText="Share"
                  color="success"
                  shareData={{
                    url: `${window.location.origin}/listings/positions/${position.id}`,
                    title: `${position.title} - ${position.trade}`,
                    description:
                      position.description ||
                      `${position.title} in ${position.region}. Rate: ${position.rate}`,
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setContactDialogOpen(true)}
                  startIcon={
                    hasApplied ? (
                      <Icon icon="mdi:check" />
                    ) : (
                      <Icon icon="mdi:email" />
                    )
                  }
                  disabled={hasApplied || isExpired}
                >
                  {hasApplied
                    ? "Already Applied"
                    : isExpired
                      ? "Position Expired"
                      : "Apply"}
                </Button>
              </Flex>

              {/* Mobile Icon Buttons */}
              <Flex
                gap={1}
                justifyContent="flex-end"
                mt={2}
                sx={{ display: { xs: "flex", sm: "none" } }}
              >
                <FavouriteButton
                  itemType="position"
                  itemId={position.id}
                  size="small"
                  onToggle={(isFavourited) => {
                    if (isFavourited) {
                      setSuccess("Position saved to your favorites!");
                    }
                  }}
                />

                <ShareButton
                  useModal={true}
                  variant="icon"
                  color="success"
                  shareData={{
                    url: `${window.location.origin}/listings/positions/${position.id}`,
                    title: `${position.title} - ${position.trade}`,
                    description:
                      position.description ||
                      `${position.title} in ${position.region}. Rate: ${position.rate}`,
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setContactDialogOpen(true)}
                  startIcon={
                    hasApplied ? (
                      <Icon icon="mdi:check" width={16} height={16} />
                    ) : (
                      <Icon icon="mdi:email" width={16} height={16} />
                    )
                  }
                  disabled={hasApplied || isExpired}
                  size="small"
                  sx={{
                    minWidth: "auto",
                    px: 2,
                  }}
                >
                  {hasApplied ? "Applied" : isExpired ? "Expired" : "Apply"}
                </Button>
              </Flex>
            </CardContent>
          </Card>
        </Stack>

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
      <ContactPositionDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        positionId={position.id}
        positionTitle={position.title}
        positionTrade={position.trade}
        onSuccess={handleContactSuccess}
      />
    </>
  );
};

export default PositionDetailClient;

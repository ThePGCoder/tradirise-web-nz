// app/listings/personnel/[id]/components/PersonnelDetailClient.tsx
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

import { PersonnelWithProfile } from "../../page";
import ContactDialog from "../../components/ContactDialog";

interface PersonnelDetailClientProps {
  personnel: PersonnelWithProfile;
}

const PersonnelDetailClient: React.FC<PersonnelDetailClientProps> = ({
  personnel,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [isCheckingResponse, setIsCheckingResponse] = useState(true);
  const [hasContacted, setHasContacted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    changeActiveRoute("Personnel Details");
    checkExistingResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkExistingResponse = async () => {
    try {
      const response = await fetch(
        `/api/ad-responses/check-existing?ad_id=${personnel.id}&ad_type=personnel`
      );
      if (response.ok) {
        const data = await response.json();
        setHasContacted(data.has_responded);
      }
    } catch (err) {
      console.error("Error checking existing response:", err);
    } finally {
      setIsCheckingResponse(false);
    }
  };

  const handleContactSuccess = () => {
    setHasContacted(true);
    setSuccess(
      "Message sent successfully! The listing owner will receive your contact details."
    );
  };

  const getExpiryDate = (createdAt: string) => dayjs(createdAt).add(30, "days");

  const getDaysUntil = (dateString: string) => {
    const date = dayjs(dateString);
    const diff = date.diff(dayjs(), "day");
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    return `in ${diff} days`;
  };

  const getDisplayName = () => {
    const firstName = personnel.first_name || "";
    const lastName = personnel.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  const expiryDate = getExpiryDate(personnel.created_at);
  const isExpired = dayjs().isAfter(expiryDate);

  return (
    <>
      <Box margin="auto" width="100%" maxWidth={1400}>
        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            startIcon={<Icon icon="mdi:arrow-left" />}
            onClick={() => router.back()}
            variant="text"
          >
            Back to Personnel List
          </Button>
        </Flex>

        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight={600}>
              {personnel.primary_trade_role || "No role specified"}
            </Typography>
            <Chip
              label={isExpired ? "Expired Ad" : "Current Ad"}
              size="medium"
              color={isExpired ? "error" : "success"}
              sx={{ fontSize: "1rem", height: 32 }}
            />
          </Flex>

          {/* Bio */}
          {personnel.bio && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {personnel.bio}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Main Content */}
        <Stack spacing={2} my={3}>
          {/* Personnel Information */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Personnel Information
              </Typography>

              <Flex alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={personnel.profiles?.avatar_url || ""}
                  sx={{ width: 80, height: 80 }}
                >
                  {personnel.first_name?.[0] || personnel.last_name?.[0] || "U"}
                </Avatar>
                <Box>
                  <Typography variant="h6">{getDisplayName()}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posted by:{" "}
                    {personnel.is_for_self
                      ? `@${personnel.profiles?.username || "Self"}`
                      : personnel.posted_by_name ||
                        `@${personnel.profiles?.username}` ||
                        "Unknown User"}
                  </Typography>
                  {personnel.is_for_self && (
                    <Chip
                      label="Posted for self"
                      color="info"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              </Flex>

              <Divider sx={{ my: 2 }} />

              {/* Contact Status */}
              {isCheckingResponse ? (
                <Box sx={{ py: 2, textAlign: "center" }}>
                  <CircularProgress size={40} />
                </Box>
              ) : hasContacted ? (
                <Alert severity="success">
                  <Typography variant="body2" fontWeight={600}>
                    You have contacted this personnel
                  </Typography>
                  <Typography variant="body2">
                    Your message has been sent to {getDisplayName()}. They will
                    respond to your email directly.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    Click the &quot;Contact&quot; button below to send a message
                    to this personnel. Your contact details will be shared with
                    them via email.
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
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Date Listed:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {personnel.created_at
                    ? `${dayjs(personnel.created_at).format(
                        "DD MMM YYYY"
                      )} (${getDaysUntil(personnel.created_at)})`
                    : "N/A"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Available From:
                </Typography>
                <Typography
                  variant="body1"
                  color="success.main"
                  fontWeight={600}
                  sx={{ textAlign: { md: "right" } }}
                >
                  {personnel.available_from
                    ? `${dayjs(personnel.available_from).format(
                        "DD MMM YYYY"
                      )} (${getDaysUntil(personnel.available_from)})`
                    : "N/A"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Last Updated:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {personnel.updated_at
                    ? `${dayjs(personnel.updated_at).format(
                        "DD MMM YYYY"
                      )} (${getDaysUntil(personnel.updated_at)})`
                    : "N/A"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Expiry:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {expiryDate.format("DD MMM YYYY")} (
                  {getDaysUntil(expiryDate.toISOString())})
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Location & Experience */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Location & Experience
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Region:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {personnel.region}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Max Servicable Radius:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {personnel.max_servicable_radius || 0} km
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Years in Trade:
                </Typography>
                <Typography
                  variant="body1"
                  color="primary.main"
                  fontWeight={600}
                  sx={{ textAlign: { md: "right" } }}
                >
                  {personnel.years_in_trade || "0"} years
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Roles
              </Typography>

              <Box mb={2}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Primary Role:
                </Typography>
                <Box mt={0.5}>
                  <Chip label={personnel.primary_trade_role} color="primary" />
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                  mb={1}
                >
                  Secondary Roles:
                </Typography>
                {personnel.secondary_trade_roles &&
                personnel.secondary_trade_roles.length > 0 ? (
                  <Grid container spacing={1}>
                    {personnel.secondary_trade_roles.map((item, i) => (
                      <Grid key={i}>
                        <Chip label={item} variant="outlined" color="primary" />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No secondary roles listed
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Skills */}
          {personnel.skills && personnel.skills.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Skills
                </Typography>
                <Grid container spacing={1}>
                  {personnel.skills.map((skill, i) => (
                    <Grid key={i}>
                      <Chip label={skill} color="info" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Accreditations */}
          {personnel.accreditations && personnel.accreditations.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Accreditations
                </Typography>
                <Grid container spacing={1}>
                  {personnel.accreditations.map((a, i) => (
                    <Grid key={i}>
                      <Chip label={a} color="success" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Contact Action */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Get in Touch
              </Typography>

              {hasContacted ? (
                <Alert severity="success">
                  <Typography variant="body1" fontWeight={600} mb={1}>
                    Message Sent!
                  </Typography>
                  <Typography variant="body2">
                    Your contact request has been sent to {getDisplayName()}.
                    They will respond to your email directly.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Send a message to connect with this personnel. Your email and
                  contact details will be shared with them.
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
                  itemType="personnel"
                  itemId={personnel.id}
                  size="medium"
                  onToggle={(isFavourited) => {
                    if (isFavourited) {
                      setSuccess("Personnel saved to your favorites!");
                    }
                  }}
                />

                <ShareButton
                  useModal={true}
                  variant="text"
                  buttonText="Share"
                  color="success"
                  shareData={{
                    url: `${window.location.origin}/personnel/${personnel.id}`,
                    title: `${getDisplayName()} - ${
                      personnel.primary_trade_role || "Personnel"
                    }`,
                    description: `Check out ${getDisplayName()}, a ${
                      personnel.primary_trade_role || "professional"
                    } in ${personnel.region || "your area"}`,
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setContactDialogOpen(true)}
                  startIcon={
                    hasContacted ? (
                      <Icon icon="mdi:check" />
                    ) : (
                      <Icon icon="mdi:email" />
                    )
                  }
                  disabled={hasContacted || isExpired}
                >
                  {hasContacted
                    ? "Already Contacted"
                    : isExpired
                      ? "Ad Expired"
                      : "Contact"}
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
                  itemType="personnel"
                  itemId={personnel.id}
                  size="small"
                  onToggle={(isFavourited) => {
                    if (isFavourited) {
                      setSuccess("Personnel saved to your favorites!");
                    }
                  }}
                />

                <ShareButton
                  useModal={true}
                  variant="icon"
                  color="success"
                  shareData={{
                    url: `${window.location.origin}/personnel/${personnel.id}`,
                    title: `${getDisplayName()} - ${
                      personnel.primary_trade_role || "Personnel"
                    }`,
                    description: `Check out ${getDisplayName()}, a ${
                      personnel.primary_trade_role || "professional"
                    } in ${personnel.region || "your area"}`,
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setContactDialogOpen(true)}
                  startIcon={
                    hasContacted ? (
                      <Icon icon="mdi:check" width={16} height={16} />
                    ) : (
                      <Icon icon="mdi:email" width={16} height={16} />
                    )
                  }
                  disabled={hasContacted || isExpired}
                  size="small"
                  sx={{
                    minWidth: "auto",
                    px: 2,
                  }}
                >
                  {hasContacted ? "Sent" : isExpired ? "Expired" : "Contact"}
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
      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        personnelId={personnel.id}
        personnelName={getDisplayName()}
        personnelRole={personnel.primary_trade_role || "Personnel"}
        onSuccess={handleContactSuccess}
      />
    </>
  );
};

export default PersonnelDetailClient;

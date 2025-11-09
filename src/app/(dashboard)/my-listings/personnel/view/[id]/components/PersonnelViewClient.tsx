// PersonnelViewClient.tsx (Client Component)
"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  Divider,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useState } from "react";
import Flex from "@/global/Flex";
import { Personnel } from "@/types/personnel";
import ShareButton from "@/components/ShareButton";

// Extended type to match what the parent passes
export interface PersonnelWithProfile extends Personnel {
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface PersonnelViewClientProps {
  personnel: PersonnelWithProfile;
}

const PersonnelViewClient: React.FC<PersonnelViewClientProps> = ({
  personnel,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    const firstName = personnel.profiles?.first_name || "";
    const lastName = personnel.profiles?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/personnel/${personnel.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete personnel ad");
      }

      router.push("/my-listings/personnel");
      router.refresh();
    } catch (error) {
      console.error("Error deleting personnel ad:", error);
      alert("Failed to delete personnel ad. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const expiryDate = getExpiryDate(personnel.created_at);
  const isExpired = dayjs().isAfter(expiryDate);
  const getExpiryDays = (createdDate: string) => {
    const expiry = dayjs(createdDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };
  const expiryDays = getExpiryDays(personnel.created_at);

  return (
    <Box margin="auto" width="100%" maxWidth={1400} py={3}>
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
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Personnel Information
            </Typography>

            <Flex alignItems="center" gap={2} mb={2}>
              <Avatar
                src={personnel.profiles?.avatar_url || ""}
                sx={{ width: 80, height: 80 }}
              >
                {personnel.profiles?.first_name?.[0] ||
                  personnel.profiles?.last_name?.[0] ||
                  "U"}
              </Avatar>
              <Box>
                <Typography variant="h6">{getDisplayName()}</Typography>
                <Typography variant="body2" color="text.secondary">
                  @{personnel.profiles?.username || "Unknown"}
                </Typography>
              </Box>
            </Flex>

            <Divider sx={{ my: 2 }} />

            {/* Contact Information */}
            <Box>
              <Typography variant="body1" fontWeight={600} mb={1}>
                Contact Information
              </Typography>

              <Box mb={1}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Contact Email:
                </Typography>
                <Typography variant="body1">
                  {personnel.contact_email ? (
                    <a
                      href={`mailto:${personnel.contact_email}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {personnel.contact_email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </Box>

              <Box mb={1}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Mobile:
                </Typography>
                <Typography variant="body1">
                  {personnel.mobile ? (
                    <a
                      href={`tel:${personnel.mobile}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {personnel.mobile}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Website:
                </Typography>
                <Typography variant="body1">
                  {personnel.website ? (
                    <a
                      href={personnel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        wordBreak: "break-all",
                      }}
                    >
                      {personnel.website}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Ad Details */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
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

            {/* Status Badges */}
            <Flex gap={1} sx={{ mt: 2, flexWrap: "wrap" }}>
              <Chip
                label={isExpired ? "Expired" : "Available"}
                size="small"
                color={isExpired ? "error" : "success"}
              />
              {!isExpired && (
                <Chip
                  label={`Expires in ${expiryDays} days`}
                  size="small"
                  color="warning"
                />
              )}
            </Flex>
          </CardContent>
        </Card>

        {/* Location & Experience */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
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
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
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
          <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
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
          <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
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
      </Stack>

      {/* Action Buttons */}
      <Flex gap={2} justifyContent="flex-end" mt={3}>
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
          startIcon={<Icon icon="mdi:pencil" />}
          onClick={() =>
            router.push(`/my-listings/personnel/edit/${personnel.id}`)
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Personnel Ad</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this personnel ad? This action
            cannot be undone.
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

export default PersonnelViewClient;

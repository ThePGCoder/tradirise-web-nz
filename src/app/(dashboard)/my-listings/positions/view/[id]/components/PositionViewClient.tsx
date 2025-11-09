// app/my-listings/positions/view/[id]/components/PositionViewClient.tsx (Client Component)
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
  Stack,
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
import ShareButton from "@/components/ShareButton";

interface PositionData {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  trade: string;
  rate: string;
  region: string;
  description: string;
  start_date: string;
  remuneration: string;
  posted_date: string;
  auth_id: string;
  posted_by_name: string;
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface PositionViewClientProps {
  position: PositionData;
}

const PositionViewClient: React.FC<PositionViewClientProps> = ({
  position,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const getDisplayName = () => {
    const firstName = position.profiles?.first_name || "";
    const lastName = position.profiles?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/positions/${position.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete position");
      }

      router.push("/my-listings/positions");
      router.refresh();
    } catch (error) {
      console.error("Error deleting position:", error);
      alert("Failed to delete position. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const expiryDate = getExpiryDate(position.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);
  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };
  const expiryDays = getExpiryDays(position.posted_date);

  return (
    <Box margin="auto" width="100%" maxWidth={1000} pt={3}>
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
            {position.title || "No title specified"}
          </Typography>
          <Chip
            label={isExpired ? "Expired Ad" : "Current Ad"}
            size="medium"
            color={isExpired ? "error" : "success"}
            sx={{ fontSize: "1rem", height: 32 }}
          />
        </Flex>

        {/* Description */}
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
        {/* Poster Information */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Posted By
            </Typography>

            <Flex alignItems="center" gap={2} mb={2}>
              <Avatar
                src={position.profiles?.avatar_url || ""}
                sx={{ width: 80, height: 80 }}
              >
                {position.profiles?.first_name?.[0] ||
                  position.profiles?.last_name?.[0] ||
                  "U"}
              </Avatar>
              <Box>
                <Typography variant="h6">{getDisplayName()}</Typography>
                <Typography variant="body2" color="text.secondary">
                  @{position.profiles?.username || "Unknown"}
                </Typography>
              </Box>
            </Flex>

            {position.posted_by_name && (
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Company/Organization:
                </Typography>
                <Typography variant="body1">
                  {position.posted_by_name}
                </Typography>
              </Box>
            )}
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
                Date Posted:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {position.posted_date
                  ? `${dayjs(position.posted_date).format(
                      "DD MMM YYYY"
                    )} (${getDaysUntil(position.posted_date)})`
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
                Start Date:
              </Typography>
              <Typography
                variant="body1"
                color="success.main"
                fontWeight={600}
                sx={{ textAlign: { md: "right" } }}
              >
                {position.start_date
                  ? `${dayjs(position.start_date).format(
                      "DD MMM YYYY"
                    )} (${getDaysUntil(position.start_date)})`
                  : "To be determined"}
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
                {position.updated_at
                  ? `${dayjs(position.updated_at).format(
                      "DD MMM YYYY"
                    )} (${getDaysUntil(position.updated_at)})`
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
                label={isExpired ? "Expired" : "Active"}
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

        {/* Position Information */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Position Information
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
                Trade/Category:
              </Typography>
              <Box sx={{ textAlign: { md: "right" } }}>
                <Chip
                  label={position.trade || "General"}
                  color="primary"
                  size="small"
                />
              </Box>
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
                Location:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {position.region || "N/A"}
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
                Rate:
              </Typography>
              <Typography
                variant="body1"
                color="success.main"
                fontWeight={600}
                sx={{ textAlign: { md: "right" } }}
              >
                {position.rate || "N/A"}
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
                Remuneration:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {position.remuneration || "N/A"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Action Buttons */}
      <Flex gap={2} justifyContent="flex-end" mt={3}>
        <ShareButton
          useModal={true}
          variant="text"
          buttonText="Share"
          color="success"
          shareData={{
            url: `${window.location.origin}/positions/${position.id}`,
            title: position.title || "Position Listing",
            description: `${position.title} - ${position.trade} in ${position.region}`,
          }}
        />

        <Button
          startIcon={<Icon icon="mdi:pencil" />}
          onClick={() =>
            router.push(`/my-listings/positions/edit/${position.id}`)
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
        <DialogTitle>Delete Position</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this position? This action cannot be
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

export default PositionViewClient;

// app/my-listings/projects/view/[id]/components/ProjectViewClient.tsx (Client Component)
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
import ShareButton from "@/components/ShareButton";

interface ProjectData {
  id: string;
  title: string;
  required_trades: string[];
  description: string;
  region: string;
  price_range: string;
  proposed_start_date: string;
  project_duration: string;
  project_type: string;
  materials_provided: string[];
  contact_email: string;
  contact_phone: string | null;
  company_name: string;
  posted_by: string;
  is_business_listing: boolean;
  auth_id: string;
  posted_date: string;
  updated_at: string;
  status: string;
  business_id: string;
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface ProjectViewClientProps {
  project: ProjectData;
}

const ProjectViewClient: React.FC<ProjectViewClientProps> = ({ project }) => {
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
    const firstName = project.profiles?.first_name || "";
    const lastName = project.profiles?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      router.push("/my-listings/projects");
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const expiryDate = getExpiryDate(project.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);
  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };
  const expiryDays = getExpiryDays(project.posted_date);

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
            {project.title || "No title specified"}
          </Typography>
          <Chip
            label={isExpired ? "Expired Ad" : "Current Ad"}
            size="medium"
            color={isExpired ? "error" : "success"}
            sx={{ fontSize: "1rem", height: 32 }}
          />
        </Flex>

        {/* Description */}
        {project.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              {project.description}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Main Content */}
      <Stack spacing={2} my={3}>
        {/* Project Owner Information */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Project Owner Information
            </Typography>

            <Flex alignItems="center" gap={2} mb={2}>
              <Avatar
                src={project.profiles?.avatar_url || ""}
                sx={{ width: 80, height: 80 }}
              >
                {project.profiles?.first_name?.[0] ||
                  project.profiles?.last_name?.[0] ||
                  "U"}
              </Avatar>
              <Box>
                <Typography variant="h6">{getDisplayName()}</Typography>
                <Typography variant="body2" color="text.secondary">
                  @{project.profiles?.username || "Unknown"}
                </Typography>
              </Box>
            </Flex>

            {project.company_name && (
              <Box mb={2}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Company:
                </Typography>
                <Typography variant="body1">{project.company_name}</Typography>
              </Box>
            )}

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
                  {project.contact_email ? (
                    <a
                      href={`mailto:${project.contact_email}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {project.contact_email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </Box>

              {project.contact_phone && (
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    Phone:
                  </Typography>
                  <Typography variant="body1">
                    <a
                      href={`tel:${project.contact_phone}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {project.contact_phone}
                    </a>
                  </Typography>
                </Box>
              )}
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
                Date Posted:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {project.posted_date
                  ? `${dayjs(project.posted_date).format(
                      "DD MMM YYYY"
                    )} (${getDaysUntil(project.posted_date)})`
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
                {project.updated_at
                  ? `${dayjs(project.updated_at).format(
                      "DD MMM YYYY"
                    )} (${getDaysUntil(project.updated_at)})`
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
              {project.is_business_listing && (
                <Chip label="Business Listing" size="small" color="secondary" />
              )}
            </Flex>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Project Information
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
                Project Type:
              </Typography>
              <Box sx={{ textAlign: { md: "right" } }}>
                <Chip
                  label={project.project_type || "General"}
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
                Region:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {project.region || "N/A"}
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
                Budget Range:
              </Typography>
              <Typography
                variant="body1"
                color="success.main"
                fontWeight={600}
                sx={{ textAlign: { md: "right" } }}
              >
                {project.price_range || "N/A"}
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
                Project Duration:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {project.project_duration || "N/A"}
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
                Proposed Start Date:
              </Typography>
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight={600}
                sx={{ textAlign: { md: "right" } }}
              >
                {project.proposed_start_date
                  ? `${dayjs(project.proposed_start_date).format(
                      "DD MMM YYYY"
                    )} (${getDaysUntil(project.proposed_start_date)})`
                  : "To be determined"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Required Trades */}
        {project.required_trades && project.required_trades.length > 0 && (
          <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Required Trades
              </Typography>
              <Grid container spacing={1}>
                {project.required_trades.map((trade, i) => (
                  <Grid key={i}>
                    <Chip label={trade} color="primary" />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Materials Provided */}
        {project.materials_provided &&
          project.materials_provided.length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Materials Provided
                </Typography>
                <Grid container spacing={1}>
                  {project.materials_provided.map((material, i) => (
                    <Grid key={i}>
                      <Chip label={material} color="info" />
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
            url: `${window.location.origin}/projects/${project.id}`,
            title: project.title || "Project Listing",
            description: `${project.title} - ${project.project_type} in ${project.region}`,
          }}
        />

        <Button
          startIcon={<Icon icon="mdi:pencil" />}
          onClick={() =>
            router.push(`/my-listings/projects/edit/${project.id}`)
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
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be
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

export default ProjectViewClient;

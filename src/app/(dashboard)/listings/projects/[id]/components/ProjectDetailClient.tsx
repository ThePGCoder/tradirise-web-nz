// app/listings/projects/[id]/ProjectDetailClient.tsx
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
import ContactProjectDialog from "../../components/ContactProjectDialog";

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
  business_id?: string;
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

interface ProjectDetailClientProps {
  project: ProjectData;
}

const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({
  project,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();

  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingResponse, setIsCheckingResponse] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    changeActiveRoute("Project Details");
    checkExistingResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkExistingResponse = async () => {
    try {
      const response = await fetch(
        `/api/ad-responses/check-existing?ad_id=${project.id}&ad_type=project`
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
      "Application submitted! The project owner will review your profile and contact you directly."
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

  const expiryDate = getExpiryDate(project.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);

  const displayAvatar = project.is_business_listing
    ? project.businesses?.logo_url || null
    : project.profiles?.avatar_url || null;

  const displayName = project.is_business_listing
    ? project.businesses?.business_name || project.company_name
    : project.posted_by;

  const avatarFallback = project.is_business_listing
    ? project.businesses?.business_name?.[0] || project.company_name?.[0] || "B"
    : project.profiles?.first_name?.[0] ||
      project.profiles?.username?.[0] ||
      project.posted_by?.[0] ||
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
            Back to Projects List
          </Button>
        </Flex>

        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight={600}>
              {project.title}
            </Typography>
            <Chip
              label={isExpired ? "Expired Ad" : "Current Ad"}
              size="medium"
              color={isExpired ? "error" : "success"}
              sx={{ fontSize: "1rem", height: 32 }}
            />
          </Flex>

          {/* Project Description */}
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
          {/* Posted By Section */}
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
                  {project.is_business_listing ? (
                    <Chip
                      label="Business Listing"
                      color="primary"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      @{project.profiles?.username || project.posted_by}
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
                    You have applied for this project
                  </Typography>
                  <Typography variant="body2">
                    The project owner will review your application and contact
                    you if you&#39;re selected.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    Click the &quot;Apply&quot; button below to send your
                    application. Your contact details will be shared with the
                    project owner via email.
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
                  Start Date:
                </Typography>
                <Typography
                  variant="body1"
                  color="success.main"
                  fontWeight={600}
                  sx={{ textAlign: { md: "right" } }}
                >
                  {project.proposed_start_date
                    ? `${dayjs(project.proposed_start_date).format(
                        "DD MMM YYYY"
                      )} (${getDaysUntil(project.proposed_start_date)})`
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

          {/* Project Information */}
          <Card variant="outlined">
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
                    label={project.project_type}
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
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Duration:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {project.project_duration || "TBD"}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Location & Budget */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Location & Budget
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
                  {project.suburb
                    ? `${project.suburb}, ${project.region}`
                    : project.region}
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
                  Price Range:
                </Typography>
                <Typography
                  variant="body1"
                  color="primary.main"
                  fontWeight={600}
                  sx={{ textAlign: { md: "right" } }}
                >
                  {project.price_range}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Required Trades */}
          {project.required_trades && project.required_trades.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Required Trades
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                  mb={1}
                >
                  Looking for:
                </Typography>
                <Grid container spacing={1}>
                  {project.required_trades.map((trade, index) => (
                    <Grid key={index}>
                      <Chip label={trade} color="info" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Materials Provided */}
          {project.materials_provided &&
            project.materials_provided.length > 0 && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Materials & Resources
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={1}
                  >
                    Materials Provided:
                  </Typography>
                  <Grid container spacing={1}>
                    {project.materials_provided.map((material, index) => (
                      <Grid key={index}>
                        <Chip label={material} color="success" />
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
                Apply for this Project
              </Typography>

              {hasApplied ? (
                <Alert severity="success">
                  <Typography variant="body1" fontWeight={600} mb={1}>
                    Application Submitted!
                  </Typography>
                  <Typography variant="body2">
                    Your application has been sent. The project owner will
                    review your profile and contact you if you&#39;re selected.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Send your application to apply for this project. Your email
                  and contact details will be shared with the project owner.
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
                  itemType="project"
                  itemId={project.id}
                  size="medium"
                  onToggle={(isFavourited) => {
                    if (isFavourited) {
                      setSuccess("Project saved to your favorites!");
                    }
                  }}
                />

                <ShareButton
                  useModal={true}
                  variant="text"
                  buttonText="Share"
                  color="success"
                  shareData={{
                    url: `${window.location.origin}/listings/projects/${project.id}`,
                    title: `${project.title} - ${project.project_type}`,
                    description:
                      project.description ||
                      `${project.title} in ${project.region}. Budget: ${project.price_range}`,
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
                      ? "Project Expired"
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
                  itemType="project"
                  itemId={project.id}
                  size="small"
                  onToggle={(isFavourited) => {
                    if (isFavourited) {
                      setSuccess("Project saved to your favorites!");
                    }
                  }}
                />

                <ShareButton
                  useModal={true}
                  variant="icon"
                  color="success"
                  shareData={{
                    url: `${window.location.origin}/listings/projects/${project.id}`,
                    title: `${project.title} - ${project.project_type}`,
                    description:
                      project.description ||
                      `${project.title} in ${project.region}. Budget: ${project.price_range}`,
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
      <ContactProjectDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        projectId={project.id}
        projectTitle={project.title}
        projectType={project.project_type}
        onSuccess={handleContactSuccess}
      />
    </>
  );
};

export default ProjectDetailClient;

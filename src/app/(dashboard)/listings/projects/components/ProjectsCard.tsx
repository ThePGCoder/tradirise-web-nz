// app/listings/projects/components/ProjectsCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  CardContent,
  CardActions,
  Chip,
  Button,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import dayjs from "dayjs";

import FavouriteButton from "@/app/(dashboard)/my-favourites/components/FavouriteButton";
import ShareButton from "@/components/ShareButton";

import { ProjectWithProfiles } from "../page";
import ContactProjectDialog from "./ContactProjectDialog";

interface ProjectCardProps {
  project: ProjectWithProfiles;
  onViewDetails: (id: string) => void;
  onSave?: (id: string) => void;
}

const ProjectsCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onSave,
}) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingResponse, setIsCheckingResponse] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    checkExistingResponse();
  }, [project.id]);

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
  };

  const getDaysUntil = (date: string): string => {
    const targetDate = dayjs(date);
    const today = dayjs();
    const diff = targetDate.diff(today, "day");

    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    if (diff === -1) return "yesterday";
    if (diff > 0) return `in ${diff} days`;
    return `${Math.abs(diff)} days ago`;
  };

  const formatShortDate = (date: string) => {
    return dayjs(date).format("MMM D");
  };

  const getExpiryDate = (postedDate: string): dayjs.Dayjs => {
    return dayjs(postedDate).add(1, "month");
  };

  const getExpiryDays = (postedDate: string) => {
    const expiry = getExpiryDate(postedDate);
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const expiryDate = getExpiryDate(project.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);
  const expiryDays = getExpiryDays(project.posted_date);

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

  const getApplyButtonProps = () => {
    if (isCheckingResponse) {
      return {
        disabled: true,
        text: "Loading...",
        icon: <CircularProgress size={16} color="inherit" />,
        color: "primary" as const,
      };
    }
    if (hasApplied) {
      return {
        disabled: true,
        text: "Applied",
        icon: <Icon icon="mdi:check-circle" width={16} height={16} />,
        color: "success" as const,
      };
    }
    if (isExpired) {
      return {
        disabled: true,
        text: "Expired",
        icon: <Icon icon="mdi:rocket-launch" width={16} height={16} />,
        color: "primary" as const,
      };
    }
    return {
      disabled: false,
      text: "Apply",
      icon: <Icon icon="fe:bolt" width={16} height={16} />,
      color: "primary" as const,
    };
  };

  const applyButtonProps = getApplyButtonProps();

  return (
    <>
      <CustomCard
        sx={{
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.005)",
            boxShadow: 3,
          },
          position: "relative",
          height: "100%",
        }}
        onClick={() => onViewDetails(project.id)}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1, p: { xs: 2, md: 3 } }}>
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Flex alignItems="center" gap={2} sx={{ mb: 0.5 }}>
              <Avatar
                src={displayAvatar || undefined}
                alt={displayName || "User"}
                sx={{
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                {avatarFallback}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.5rem" },
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {project.title}
                </Typography>
                <Typography color="text.secondary">
                  {project.project_type}
                </Typography>
              </Box>
            </Flex>
          </Box>

          <Flex gap={1} sx={{ mb: 1, flexWrap: "wrap" }}>
            <Chip
              label={isExpired ? "Expired" : "Open"}
              size="small"
              color={isExpired ? "error" : "success"}
              sx={{ fontSize: "0.7rem", height: 20, userSelect: "none" }}
            />
            {!isExpired && (
              <Chip
                label={`Expires in ${expiryDays} days`}
                size="small"
                color="warning"
                sx={{ fontSize: "0.7rem", height: 20, userSelect: "none" }}
              />
            )}
            {project.is_business_listing && (
              <Chip
                label="Business"
                size="small"
                color="primary"
                variant="outlined"
                icon={<Icon icon="mdi:domain" width={14} />}
                sx={{ fontSize: "0.7rem", height: 20, userSelect: "none" }}
              />
            )}
            {hasApplied && !isExpired && (
              <Chip
                label="Applied"
                size="small"
                color="info"
                sx={{ fontSize: "0.7rem", height: 20, userSelect: "none" }}
                icon={<Icon icon="mdi:check-circle" width={12} height={12} />}
              />
            )}
          </Flex>

          {project.description && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.4,
                  fontSize: "0.875rem",
                }}
              >
                {project.description.length > 150
                  ? `${project.description.substring(0, 150).trim()}...`
                  : project.description}
              </Typography>
            </Box>
          )}

          {project.required_trades && project.required_trades.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Flex gap={0.5} flexWrap="wrap">
                {project.required_trades.slice(0, 3).map((trade, index) => (
                  <Chip
                    key={index}
                    label={trade}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: 20, userSelect: "none" }}
                  />
                ))}
                {project.required_trades.length > 3 && (
                  <Chip
                    label={`+${project.required_trades.length - 3} more`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: 20, userSelect: "none" }}
                  />
                )}
              </Flex>
            </Box>
          )}

          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box
                color="primary.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:map-marker" height={16} />
              </Box>
              <Typography variant="body2">{project.region}</Typography>
            </Flex>

            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box
                color="primary.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:cash" height={16} />
              </Box>
              <Typography variant="body2">
                {project.price_range || "Price not specified"}
              </Typography>
            </Flex>

            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box
                color="primary.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:clock-outline" height={16} />
              </Box>
              <Typography variant="body2">
                Duration: {project.project_duration || "TBD"}
              </Typography>
            </Flex>

            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box
                color="primary.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:calendar-start" height={16} />
              </Box>
              <Typography variant="body2">
                Starts{" "}
                {project.proposed_start_date
                  ? getDaysUntil(project.proposed_start_date)
                  : "TBD"}
              </Typography>
            </Flex>

            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box
                color="primary.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:calendar-plus" height={16} />
              </Box>
              <Typography variant="body2">
                Posted {formatShortDate(project.posted_date)} (
                {getDaysUntil(project.posted_date)})
              </Typography>
            </Flex>

            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box
                color="primary.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  icon={
                    project.is_business_listing
                      ? "mdi:domain"
                      : "mdi:account-circle"
                  }
                  height={16}
                />
              </Box>
              <Typography variant="body2">
                Posted by {displayName || "Company"}
              </Typography>
            </Flex>
          </Box>
        </CardContent>

        <CardActions
          sx={{ p: { xs: 2, md: 2 }, pt: 0, justifyContent: "flex-end" }}
        >
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<Icon icon="mdi:magnify" width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(project.id);
            }}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              minWidth: { xs: "auto", sm: "64px" },
              px: { xs: 1, sm: 2 },
              "& .MuiButton-startIcon": {
                margin: { xs: 0, sm: "0 8px 0 -4px" },
              },
              userSelect: "none",
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>View</Box>
          </Button>

          <FavouriteButton
            itemType="project"
            itemId={project.id}
            size="small"
            onToggle={() => {
              if (onSave) onSave(project.id);
            }}
          />

          <Box onClick={(e) => e.stopPropagation()}>
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
          </Box>

          <Button
            size="small"
            variant="contained"
            color={applyButtonProps.color}
            disabled={applyButtonProps.disabled}
            startIcon={applyButtonProps.icon}
            onClick={(e) => {
              e.stopPropagation();
              if (!applyButtonProps.disabled) {
                setContactDialogOpen(true);
              }
            }}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              minWidth: { xs: "auto", sm: "64px" },
              px: { xs: 1, sm: 2 },
              "& .MuiButton-startIcon": {
                margin: { xs: 0, sm: "0 8px 0 -4px" },
              },
              userSelect: "none",
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>
              {applyButtonProps.text}
            </Box>
            <Box sx={{ display: { xs: "inline", sm: "none" } }}>
              {applyButtonProps.text}
            </Box>
          </Button>
        </CardActions>
      </CustomCard>

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

export default ProjectsCard;

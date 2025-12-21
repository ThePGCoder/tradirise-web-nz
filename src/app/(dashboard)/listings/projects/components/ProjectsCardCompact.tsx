// app/listings/projects/components/ProjectsCardCompact.tsx
"use client";

import React from "react";
import { CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { ProjectWithProfiles } from "../page";
import CustomCard from "@/components/CustomCard";

interface ProjectsCardCompactProps {
  project: ProjectWithProfiles;
  onViewDetails: (id: string) => void;
}

const ProjectsCardCompact: React.FC<ProjectsCardCompactProps> = ({
  project,
  onViewDetails,
}) => {
  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(1, "month");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(project.posted_date).add(1, "month"));
  const expiryDays = getExpiryDays(project.posted_date);

  const getDaysUntil = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diff = date.diff(now, "day");

    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    if (diff < 0) return `${Math.abs(diff)}d ago`;
    return `in ${diff}d`;
  };

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
    <CustomCard
      onClick={() => onViewDetails(project.id)}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent
        sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Title - Main */}
        <Typography
          variant="body2"
          fontWeight={600}
          gutterBottom
          noWrap
          title={project.title}
        >
          {project.title}
        </Typography>

        {/* Avatar and Posted By */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar
            src={displayAvatar || undefined}
            alt={displayName || "Company"}
            sx={{
              width: 24,
              height: 24,
            }}
          >
            {avatarFallback}
          </Avatar>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            title={displayName}
          >
            {displayName}
          </Typography>
        </Box>

        {/* Price Range */}
        <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
          {project.price_range || "TBD"}
        </Typography>

        {/* Status Badges */}
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
          <Chip
            label={isExpired ? "Expired" : "Open"}
            size="small"
            color={isExpired ? "error" : "success"}
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
          {!isExpired && (
            <Chip
              label={`${expiryDays}d left`}
              size="small"
              color="warning"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}
        </Box>

        {/* Key Details */}
        <Box display="flex" flexDirection="column" gap={0.5} mt="auto">
          {/* Project Type */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:hammer-wrench" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {project.project_type}
            </Typography>
          </Box>

          {/* Region */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:map-marker" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {project.region}
            </Typography>
          </Box>

          {/* Duration */}
          {project.project_duration && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Icon icon="mdi:clock-outline" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {project.project_duration}
              </Typography>
            </Box>
          )}

          {/* Start Date */}
          {project.proposed_start_date && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Icon icon="mdi:calendar-start" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary" noWrap>
                Starts {getDaysUntil(project.proposed_start_date)}
              </Typography>
            </Box>
          )}

          {/* Required Trades */}
          {project.required_trades && project.required_trades.length > 0 && (
            <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
              <Chip
                label={
                  project.required_trades.length === 1
                    ? project.required_trades[0]
                    : `${project.required_trades.length} trades`
                }
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default ProjectsCardCompact;

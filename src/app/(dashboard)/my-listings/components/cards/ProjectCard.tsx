// components/ProjectCard.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  CardContent,
  CardActions,
  Chip,
  Avatar,
} from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";

interface Project {
  id: string;
  title: string;
  required_trades: string[];
  price_range: string;
  region: string;
  description: string;
  proposed_start_date: string;
  posted_date: string;
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
  posted_by: string;
  auth_id?: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit: (id: string) => void;
  onDelete: (project: Project, event: React.MouseEvent) => void;
  onViewDetails: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const getDaysUntil = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diff = date.diff(now, "day");

    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    if (diff === -1) return "yesterday";
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    return `in ${diff} days`;
  };

  const formatShortDate = (date: string) => {
    return dayjs(date).format("MMM D");
  };

  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(project.posted_date).add(30, "days"));
  const expiryDays = getExpiryDays(project.posted_date);

  // Determine posted by info
  let postedByName = "Unknown";
  let postedByAvatarUrl = "";

  if (project.posted_by === "user" && project.profiles) {
    postedByName = project.profiles.username || "Unknown User";
    postedByAvatarUrl = project.profiles.avatar_url || "";
  } else if (project.posted_by === "business" && project.businesses) {
    postedByName = project.businesses.business_name || "Unknown Business";
    postedByAvatarUrl = project.businesses.logo_url || "";
  }

  return (
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
        {/* Project Header */}
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Flex alignItems="center" gap={2} sx={{ mb: 0.5 }}>
            {postedByAvatarUrl && (
              <Avatar
                src={postedByAvatarUrl}
                alt={postedByName}
                sx={{
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  flexShrink: 0,
                }}
              />
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.5rem" },
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {project.title || "No title specified"}
              </Typography>
              <Typography color="text.secondary">
                Posted by {postedByName}
              </Typography>
            </Box>
          </Flex>
        </Box>

        {/* Status Badge */}
        <Flex gap={1} sx={{ mb: 1 }}>
          <Chip
            label={isExpired ? "Expired" : "Current"}
            size="small"
            color={isExpired ? "error" : "success"}
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
          {!isExpired && (
            <Chip
              label={`Expires in ${expiryDays} days`}
              size="small"
              color="warning"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          )}
        </Flex>

        {/* Description */}
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

        {/* Key Details List */}
        <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
          {/* Location */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
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

          {/* Budget */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box
              color="primary.main"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="mdi:currency-usd" height={16} />
            </Box>
            <Typography variant="body2">
              {project.price_range || "Budget not specified"}
            </Typography>
          </Flex>

          {/* Start Date */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
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

          {/* Posted Date */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
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
        </Box>

        {/* Required Trades */}
        {project.required_trades && project.required_trades.length > 0 && (
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Required Trades:
            </Typography>
            <Flex gap={1} flexWrap="wrap">
              {project.required_trades.slice(0, 3).map((trade, index) => (
                <Chip
                  key={index}
                  label={trade}
                  size="small"
                  color="primary"
                  sx={{
                    fontSize: { xs: "0.6rem", sm: "0.75rem" },
                    height: { xs: 20, sm: 24 },
                  }}
                />
              ))}
              {project.required_trades.length > 3 && (
                <Chip
                  label={`+${project.required_trades.length - 3} more`}
                  size="small"
                  color="primary"
                  sx={{
                    fontSize: { xs: "0.6rem", sm: "0.75rem" },
                    height: { xs: 20, sm: 24 },
                  }}
                />
              )}
            </Flex>
          </Box>
        )}
      </CardContent>

      <CardActions
        sx={{
          p: { xs: 2, md: 2 },
          pt: 0,
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          size="small"
          variant="text"
          color="primary"
          startIcon={<Icon icon="mdi:pencil" width={16} height={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project.id);
          }}
          sx={{
            fontSize: { xs: "0.75rem", md: "0.875rem" },
            textTransform: "none",
            minWidth: { xs: "32px", sm: "64px" },
            px: { xs: 0.5, sm: 2 },
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "inline" } }}>Edit</Box>
        </Button>

        <Button
          size="small"
          variant="text"
          color="error"
          startIcon={<Icon icon="mdi:delete" width={16} height={16} />}
          onClick={(e) => onDelete(project, e)}
          sx={{
            fontSize: { xs: "0.75rem", md: "0.875rem" },
            textTransform: "none",
            minWidth: { xs: "32px", sm: "64px" },
            px: { xs: 0.5, sm: 2 },
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "inline" } }}>Delete</Box>
        </Button>

        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:magnify" width={16} height={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(project.id);
          }}
          sx={{
            fontSize: { xs: "0.75rem", md: "0.875rem" },
            textTransform: "none",
            minWidth: { xs: "32px", sm: "64px" },
            px: { xs: 0.5, sm: 2 },
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "inline" } }}>View</Box>
        </Button>
      </CardActions>
    </CustomCard>
  );
};

export default ProjectCard;

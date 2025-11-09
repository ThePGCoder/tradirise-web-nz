// components/PositionsCard.tsx
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

import { PositionWithProfiles } from "../../page";

interface PositionCardProps {
  position: PositionWithProfiles;
  onEdit: (id: string) => void;
  onDelete: (position: PositionWithProfiles, event: React.MouseEvent) => void;
  onViewDetails: (id: string) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
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

  const isExpired = dayjs().isAfter(
    dayjs(position.posted_date).add(30, "days")
  );
  const expiryDays = getExpiryDays(position.posted_date);

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
      onClick={() => onViewDetails(position.id)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1, p: { xs: 2, md: 3 } }}>
        {/* Position Header */}
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Flex alignItems="center" gap={2} sx={{ mb: 0.5 }}>
            {position.profiles?.avatar_url && (
              <Avatar
                src={position.profiles.avatar_url}
                alt={position.profiles.username || "User"}
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
                {position.title || "No title specified"}
              </Typography>
              <Typography color="text.secondary">
                {position.trade || "General"}
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
            <Typography variant="body2">{position.region}</Typography>
          </Flex>

          {/* Rate */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
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
              {position.rate || "Rate not specified"},{" "}
              {position.remuneration || "Remuneration not specified"}
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
              {position.start_date ? getDaysUntil(position.start_date) : "TBD"}
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
              Posted {formatShortDate(position.posted_date)} (
              {getDaysUntil(position.posted_date)})
            </Typography>
          </Flex>
        </Box>
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
            onEdit(position.id);
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
          onClick={(e) => onDelete(position, e)}
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
            onViewDetails(position.id);
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

export default PositionCard;

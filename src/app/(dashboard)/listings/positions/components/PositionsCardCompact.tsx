// app/listings/positions/components/PositionsCardCompact.tsx
"use client";

import React from "react";
import { CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { PositionWithProfiles } from "../page";
import CustomCard from "@/components/CustomCard";

interface PositionsCardCompactProps {
  position: PositionWithProfiles;
  onViewDetails: (id: string) => void;
}

const PositionsCardCompact: React.FC<PositionsCardCompactProps> = ({
  position,
  onViewDetails,
}) => {
  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(1, "month");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(
    dayjs(position.posted_date).add(1, "month")
  );
  const expiryDays = getExpiryDays(position.posted_date);

  const getDaysUntil = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diff = date.diff(now, "day");

    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    if (diff < 0) return `${Math.abs(diff)}d ago`;
    return `in ${diff}d`;
  };

  const displayAvatar = position.is_business_listing
    ? position.businesses?.logo_url || null
    : position.profiles?.avatar_url || null;

  const displayName = position.is_business_listing
    ? position.businesses?.business_name || position.posted_by
    : position.posted_by;

  const avatarFallback = (
    position.is_business_listing
      ? position.businesses?.business_name?.[0] ||
        position.posted_by?.[0] ||
        "B"
      : position.profiles?.first_name?.[0] ||
        position.profiles?.username?.[0] ||
        position.posted_by?.[0] ||
        "U"
  ).toUpperCase();

  return (
    <CustomCard
      onClick={() => onViewDetails(position.id)}
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
          title={position.title}
        >
          {position.title}
        </Typography>

        {/* Avatar and Posted By */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar
            src={displayAvatar || undefined}
            alt={displayName || "User"}
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

        {/* Rate */}
        <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
          {position.rate || "TBD"}
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
          {/* Trade */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:hard-hat" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {position.trade}
            </Typography>
          </Box>

          {/* Region */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:map-marker" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {position.region}
            </Typography>
          </Box>

          {/* Start Date */}
          {position.start_date && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Icon icon="mdi:calendar-start" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary" noWrap>
                Starts {getDaysUntil(position.start_date)}
              </Typography>
            </Box>
          )}

          {/* Remuneration Type */}
          <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
            <Chip
              label={
                position.remuneration === "labour_only"
                  ? "Labour Only"
                  : position.remuneration.charAt(0).toUpperCase() +
                    position.remuneration.slice(1)
              }
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          </Box>
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default PositionsCardCompact;

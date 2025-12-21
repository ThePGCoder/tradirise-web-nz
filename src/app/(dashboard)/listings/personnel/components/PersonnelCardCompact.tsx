// app/listings/personnel/components/PersonnelCardCompact.tsx
"use client";

import React from "react";
import { CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { PersonnelWithProfile } from "../page";
import CustomCard from "@/components/CustomCard";

interface PersonnelCardCompactProps {
  person: PersonnelWithProfile;
  onViewDetails: (id: string) => void;
}

const PersonnelCardCompact: React.FC<PersonnelCardCompactProps> = ({
  person,
  onViewDetails,
}) => {
  const getExpiryDays = (createdDate: string) => {
    const expiry = dayjs(createdDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(person.created_at).add(30, "days"));
  const expiryDays = getExpiryDays(person.created_at);

  const getDisplayName = () => {
    const firstName = person.first_name || "";
    const lastName = person.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  const getDaysUntil = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diff = date.diff(now, "day");

    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    if (diff < 0) return `${Math.abs(diff)}d ago`;
    return `in ${diff}d`;
  };

  return (
    <CustomCard
      onClick={() => onViewDetails(person.id)}
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
        {/* Role - Main Title */}
        <Typography
          variant="body2"
          fontWeight={600}
          gutterBottom
          noWrap
          title={person.primary_trade_role || "No role specified"}
        >
          {person.primary_trade_role || "No role specified"}
        </Typography>

        {/* Avatar and Name */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar
            src={person.profiles?.avatar_url || undefined}
            alt={getDisplayName()}
            sx={{
              width: 24,
              height: 24,
              bgcolor: person.profiles?.avatar_url
                ? "transparent"
                : "primary.main",
            }}
          >
            {person.profiles?.avatar_url ? null : (
              <Icon icon="mdi:account-circle" width="100%" height="100%" />
            )}
          </Avatar>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            title={getDisplayName()}
          >
            {getDisplayName()}
          </Typography>
        </Box>

        {/* Status Badges */}
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
          <Chip
            label={isExpired ? "Expired" : "Available"}
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
          {/* Region */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:map-marker" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {person.region}
            </Typography>
          </Box>

          {/* Available From */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:calendar" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {getDaysUntil(person.available_from)}
            </Typography>
          </Box>

          {/* Accreditations */}
          {person.accreditations && person.accreditations.length > 0 && (
            <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
              <Chip
                label={
                  person.accreditations.length === 1
                    ? person.accreditations[0].split(":")[0] // Show just the category
                    : `${person.accreditations.length} certs`
                }
                size="small"
                color="info"
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

export default PersonnelCardCompact;

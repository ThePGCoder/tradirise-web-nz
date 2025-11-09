"use client";

import React from "react";
import {
  Typography,
  CardContent,
  Chip,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useThemeMode } from "@/hooks/useThemeMode";

// Add dayjs plugins
dayjs.extend(relativeTime);

export interface ListingCardData {
  id: string;
  created_at: string;
  title: string;
  bio?: string; // Added description field
  location: string;
  region: string;
  available_from?: string;
  max_servicable_radius?: number;
  accreditations?: string[];
  skills?: string[];
  is_for_self?: boolean;
  posted_by_name?: string;
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface ListingCardProps {
  data: ListingCardData;
  onViewDetails: (id: string) => void;
  onContact: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  expiryMonths?: number; // How many months from created_at until expiry (default: 1)
  showAvailableFrom?: boolean;
  showServiceRadius?: boolean;
  showAccreditations?: boolean;
  showDescription?: boolean; // Added prop to control description visibility
  maxDescriptionLength?: number; // Added prop to control description truncation
  statusBadgeText?: string;
  expiredBadgeText?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  onViewDetails,
  onContact,
  onSave,
  onShare,
  expiryMonths = 1,
  showAvailableFrom = true,
  showServiceRadius = true,
  showAccreditations = true,
  showDescription = true, // Default to showing description
  maxDescriptionLength = 150, // Default max length for description
  statusBadgeText = "Current",
  expiredBadgeText = "Expired",
}) => {
  const { mode } = useThemeMode();

  // Helper function to truncate description
  const truncateDescription = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Helper function to get days until/since a date
  const getDaysUntil = (date: string): string => {
    const targetDate = dayjs(date);
    const today = dayjs();
    const diff = targetDate.diff(today, "day");

    if (diff === 0) {
      return "today";
    } else if (diff === 1) {
      return "tomorrow";
    } else if (diff === -1) {
      return "yesterday";
    } else if (diff > 0) {
      return `in ${diff} days`;
    } else {
      return `${Math.abs(diff)} days ago`;
    }
  };

  // Helper function to get expiry date
  const getExpiryDate = (createdAt: string): dayjs.Dayjs => {
    return dayjs(createdAt).add(expiryMonths, "month");
  };

  const expiryDate = getExpiryDate(data.created_at);
  const isExpired = dayjs().isAfter(expiryDate);

  return (
    <CustomCard
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 300,
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.005)",
          boxShadow: 3,
        },
        opacity: isExpired ? 0.6 : 1,
        position: "relative",
        height: "100%",
        backgroundImage:
          mode === "light"
            ? "linear-gradient(#ffffff, #f8fafc)"
            : "linear-gradient(#4a5568, #2d3748)",
      }}
      onClick={() => onViewDetails(data.id)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Status Badge */}
        {!isExpired && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
            }}
          >
            <Chip
              label={statusBadgeText}
              size="small"
              color="success"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          </Box>
        )}

        {isExpired && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
            }}
          >
            <Chip
              label={expiredBadgeText}
              size="small"
              color="error"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          </Box>
        )}

        {/* Header Section */}
        <Box sx={{ mb: 2, pr: 8 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 0.5, lineHeight: 1.2 }}
          >
            {data.title}
          </Typography>
          <Flex alignItems="center" gap={0.5} color="text.secondary">
            <Box
              color="primary.main"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="mdi:location" height={16} />
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {data.location || data.region}
            </Typography>
          </Flex>
        </Box>

        {/* Accreditations and Skills Preview */}
        {((showAccreditations &&
          data.accreditations &&
          data.accreditations.length > 0) ||
          (data.skills && data.skills.length > 0)) && (
          <Box sx={{ mb: 2 }}>
            <Flex gap={1} flexWrap="wrap">
              {/* Accreditations */}
              {showAccreditations &&
                data.accreditations &&
                data.accreditations
                  .slice(0, 2)
                  .map((item, index) => (
                    <Chip
                      key={`acc-${index}`}
                      label={item}
                      size="small"
                      color="info"
                      sx={{ fontSize: "0.75rem", height: 24 }}
                    />
                  ))}

              {/* Skills */}
              {data.skills &&
                data.skills
                  .slice(0, 2)
                  .map((item, index) => (
                    <Chip
                      key={`skill-${index}`}
                      label={item}
                      size="small"
                      color="success"
                      sx={{ fontSize: "0.75rem", height: 24 }}
                    />
                  ))}

              {/* More indicator */}
              {((showAccreditations &&
                data.accreditations &&
                data.accreditations.length > 2) ||
                (data.skills && data.skills.length > 2)) && (
                <Chip
                  label={`+${
                    (showAccreditations && data.accreditations
                      ? data.accreditations.length
                      : 0) +
                    (data.skills ? data.skills.length : 0) -
                    4
                  } more`}
                  size="small"
                  color="default"
                  sx={{ fontSize: "0.75rem", height: 24 }}
                />
              )}
            </Flex>
          </Box>
        )}

        {/* Description Section */}
        {showDescription && data.bio && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.4,
                fontSize: "0.875rem",
              }}
            >
              {truncateDescription(data.bio, maxDescriptionLength)}
            </Typography>
          </Box>
        )}

        {/* Key Details List */}
        <Box sx={{ mt: 2 }}>
          {/* Available From */}
          {showAvailableFrom && data.available_from && (
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: 0.5, fontSize: "0.875rem" }}
            >
              <Box
                color="primary.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:calendar" height={16} />
              </Box>
              <Typography variant="body2">
                Available {getDaysUntil(data.available_from)}
              </Typography>
            </Flex>
          )}

          {/* Service Radius */}
          {showServiceRadius && data.max_servicable_radius && (
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: 0.5, fontSize: "0.875rem" }}
            >
              <Box
                color="primary.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:map-marker-radius" height={16} />
              </Box>
              <Typography variant="body2">
                {data.max_servicable_radius} km service radius
              </Typography>
            </Flex>
          )}

          {/* Posted By */}
          <Flex
            alignItems="center"
            gap={1}
            sx={{ py: 0.5, fontSize: "0.875rem" }}
          >
            <Box
              color="primary.main"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="mdi:account-circle" height={16} />
            </Box>
            <Flex gap={1} alignItems="center">
              <Typography variant="body2">
                Posted by{" "}
                {data.is_for_self
                  ? data.profiles?.username || "Self"
                  : data.posted_by_name ||
                    data.profiles?.username ||
                    "Unknown User"}
              </Typography>
              <Avatar
                src={data.profiles?.avatar_url}
                sx={{ height: 25, width: 25 }}
              />
            </Flex>
          </Flex>

          {/* Expires */}
          <Flex
            alignItems="center"
            gap={1}
            sx={{
              py: 0.5,
              fontSize: "0.875rem",
              opacity: isExpired ? 1 : 0.7,
            }}
          >
            <Box
              color={isExpired ? "error.main" : "text.secondary"}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="mdi:clock-outline" height={16} />
            </Box>
            <Typography
              variant="body2"
              color={isExpired ? "error.main" : "text.secondary"}
              sx={{
                textDecoration: isExpired ? "line-through" : "none",
              }}
            >
              Expires {getDaysUntil(expiryDate.format("YYYY-MM-DD"))}
            </Typography>
          </Flex>
        </Box>
      </CardContent>

      {/* Action Buttons - Only show for non-expired items */}
      {!isExpired && (
        <Flex sx={{ p: 2, pt: 0 }} justifyContent="flex-end" gap={2}>
          <Button
            variant="text"
            color="info"
            startIcon={<Icon icon="mdi:star" width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onSave(data.id);
            }}
          >
            Save
          </Button>
          <Button
            variant="text"
            color="success"
            startIcon={<Icon icon="mdi:share-variant" width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onShare(data.id);
            }}
          >
            Share
          </Button>
          <Button
            startIcon={<Icon icon="mdi:email" width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onContact(data.id);
            }}
          >
            Contact
          </Button>
        </Flex>
      )}
    </CustomCard>
  );
};

export default ListingCard;

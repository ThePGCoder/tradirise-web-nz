// components/PositionsCard.tsx
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

import { PositionWithProfiles } from "../page";
import ContactPositionDialog from "./ContactPositionDialog";

interface PositionCardProps {
  position: PositionWithProfiles;
  onViewDetails: (id: string) => void;
  onSave?: (id: string) => void;
}

const PositionsCard: React.FC<PositionCardProps> = ({
  position,
  onViewDetails,
  onSave,
}) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingResponse, setIsCheckingResponse] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const checkExistingResponse = async () => {
    try {
      const response = await fetch(
        `/api/ad-responses/check-existing?ad_id=${position.id}&ad_type=position`
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

  useEffect(() => {
    checkExistingResponse();
  }, [position.id]);

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

  const expiryDate = getExpiryDate(position.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);
  const expiryDays = getExpiryDays(position.posted_date);

  // Determine display information based on whether it's a business or personal listing
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

  // Determine button state
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
                  {position.title}
                </Typography>
                <Typography color="text.secondary">{position.trade}</Typography>
              </Box>
            </Flex>
          </Box>

          {/* Status Badge */}
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
            {position.is_business_listing && (
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

          {/* Key Details List */}
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            {/* Location */}
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
              <Typography variant="body2">{position.region}</Typography>
            </Flex>

            {/* Rate */}
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
                {position.rate || "Rate not specified"},{" "}
                {position.remuneration === "labour_only"
                  ? "Labour Only"
                  : position.remuneration.charAt(0).toUpperCase() +
                    position.remuneration.slice(1)}
              </Typography>
            </Flex>

            {/* Start Date */}
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
                {position.start_date
                  ? getDaysUntil(position.start_date)
                  : "TBD"}
              </Typography>
            </Flex>

            {/* Posted Date */}
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
                Posted {formatShortDate(position.posted_date)} (
                {getDaysUntil(position.posted_date)})
              </Typography>
            </Flex>
          </Box>
        </CardContent>

        <CardActions
          sx={{ p: { xs: 2, md: 2 }, pt: 0, justifyContent: "flex-end" }}
        >
          {/* View Button */}
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<Icon icon="mdi:magnify" width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(position.id);
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

          {/* Favourite Button */}
          <FavouriteButton
            itemType="position"
            itemId={position.id}
            size="small"
            onToggle={() => {
              if (onSave) onSave(position.id);
            }}
          />

          {/* Share Button */}
          <Box onClick={(e) => e.stopPropagation()}>
            <ShareButton
              useModal={true}
              variant="text"
              buttonText="Share"
              color="success"
              shareData={{
                url: `${window.location.origin}/listings/positions/${position.id}`,
                title: `${position.title} - ${position.trade}`,
                description:
                  position.description ||
                  `${position.title} in ${position.region}. Rate: ${position.rate}`,
              }}
            />
          </Box>

          {/* Apply Button */}
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

      <ContactPositionDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        positionId={position.id}
        positionTitle={position.title}
        positionTrade={position.trade}
        onSuccess={handleContactSuccess}
      />
    </>
  );
};

export default PositionsCard;

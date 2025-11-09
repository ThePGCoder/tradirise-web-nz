// components/PersonnelCard.tsx
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

import { PersonnelWithProfile } from "../page";
import FavouriteButton from "@/app/(dashboard)/my-favourites/components/FavouriteButton";
import ShareButton from "@/components/ShareButton";
import ContactDialog from "./ContactDialog";

interface PersonnelCardProps {
  person: PersonnelWithProfile;
  onViewDetails: (id: string) => void;
  onContact: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
}

const PersonnelCard: React.FC<PersonnelCardProps> = ({
  person,
  onViewDetails,
}) => {
  const [hasResponded, setHasResponded] = useState(false);
  const [isCheckingResponse, setIsCheckingResponse] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    checkExistingResponse();
  }, [person.id]);

  const checkExistingResponse = async () => {
    try {
      const response = await fetch(
        `/api/ad-responses/check-existing?ad_id=${person.id}&ad_type=personnel`
      );
      if (response.ok) {
        const data = await response.json();
        setHasResponded(data.has_responded);
      }
    } catch (err) {
      console.error("Error checking existing response:", err);
    } finally {
      setIsCheckingResponse(false);
    }
  };

  const handleContactSuccess = () => {
    setHasResponded(true);
  };

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

  const getExpiryDays = (createdDate: string) => {
    const expiry = dayjs(createdDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(person.created_at).add(30, "days"));
  const expiryDays = getExpiryDays(person.created_at);

  const getContactButtonProps = () => {
    if (isCheckingResponse) {
      return {
        disabled: true,
        text: "Loading...",
        icon: <CircularProgress size={16} color="inherit" />,
        color: "primary" as const,
      };
    }
    if (hasResponded) {
      return {
        disabled: true,
        text: "Contacted",
        icon: <Icon icon="mdi:check-circle" width={16} height={16} />,
        color: "success" as const,
      };
    }
    if (isExpired) {
      return {
        disabled: true,
        text: "Expired",
        icon: <Icon icon="mdi:email" width={16} height={16} />,
        color: "primary" as const,
      };
    }
    return {
      disabled: false,
      text: "Contact",
      icon: <Icon icon="mdi:email" width={16} height={16} />,
      color: "primary" as const,
    };
  };

  const contactButtonProps = getContactButtonProps();

  const getDisplayName = () => {
    const firstName = person.first_name || "";
    const lastName = person.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  // Skills are stored as pre-formatted strings like "Plumber: Drainage"

  // Accreditations are stored as pre-formatted strings like "Electrical: Registered Electrician"
  const formatAccreditationLabel = (
    accreditation: string | unknown
  ): string => {
    if (typeof accreditation === "string") {
      return accreditation;
    }
    // Fallback - shouldn't happen with clean data
    console.warn("Unexpected accreditation format:", accreditation);
    return String(accreditation);
  };

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
        onClick={() => onViewDetails(person.id)}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1, p: { xs: 2, md: 3 } }}>
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Flex alignItems="center" gap={2} sx={{ mb: 0.5 }}>
              <Avatar
                src={person.profiles?.avatar_url || undefined}
                alt={getDisplayName()}
                sx={{
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  flexShrink: 0,
                  bgcolor: person.profiles?.avatar_url
                    ? "transparent"
                    : "primary.main",
                }}
              >
                {person.profiles?.avatar_url ? null : (
                  <Icon icon="mdi:account-circle" width="100%" height="100%" />
                )}
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
                  {person.primary_trade_role || "No role specified"}
                </Typography>
                <Typography color="text.secondary">
                  {getDisplayName()}
                </Typography>
              </Box>
            </Flex>
          </Box>

          <Flex gap={1} sx={{ mb: 1, flexWrap: "wrap" }}>
            <Chip
              label={isExpired ? "Expired" : "Available"}
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
            {hasResponded && !isExpired && (
              <Chip
                label="Contacted"
                size="small"
                color="info"
                sx={{ fontSize: "0.7rem", height: 20 }}
                icon={<Icon icon="mdi:check-circle" width={12} height={12} />}
              />
            )}
          </Flex>

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
              <Typography variant="body2">{person.region}</Typography>
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
                <Icon icon="mdi:calendar" height={16} />
              </Box>
              <Typography variant="body2">
                Available {getDaysUntil(person.available_from)}
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
                Posted {formatShortDate(person.created_at)} (
                {getDaysUntil(person.created_at)})
              </Typography>
            </Flex>
          </Box>

          {person.accreditations && person.accreditations.length > 0 && (
            <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
              <Typography variant="body2" fontWeight={500} mb={1}>
                Accreditations:
              </Typography>
              <Flex gap={1} flexWrap="wrap">
                {person.accreditations.length === 1 ? (
                  <Chip
                    label={formatAccreditationLabel(person.accreditations[0])}
                    size="small"
                    color="info"
                    sx={{
                      fontSize: { xs: "0.6rem", sm: "0.75rem" },
                      height: { xs: 20, sm: 24 },
                    }}
                  />
                ) : (
                  <>
                    <Chip
                      label={formatAccreditationLabel(person.accreditations[0])}
                      size="small"
                      color="info"
                      sx={{
                        fontSize: { xs: "0.6rem", sm: "0.75rem" },
                        height: { xs: 20, sm: 24 },
                      }}
                    />
                    <Chip
                      label={`+${person.accreditations.length - 1} more`}
                      size="small"
                      color="info"
                      sx={{
                        fontSize: { xs: "0.6rem", sm: "0.75rem" },
                        height: { xs: 20, sm: 24 },
                      }}
                    />
                  </>
                )}
              </Flex>
            </Box>
          )}
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
              onViewDetails(person.id);
            }}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              minWidth: { xs: "auto", sm: "64px" },
              px: { xs: 1, sm: 2 },
              "& .MuiButton-startIcon": {
                margin: { xs: 0, sm: "0 8px 0 -4px" },
              },
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>View</Box>
          </Button>

          <FavouriteButton
            itemType="personnel"
            itemId={person.id}
            size="small"
          />

          <Box onClick={(e) => e.stopPropagation()}>
            <ShareButton
              useModal={true}
              variant="text"
              buttonText="Share"
              color="success"
              shareData={{
                url: `${window.location.origin}/personnel/${person.id}`,
                title: `${getDisplayName()} - ${
                  person.primary_trade_role || "Trade Professional"
                }`,
                description:
                  person.bio ||
                  `Check out ${getDisplayName()}, a ${
                    person.primary_trade_role || "professional"
                  } in ${person.region || "your area"}`,
              }}
            />
          </Box>

          <Button
            size="small"
            variant="contained"
            color={contactButtonProps.color}
            disabled={contactButtonProps.disabled}
            startIcon={contactButtonProps.icon}
            onClick={(e) => {
              e.stopPropagation();
              if (!contactButtonProps.disabled) {
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
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>
              {contactButtonProps.text}
            </Box>
            <Box sx={{ display: { xs: "inline", sm: "none" } }}>
              {contactButtonProps.text}
            </Box>
          </Button>
        </CardActions>
      </CustomCard>

      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        personnelId={person.id}
        personnelName={getDisplayName()}
        personnelRole={person.primary_trade_role || "Personnel"}
        onSuccess={handleContactSuccess}
      />
    </>
  );
};

export default PersonnelCard;

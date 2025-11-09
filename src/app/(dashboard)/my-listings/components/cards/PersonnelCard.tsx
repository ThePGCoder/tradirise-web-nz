// components/PersonnelCard.tsx
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

import { PersonnelWithProfile } from "../../page";

interface PersonnelCardProps {
  person: PersonnelWithProfile;
  showContactDetails?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (person: PersonnelWithProfile, event: React.MouseEvent) => void;
  onView?: (id: string) => void;
  onClick?: (id: string) => void;
}

const PersonnelCard: React.FC<PersonnelCardProps> = ({
  person,
  showContactDetails = true,
  onEdit,
  onDelete,
  onView,
  onClick,
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

  const getExpiryDays = (createdDate: string) => {
    const expiry = dayjs(createdDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(person.created_at).add(30, "days"));
  const expiryDays = getExpiryDays(person.created_at);

  return (
    <CustomCard
      sx={{
        display: "flex",
        flexDirection: "column",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": onClick
          ? {
              transform: "scale(1.005)",
              boxShadow: 3,
            }
          : {},
        position: "relative",
        height: "100%",
      }}
      onClick={() => onClick?.(person.id)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1, p: { xs: 2, md: 3 } }}>
        {/* Personnel Header */}
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Flex alignItems="center" gap={2} sx={{ mb: 0.5 }}>
            {person.profiles?.avatar_url && (
              <Avatar
                src={person.profiles.avatar_url}
                alt={`${person.first_name} ${person.last_name}`}
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
                {person.primary_trade_role || "No role specified"}
              </Typography>
              <Typography color="text.secondary">
                {person.first_name} {person.last_name}
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
            <Typography variant="body2">{person.region}</Typography>
          </Flex>

          {/* Available From */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
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
              Posted {formatShortDate(person.created_at)} (
              {getDaysUntil(person.created_at)})
            </Typography>
          </Flex>
        </Box>

        {/* Contact Info - Conditional */}
        {showContactDetails && (
          <Box sx={{ mt: 1 }}>
            {person.contact_email && (
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
                  <Icon icon="mdi:email" height={16} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-all",
                    overflow: "hidden",
                  }}
                >
                  {person.contact_email}
                </Typography>
              </Flex>
            )}
            {person.mobile && (
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
                  <Icon icon="mdi:phone" height={16} />
                </Box>
                <Typography variant="body2">{person.mobile}</Typography>
              </Flex>
            )}
            {person.website && (
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
                  <Icon icon="mdi:web" height={16} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-all",
                    overflow: "hidden",
                  }}
                >
                  {person.website.replace(/^https?:\/\//, "")}
                </Typography>
              </Flex>
            )}
          </Box>
        )}

        {/* Accreditations */}
        {person.accreditations && person.accreditations.length > 0 && (
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Accreditations:
            </Typography>
            <Flex gap={1} flexWrap="wrap">
              {person.accreditations.length === 1 ? (
                <Chip
                  label={person.accreditations[0]}
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
                    label={person.accreditations[0]}
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

      {/* Card Actions - Only show if handlers are provided */}
      {(onEdit || onDelete || onView) && (
        <CardActions
          sx={{
            p: { xs: 2, md: 2 },
            pt: 0,
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          {onEdit && (
            <Button
              size="small"
              variant="text"
              color="primary"
              startIcon={<Icon icon="mdi:pencil" width={16} height={16} />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(person.id);
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
          )}

          {onDelete && (
            <Button
              size="small"
              variant="text"
              color="error"
              startIcon={<Icon icon="mdi:delete" width={16} height={16} />}
              onClick={(e) => onDelete(person, e)}
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
          )}

          {onView && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<Icon icon="mdi:magnify" width={16} height={16} />}
              onClick={(e) => {
                e.stopPropagation();
                onView(person.id);
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
          )}
        </CardActions>
      )}
    </CustomCard>
  );
};

export default PersonnelCard;

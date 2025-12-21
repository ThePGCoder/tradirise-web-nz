// components/cards/PlantCard.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  CardContent,
  CardActions,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";

import { PlantWithProfile } from "../../page";

interface PlantCardProps {
  equipment: PlantWithProfile;
  onEdit?: (id: string) => void;
  onDelete?: (equipment: PlantWithProfile, event: React.MouseEvent) => void;
  onView?: (id: string) => void;
  onClick?: (id: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({
  equipment,
  onEdit,
  onDelete,
  onView,
  onClick,
}) => {
  // Safety check
  if (!equipment) {
    console.error("PlantCard: equipment is undefined");
    return null;
  }

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

  const formatPrice = () => {
    if (!equipment.sale_price) return "POA";
    const priceStr = `$${Number(equipment.sale_price).toLocaleString()}`;
    if (equipment.price_type === "negotiable")
      return `${priceStr} (negotiable)`;
    return priceStr;
  };

  const getEquipmentSubtitle = () => {
    const parts = [];
    if (equipment.year) parts.push(equipment.year);
    if (equipment.make) parts.push(equipment.make);
    if (equipment.model) parts.push(equipment.model);
    return parts.length > 0 ? parts.join(" ") : equipment.equipment_type;
  };

  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(
    dayjs(equipment.posted_date).add(30, "days")
  );
  const expiryDays = getExpiryDays(equipment.posted_date);

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
      onClick={() => onClick?.(equipment.id)}
    >
      {/* Image Section */}
      {equipment.images && equipment.images.length > 0 && (
        <Box
          sx={{
            width: "100%",
            height: 200,
            overflow: "hidden",
            position: "relative",
            bgcolor: "grey.100",
          }}
        >
          <Box
            component="img"
            src={equipment.images[0]}
            alt={equipment.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {equipment.images.length > 1 && (
            <Chip
              label={`+${equipment.images.length - 1}`}
              size="small"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1, p: { xs: 2, md: 3 } }}>
        {/* Equipment Header */}
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Typography
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
              fontWeight: "bold",
              lineHeight: 1.2,
              wordBreak: "break-word",
              mb: 0.5,
            }}
          >
            {equipment.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {getEquipmentSubtitle()}
          </Typography>
        </Box>

        {/* Status Badges */}
        <Flex gap={1} sx={{ mb: 1, flexWrap: "wrap" }}>
          <Chip
            label={isExpired ? "Expired" : "Active"}
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
          <Chip
            label={equipment.listing_type === "sale" ? "For Sale" : "For Hire"}
            size="small"
            color="primary"
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
          <Chip
            label={equipment.condition}
            size="small"
            color="info"
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
        </Flex>

        {/* Key Details */}
        <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
          {/* Price */}
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
            <Typography variant="body2" fontWeight={600} color="success.main">
              {formatPrice()}
            </Typography>
          </Flex>

          {/* Hours Used */}
          {equipment.hours_used !== undefined &&
            equipment.hours_used !== null && (
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
                  {equipment.hours_used.toLocaleString()} hours
                </Typography>
              </Flex>
            )}

          {/* Category */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box
              color="primary.main"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="mdi:tag" height={16} />
            </Box>
            <Typography variant="body2">{equipment.category}</Typography>
          </Flex>

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
            <Typography variant="body2">{equipment.region}</Typography>
          </Flex>

          {/* Delivery */}
          {equipment.delivery_available && (
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
                <Icon icon="mdi:truck-delivery" height={16} />
              </Box>
              <Typography variant="body2">Delivery available</Typography>
            </Flex>
          )}

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
              Posted {getDaysUntil(equipment.posted_date)}
            </Typography>
          </Flex>
        </Box>

        {/* Features */}
        {equipment.features && equipment.features.length > 0 && (
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Key Features:
            </Typography>
            <Flex gap={0.5} flexWrap="wrap">
              {equipment.features.slice(0, 2).map((feature, idx) => (
                <Chip
                  key={idx}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: { xs: "0.6rem", sm: "0.7rem" },
                    height: { xs: 18, sm: 20 },
                  }}
                />
              ))}
              {equipment.features.length > 2 && (
                <Chip
                  label={`+${equipment.features.length - 2} more`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: { xs: "0.6rem", sm: "0.7rem" },
                    height: { xs: 18, sm: 20 },
                  }}
                />
              )}
            </Flex>
          </Box>
        )}
      </CardContent>

      {/* Card Actions */}
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
                onEdit(equipment.id);
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
              onClick={(e) => onDelete(equipment, e)}
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
                onView(equipment.id);
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

export default PlantCard;

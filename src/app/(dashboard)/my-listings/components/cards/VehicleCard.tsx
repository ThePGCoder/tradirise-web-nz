// components/cards/VehicleCard.tsx
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

import { VehicleWithProfile } from "../../page";

interface VehicleCardProps {
  vehicle: VehicleWithProfile;
  onEdit?: (id: string) => void;
  onDelete?: (vehicle: VehicleWithProfile, event: React.MouseEvent) => void;
  onView?: (id: string) => void;
  onClick?: (id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
  onDelete,
  onView,
  onClick,
}) => {
  // Safety check
  if (!vehicle) {
    console.error("VehicleCard: vehicle is undefined");
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
    const priceStr = `$${Number(vehicle.price).toLocaleString()}`;
    if (vehicle.price_type === "negotiable") return `${priceStr} (negotiable)`;
    return priceStr;
  };

  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    const date = dayjs(dateString);
    const now = dayjs();
    const diff = date.diff(now, "day");
    return diff >= 0 && diff <= 30;
  };

  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(vehicle.posted_date).add(30, "days"));
  const expiryDays = getExpiryDays(vehicle.posted_date);

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
      onClick={() => onClick?.(vehicle.id)}
    >
      {/* Image Section */}
      {vehicle.images && vehicle.images.length > 0 && (
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
            src={vehicle.images[0]}
            alt={vehicle.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {vehicle.images.length > 1 && (
            <Chip
              label={`+${vehicle.images.length - 1}`}
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
        {/* Vehicle Header */}
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
            {vehicle.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {vehicle.year} {vehicle.make} {vehicle.model}
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
            label={vehicle.condition}
            size="small"
            color="info"
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
          {isExpiringSoon(vehicle.wof_expires) && (
            <Chip
              label="WOF Due Soon"
              size="small"
              color="warning"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          )}
          {isExpiringSoon(vehicle.registration_expires) && (
            <Chip
              label="Rego Due Soon"
              size="small"
              color="warning"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          )}
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

          {/* Vehicle Type */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box
              color="primary.main"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="mdi:car" height={16} />
            </Box>
            <Typography variant="body2">{vehicle.vehicle_type}</Typography>
          </Flex>

          {/* Mileage */}
          {vehicle.mileage !== undefined && vehicle.mileage !== null && (
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
                <Icon icon="mdi:speedometer" height={16} />
              </Box>
              <Typography variant="body2">
                {vehicle.mileage.toLocaleString()} km
              </Typography>
            </Flex>
          )}

          {/* Transmission & Fuel */}
          {(vehicle.transmission || vehicle.fuel_type) && (
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
                <Icon icon="mdi:cog" height={16} />
              </Box>
              <Typography variant="body2">
                {[vehicle.transmission, vehicle.fuel_type]
                  .filter(Boolean)
                  .join(" • ")}
              </Typography>
            </Flex>
          )}

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
            <Typography variant="body2">{vehicle.region}</Typography>
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
              Posted {getDaysUntil(vehicle.posted_date)}
            </Typography>
          </Flex>
        </Box>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Features:
            </Typography>
            <Flex gap={0.5} flexWrap="wrap">
              {vehicle.features.slice(0, 2).map((feature, idx) => (
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
              {vehicle.features.length > 2 && (
                <Chip
                  label={`+${vehicle.features.length - 2} more`}
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
                onEdit(vehicle.id);
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
              onClick={(e) => onDelete(vehicle, e)}
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
                onView(vehicle.id);
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

export default VehicleCard;

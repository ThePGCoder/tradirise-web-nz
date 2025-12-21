// components/cards/MaterialCard.tsx
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

import { MaterialWithProfile } from "../../page";

interface MaterialCardProps {
  material: MaterialWithProfile;
  onEdit?: (id: string) => void;
  onDelete?: (material: MaterialWithProfile, event: React.MouseEvent) => void;
  onView?: (id: string) => void;
  onClick?: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onEdit,
  onDelete,
  onView,
  onClick,
}) => {
  // Safety check
  if (!material) {
    console.error("MaterialCard: material is undefined");
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
    const priceStr = `$${Number(material.price).toLocaleString()}`;
    if (material.price_type === "negotiable") return `${priceStr} (negotiable)`;
    if (material.price_unit) return `${priceStr}/${material.price_unit}`;
    return priceStr;
  };

  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(
    dayjs(material.posted_date).add(30, "days")
  );
  const expiryDays = getExpiryDays(material.posted_date);

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
      onClick={() => onClick?.(material.id)}
    >
      {/* Image Section */}
      {material.images && material.images.length > 0 && (
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
            src={material.images[0]}
            alt={material.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {material.images.length > 1 && (
            <Chip
              label={`+${material.images.length - 1}`}
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
        {/* Material Header */}
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
            {material.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {material.material_type} • {material.category}
          </Typography>
        </Box>

        {/* Status Badge */}
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
            label={material.condition}
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

          {/* Quantity */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box
              color="primary.main"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="mdi:package-variant" height={16} />
            </Box>
            <Typography variant="body2">
              {material.quantity} {material.unit}
            </Typography>
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
            <Typography variant="body2">{material.region}</Typography>
          </Flex>

          {/* Delivery */}
          {material.delivery_available && (
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
              Posted {getDaysUntil(material.posted_date)}
            </Typography>
          </Flex>
        </Box>

        {/* Description */}
        {material.description && (
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {material.description}
            </Typography>
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
                onEdit(material.id);
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
              onClick={(e) => onDelete(material, e)}
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
                onView(material.id);
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

export default MaterialCard;

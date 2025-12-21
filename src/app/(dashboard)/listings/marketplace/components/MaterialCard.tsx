// app/listings/marketplace/components/MaterialCard.tsx
"use client";

import React from "react";
import {
  Typography,
  CardContent,
  CardActions,
  Chip,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import FavouriteButton from "@/app/(dashboard)/my-favourites/components/FavouriteButton";
import ShareButton from "@/components/ShareButton";
import { MaterialAd } from "../page";

interface MaterialCardProps {
  material: MaterialAd;
  onViewDetails: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onViewDetails,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDaysAgo = (date: string): string => {
    const postedDate = dayjs(date);
    const today = dayjs();
    const diff = today.diff(postedDate, "day");

    if (diff === 0) return "today";
    if (diff === 1) return "yesterday";
    return `${diff} days ago`;
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

  // Handle both flattened (from views) and nested (from joins) data structures
  const displayAvatar = material.is_business_listing
    ? material.business_logo_url || material.businesses?.logo_url || null
    : material.avatar_url || material.profiles?.avatar_url || null;

  const displayName = material.is_business_listing
    ? material.business_name ||
      material.businesses?.business_name ||
      material.contact_name
    : material.contact_name;

  const firstName = material.first_name || material.profiles?.first_name;
  const username = material.username || material.profiles?.username;
  const businessName =
    material.business_name || material.businesses?.business_name;

  const avatarFallback = material.is_business_listing
    ? (businessName?.[0] || material.contact_name?.[0] || "B").toUpperCase()
    : (
        firstName?.[0] ||
        username?.[0] ||
        material.contact_name?.[0] ||
        "U"
      ).toUpperCase();

  return (
    <CustomCard
      sx={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.005)",
        },
        height: "100%",
        overflow: "hidden",
      }}
      onClick={() => onViewDetails(material.id)}
    >
      {/* Material Image */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          backgroundColor: "grey.200",
          backgroundImage: material.images?.[0]
            ? `url(${material.images[0]})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {!material.images?.[0] && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "grey.500",
            }}
          >
            <Icon icon="mdi:package-variant" width={60} height={60} />
            <Typography variant="caption" sx={{ mt: 1 }}>
              No Image Available
            </Typography>
          </Box>
        )}
        {material.images && material.images.length > 1 && (
          <Chip
            label={`+${material.images.length - 1} ${material.images.length === 2 ? "photo" : "photos"}`}
            size="small"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              fontSize: "0.7rem",
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1, p: { xs: 2, md: 3 } }}>
        {/* Material Header */}
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Flex alignItems="center" gap={2} sx={{ mb: 0.5 }}>
            <Avatar
              src={displayAvatar || undefined}
              alt={displayName}
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                flexShrink: 0,
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
                {material.title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {material.material_type}
              </Typography>
            </Box>
          </Flex>
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
            label={material.condition}
            size="small"
            color={material.condition === "new" ? "success" : "default"}
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
          <Chip
            label={material.category}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
          {material.is_business_listing && (
            <Chip
              label="Business"
              size="small"
              color="primary"
              variant="outlined"
              icon={<Icon icon="mdi:domain" width={14} />}
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          )}
          {material.delivery_available && (
            <Chip
              label="Delivery"
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          )}
        </Flex>

        {/* Key Details */}
        <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
          {/* Price */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box color="primary.main" sx={{ display: "flex" }}>
              <Icon icon="mdi:currency-usd" height={16} />
            </Box>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {formatPrice(material.price)}
            </Typography>
            {material.price_unit && (
              <Chip
                label={material.price_unit}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.6rem", height: 18 }}
              />
            )}
          </Flex>

          {/* Quantity */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box color="primary.main" sx={{ display: "flex" }}>
              <Icon icon="mdi:package" height={16} />
            </Box>
            <Typography variant="body2">
              {material.quantity} {material.unit}
              {material.available_quantity &&
                ` (${material.available_quantity} available)`}
            </Typography>
          </Flex>

          {/* Location */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box color="primary.main" sx={{ display: "flex" }}>
              <Icon icon="mdi:map-marker" height={16} />
            </Box>
            <Typography variant="body2">{material.region}</Typography>
          </Flex>

          {/* Brand */}
          {material.brand && (
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box color="primary.main" sx={{ display: "flex" }}>
                <Icon icon="mdi:tag" height={16} />
              </Box>
              <Typography variant="body2">{material.brand}</Typography>
            </Flex>
          )}

          {/* Posted Date */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box color="primary.main" sx={{ display: "flex" }}>
              <Icon icon="mdi:calendar" height={16} />
            </Box>
            <Typography variant="body2">
              Posted {getDaysAgo(material.posted_date)}
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
            onViewDetails(material.id);
          }}
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            minWidth: { xs: "auto", sm: "64px" },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "inline" } }}>View</Box>
        </Button>

        {/* Favourite Button */}
        <FavouriteButton
          itemType="material"
          itemId={material.id}
          size="small"
        />

        {/* Share Button */}
        <Box onClick={(e) => e.stopPropagation()}>
          <ShareButton
            useModal={true}
            variant="text"
            buttonText="Share"
            color="success"
            shareData={{
              url: `${window.location.origin}/listings/marketplace/material/${material.id}`,
              title: material.title,
              description:
                material.description ||
                `${material.material_type} - ${material.quantity} ${material.unit}`,
            }}
          />
        </Box>

        {/* Contact Button */}
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:email" width={16} height={16} />}
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Open contact dialog
          }}
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            minWidth: { xs: "auto", sm: "64px" },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "inline" } }}>Contact</Box>
          <Box sx={{ display: { xs: "inline", sm: "none" } }}>Contact</Box>
        </Button>
      </CardActions>
    </CustomCard>
  );
};

export default MaterialCard;

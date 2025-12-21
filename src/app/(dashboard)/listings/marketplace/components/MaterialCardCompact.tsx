// app/listings/marketplace/components/MaterialCardCompact.tsx
"use client";

import React from "react";
import { CardContent, CardMedia, Typography, Box, Chip } from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { MaterialAd } from "../page";
import CustomCard from "@/components/CustomCard";

interface MaterialCardCompactProps {
  material: MaterialAd;
  onViewDetails: (id: string) => void;
}

const MaterialCardCompact: React.FC<MaterialCardCompactProps> = ({
  material,
  onViewDetails,
}) => {
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
      onClick={() => onViewDetails(material.id)}
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
      <CardMedia
        component="img"
        height="160"
        image={material.images?.[0] || "/placeholder-materials.jpg"}
        alt={material.title}
        sx={{
          objectFit: "cover",
          backgroundColor: "grey.200",
        }}
      />
      <CardContent
        sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          gutterBottom
          noWrap
          title={material.title}
        >
          {material.title}
        </Typography>

        <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
          ${material.price?.toLocaleString() || "0"}
          {material.price_unit && (
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              ml={0.5}
            >
              {material.price_unit}
            </Typography>
          )}
        </Typography>

        {/* Expiry Badge */}
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
          <Chip
            label={isExpired ? "Expired" : "Active"}
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

        <Box display="flex" flexDirection="column" gap={0.5} mt="auto">
          {/* Quantity */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:package" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary">
              {material.quantity} {material.unit}
            </Typography>
          </Box>

          {/* Badges */}
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {material.condition && (
              <Chip
                label={material.condition}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
            {material.category && (
              <Chip
                label={material.category}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>

          {/* Location */}
          {material.region && (
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              <Icon icon="mdi:map-marker" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {material.region}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default MaterialCardCompact;

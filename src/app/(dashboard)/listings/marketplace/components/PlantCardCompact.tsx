// app/listings/marketplace/components/PlantCardCompact.tsx
"use client";

import React from "react";
import { CardContent, CardMedia, Typography, Box, Chip } from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { PlantAd } from "../page";
import CustomCard from "@/components/CustomCard";

interface PlantCardCompactProps {
  plant: PlantAd;
  onViewDetails: (id: string) => void;
}

const PlantCardCompact: React.FC<PlantCardCompactProps> = ({
  plant,
  onViewDetails,
}) => {
  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(plant.posted_date).add(30, "days"));
  const expiryDays = getExpiryDays(plant.posted_date);

  return (
    <CustomCard
      onClick={() => onViewDetails(plant.id)}
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
        image={plant.images?.[0] || "/placeholder-equipment.jpg"}
        alt={plant.title}
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
          title={plant.title}
        >
          {plant.title}
        </Typography>

        <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
          ${plant.sale_price?.toLocaleString() || "POA"}
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
          {plant.year && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Icon icon="mdi:calendar" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary">
                {plant.year}
              </Typography>
              {plant.hours_used != null && (
                <>
                  <Typography variant="caption" color="text.secondary" mx={0.5}>
                    •
                  </Typography>
                  <Icon icon="mdi:clock-outline" width={14} color="#666" />
                  <Typography variant="caption" color="text.secondary">
                    {plant.hours_used.toLocaleString()} hrs
                  </Typography>
                </>
              )}
            </Box>
          )}

          <Box display="flex" gap={0.5} flexWrap="wrap">
            {plant.condition && (
              <Chip
                label={plant.condition}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
            {plant.category && (
              <Chip
                label={plant.category}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>

          {plant.region && (
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              <Icon icon="mdi:map-marker" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {plant.region}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default PlantCardCompact;

// app/listings/marketplace/components/VehicleCardCompact.tsx
"use client";

import React from "react";
import { CardContent, CardMedia, Typography, Box, Chip } from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { VehicleAd } from "../page";
import CustomCard from "@/components/CustomCard";

interface VehicleCardCompactProps {
  vehicle: VehicleAd;
  onViewDetails: (id: string) => void;
}

const VehicleCardCompact: React.FC<VehicleCardCompactProps> = ({
  vehicle,
  onViewDetails,
}) => {
  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(vehicle.posted_date).add(30, "days"));
  const expiryDays = getExpiryDays(vehicle.posted_date);

  return (
    <CustomCard
      onClick={() => onViewDetails(vehicle.id)}
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
        image={vehicle.images?.[0] || "/placeholder-vehicle.jpg"}
        alt={vehicle.title}
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
          title={vehicle.title}
        >
          {vehicle.title}
        </Typography>

        <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
          ${vehicle.price?.toLocaleString() || "0"}
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
          {vehicle.year && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Icon icon="mdi:calendar" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary">
                {vehicle.year}
              </Typography>
              {vehicle.mileage != null && (
                <>
                  <Typography variant="caption" color="text.secondary" mx={0.5}>
                    •
                  </Typography>
                  <Icon icon="mdi:speedometer" width={14} color="#666" />
                  <Typography variant="caption" color="text.secondary">
                    {vehicle.mileage.toLocaleString()} km
                  </Typography>
                </>
              )}
            </Box>
          )}

          <Box display="flex" gap={0.5} flexWrap="wrap">
            {vehicle.condition && (
              <Chip
                label={vehicle.condition}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
            {vehicle.transmission && (
              <Chip
                label={vehicle.transmission}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>

          {vehicle.region && (
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              <Icon icon="mdi:map-marker" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {vehicle.region}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default VehicleCardCompact;

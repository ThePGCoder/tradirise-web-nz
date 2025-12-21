// app/listings/businesses/components/BusinessCardCompact.tsx
"use client";

import React from "react";
import { CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import { Icon } from "@iconify/react";
import { Business } from "@/types/business";
import CustomCard from "@/components/CustomCard";

interface BusinessCardCompactProps {
  data: Business;
  onViewDetails: (id: string) => void;
}

const BusinessCardCompact: React.FC<BusinessCardCompactProps> = ({
  data,
  onViewDetails,
}) => {
  return (
    <CustomCard
      onClick={() => onViewDetails(data.id)}
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
      <CardContent
        sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Business Name - Main */}
        <Typography
          variant="body2"
          fontWeight={600}
          gutterBottom
          noWrap
          title={data.business_name}
        >
          {data.business_name}
        </Typography>

        {/* Avatar and Business Type */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar
            src={data.logo_url || undefined}
            alt={`${data.business_name} logo`}
            sx={{
              width: 24,
              height: 24,
            }}
          >
            {data.business_name?.[0] || "B"}
          </Avatar>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            title={data.business_type}
          >
            {data.business_type}
          </Typography>
        </Box>

        {/* Years Trading */}
        {data.years_in_trading && (
          <Typography
            variant="body2"
            color="primary"
            fontWeight={700}
            gutterBottom
          >
            {data.years_in_trading} years trading
          </Typography>
        )}

        {/* Status Badge */}
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
          <Chip
            label="Active"
            size="small"
            color="success"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
          {data.legality_type && (
            <Chip
              label={data.legality_type}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}
        </Box>

        {/* Key Details */}
        <Box display="flex" flexDirection="column" gap={0.5} mt="auto">
          {/* Region */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:map-marker" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {data.region}
            </Typography>
          </Box>

          {/* Email */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Icon icon="mdi:email" width={14} color="#666" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {data.contact_email}
            </Typography>
          </Box>

          {/* Website */}
          {data.website && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Icon icon="iconoir:www" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {data.website.replace(/^https?:\/\//, "")}
              </Typography>
            </Box>
          )}

          {/* Employees */}
          {data.employees && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Icon icon="mdi:account-group" width={14} color="#666" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {data.employees}
              </Typography>
            </Box>
          )}

          {/* Work Types */}
          {data.types_of_work_undertaken &&
            data.types_of_work_undertaken.length > 0 && (
              <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
                <Chip
                  label={
                    data.types_of_work_undertaken.length === 1
                      ? data.types_of_work_undertaken[0]
                      : `${data.types_of_work_undertaken.length} services`
                  }
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              </Box>
            )}
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default BusinessCardCompact;

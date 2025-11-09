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

import { Business } from "@/types/business";

interface BusinessCardProps {
  data: Business;
  onViewDetails: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  statusBadgeText?: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  data,
  onViewDetails,
  onEdit,
  onDelete,
  statusBadgeText = "My Business",
}) => {
  const truncateDescription = (
    text: string,
    maxLength: number = 150
  ): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <CustomCard
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 300,
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.005)",
          boxShadow: 3,
        },
        position: "relative",
        height: "100%",
      }}
      onClick={() => onViewDetails(data.id)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1, p: { xs: 2, md: 3 } }}>
        {/* Status Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <Chip
            label={statusBadgeText}
            size="small"
            color="info"
            sx={{ fontSize: "0.7rem", height: 20, userSelect: "none" }}
          />
        </Box>

        {/* Business Header */}
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Flex alignItems="center" gap={2} sx={{ mb: 0.5 }}>
            <Avatar
              src={data.logo_url || undefined}
              alt={`${data.business_name} logo`}
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                flexShrink: 0,
                userSelect: "none",
              }}
            >
              {data.business_name?.[0] || "B"}
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
                {data.business_name}
              </Typography>
              <Typography color="text.secondary">
                {data.business_type}
              </Typography>
            </Box>
          </Flex>
        </Box>

        {/* Description Section */}
        {data.description && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.4,
                fontSize: "0.875rem",
              }}
            >
              {truncateDescription(data.description)}
            </Typography>
          </Box>
        )}

        {/* Key Details List */}
        <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
          {/* Address */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box
              color="primary.main"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="mdi:map-marker-radius" height={16} />
            </Box>
            <Typography variant="body2">{data.street_address}</Typography>
          </Flex>

          {/* Website */}
          {data.website && (
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
                <Icon icon="iconoir:www" height={16} />
              </Box>
              <Typography variant="body2">
                {data.website.replace(/^https?:\/\//, "")}
              </Typography>
            </Flex>
          )}

          {/* Email */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
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
            <Typography variant="body2">{data.contact_email}</Typography>
          </Flex>
        </Box>

        {/* Types of Work */}
        {data.types_of_work_undertaken &&
          data.types_of_work_undertaken.length > 0 && (
            <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
              <Typography variant="body2" fontWeight={500} mb={1}>
                Services Offered:
              </Typography>
              <Flex gap={1} flexWrap="wrap">
                {data.types_of_work_undertaken
                  .slice(0, 2)
                  .map((workType, index) => (
                    <Chip
                      key={index}
                      label={workType}
                      size="small"
                      color="success"
                      sx={{
                        fontSize: { xs: "0.6rem", sm: "0.75rem" },
                        height: { xs: 20, sm: 24 },
                        userSelect: "none",
                      }}
                    />
                  ))}
                {data.types_of_work_undertaken.length > 2 && (
                  <Chip
                    label={`+${data.types_of_work_undertaken.length - 2} more`}
                    size="small"
                    color="success"
                    sx={{
                      fontSize: { xs: "0.6rem", sm: "0.75rem" },
                      height: { xs: 20, sm: 24 },
                      userSelect: "none",
                    }}
                  />
                )}
              </Flex>
            </Box>
          )}
      </CardContent>

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
              onEdit(data.id);
            }}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              textTransform: "none",
              minWidth: { xs: "auto", sm: "64px" },
              px: { xs: 1, sm: 2 },
              "& .MuiButton-startIcon": {
                margin: { xs: 0, sm: "0 8px 0 -4px" },
              },
              userSelect: "none",
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data.id);
            }}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              textTransform: "none",
              minWidth: { xs: "auto", sm: "64px" },
              px: { xs: 1, sm: 2 },
              "& .MuiButton-startIcon": {
                margin: { xs: 0, sm: "0 8px 0 -4px" },
              },
              userSelect: "none",
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>Delete</Box>
          </Button>
        )}

        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:magnify" width={16} height={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(data.id);
          }}
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            textTransform: "none",
            minWidth: { xs: "auto", sm: "64px" },
            px: { xs: 1, sm: 2 },
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
            userSelect: "none",
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "inline" } }}>View</Box>
        </Button>
      </CardActions>
    </CustomCard>
  );
};

export default BusinessCard;

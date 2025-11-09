// src/app/businesses/[id]/components/BusinessStandardLayout.tsx
"use client";

import React from "react";
import {
  Typography,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  ImageList,
  ImageListItem,
  Grid,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import { Business } from "@/types/business";
import EndorsementsSection from "./EndorsementsSection";
import { BusinessEndorsementData } from "../../types/endorsements";

interface BusinessStandardLayoutProps {
  business: Business;
  showContactInfo: boolean;
  onVisitWebsite: () => void;
  endorsementData: BusinessEndorsementData; // ADD THIS
}

const BusinessStandardLayout: React.FC<BusinessStandardLayoutProps> = ({
  business,
  showContactInfo,
  onVisitWebsite,
  endorsementData
}) => {
  const getYearsSinceRegistration = (date: string): string => {
    const registrationDate = dayjs(date);
    const today = dayjs();
    const years = today.diff(registrationDate, "year");

    if (years === 0) {
      const months = today.diff(registrationDate, "month");
      return months === 0
        ? "Less than a month"
        : `${months} month${months === 1 ? "" : "s"}`;
    }

    return `${years} year${years === 1 ? "" : "s"}`;
  };

  const getDaysUntil = (dateString: string) => {
    const date = dayjs(dateString);
    const diff = date.diff(dayjs(), "day");
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    return `in ${diff} days`;
  };

  const formatOperatingHours = () => {
    if (
      !business.operating_hours ||
      Object.keys(business.operating_hours).length === 0
    ) {
      return null;
    }

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return days.map((day, index) => {
      const hours =
        business.operating_hours[day as keyof typeof business.operating_hours];
      return hours ? (
        <Box
          key={day}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { md: "space-between" },
            mb: 0.5,
          }}
        >
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {dayNames[index]}:
          </Typography>
          <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
            {hours}
          </Typography>
        </Box>
      ) : null;
    });
  };

  return (
    <Box>
      {/* Description */}
      {business.description && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {business.description}
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      <Stack spacing={2} my={3}>
        {/* Business Information */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Business Information
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Business Type:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {business.business_type}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Legality Type:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {business.legality_type}
              </Typography>
            </Box>

            {business.nzbn_number && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  NZBN Number:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {business.nzbn_number}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                GST Registered:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {business.gst_registered ? "Yes" : "No"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Years in Trading:
              </Typography>
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight={600}
                sx={{ textAlign: { md: "right" } }}
              >
                {business.years_in_trading} year
                {business.years_in_trading === 1 ? "" : "s"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Number of Employees:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {business.employees}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Region:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {business.region}
              </Typography>
            </Box>

            {business.serviced_areas && business.serviced_areas.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Serviced Areas:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {business.serviced_areas.join(", ")}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Works Out of Zone:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {business.out_of_zone_working ? "Yes" : "No"}
              </Typography>
            </Box>

            {business.is_verified && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Verified Business:
                </Typography>
                <Flex gap={1} sx={{ justifyContent: { md: "flex-end" } }}>
                  <Icon icon="mdi:check-decagram" color="#4caf50" />
                  <Typography
                    variant="body1"
                    color="success.main"
                    fontWeight={600}
                  >
                    Verified
                    {business.verified_at &&
                      ` on ${dayjs(business.verified_at).format(
                        "DD MMM YYYY"
                      )}`}
                  </Typography>
                </Flex>
              </Box>
            )}

            {business.availability_date && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Available From:
                </Typography>
                <Typography
                  variant="body1"
                  color="success.main"
                  fontWeight={600}
                  sx={{ textAlign: { md: "right" } }}
                >
                  {dayjs(business.availability_date).format("DD MMM YYYY")} (
                  {getDaysUntil(business.availability_date)})
                </Typography>
              </Box>
            )}

            {business.promoted_date && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Promoted Since:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                  {dayjs(business.promoted_date).format("DD MMM YYYY")}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Registered:
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { md: "right" } }}>
                {dayjs(business.created_at).format("DD MMM YYYY")} (
                {getYearsSinceRegistration(business.created_at)} ago)
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Location
            </Typography>

            <Flex alignItems="flex-start" gap={1} mb={2}>
              <Icon
                icon="mdi:map-marker"
                style={{ marginTop: 2, color: "#1976d2" }}
              />
              <Box>
                <Typography>{business.formatted_address}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {business.street_address}, {business.suburb}, {business.city},{" "}
                  {business.postal_code}
                </Typography>
              </Box>
            </Flex>

            {business.is_multi_branch &&
              business.branch_addresses.length > 0 && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={1}
                  >
                    Additional Branches:
                  </Typography>
                  {business.branch_addresses.map((branch, index) => (
                    <Box key={index} sx={{ ml: 2, mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {branch.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {branch.street_address}, {branch.suburb}, {branch.city},{" "}
                        {branch.region} {branch.postal_code}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
          </CardContent>
        </Card>

        {/* Operating Hours */}
        {business.operating_hours &&
          Object.keys(business.operating_hours).length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Operating Hours
                </Typography>
                {formatOperatingHours()}
              </CardContent>
            </Card>
          )}

        {/* Contact Information */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Contact Information
            </Typography>

            {business.website && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                  mb: 2,
                  alignItems: { md: "center" },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Website:
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={onVisitWebsite}
                  endIcon={<Icon icon="mdi:open-in-new" />}
                  sx={{ justifyContent: { xs: "flex-start", md: "flex-end" } }}
                >
                  Visit Website
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {showContactInfo ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: { md: "space-between" },
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    Email:
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary.main"
                    sx={{ textAlign: { md: "right" } }}
                  >
                    <a
                      href={`mailto:${business.contact_email}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {business.contact_email}
                    </a>
                  </Typography>
                </Box>

                {business.office_phone && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: { md: "space-between" },
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Office Phone:
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary.main"
                      sx={{ textAlign: { md: "right" } }}
                    >
                      <a
                        href={`tel:${business.office_phone}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {business.office_phone}
                      </a>
                    </Typography>
                  </Box>
                )}

                {business.phone_number && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: { md: "space-between" },
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Phone:
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary.main"
                      sx={{ textAlign: { md: "right" } }}
                    >
                      <a
                        href={`tel:${business.phone_number}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {business.phone_number}
                      </a>
                    </Typography>
                  </Box>
                )}

                {business.mobile_contacts.length > 0 && (
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                      mb={1}
                    >
                      Mobile Contacts:
                    </Typography>
                    {business.mobile_contacts.map((contact, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          justifyContent: { md: "space-between" },
                          mb: 0.5,
                          ml: 2,
                        }}
                      >
                        <Typography variant="body2">{contact.name}:</Typography>
                        <Typography
                          variant="body2"
                          color="primary.main"
                          sx={{ textAlign: { md: "right" } }}
                        >
                          <a
                            href={`tel:${contact.number}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {contact.number}
                          </a>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Alert severity="info">
                Click &#34;Contact Business&#34; to reveal contact information.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Social Media Links */}
        {Object.keys(business.social_media_links).length > 0 && (
          <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Social Media
              </Typography>
              <Flex gap={1} flexWrap="wrap">
                {business.social_media_links.facebook && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon icon="mdi:facebook" />}
                    href={business.social_media_links.facebook}
                    target="_blank"
                  >
                    Facebook
                  </Button>
                )}
                {business.social_media_links.instagram && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon icon="mdi:instagram" />}
                    href={business.social_media_links.instagram}
                    target="_blank"
                  >
                    Instagram
                  </Button>
                )}
                {business.social_media_links.linkedin && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon icon="mdi:linkedin" />}
                    href={business.social_media_links.linkedin}
                    target="_blank"
                  >
                    LinkedIn
                  </Button>
                )}
                {business.social_media_links.twitter && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon icon="mdi:twitter" />}
                    href={business.social_media_links.twitter}
                    target="_blank"
                  >
                    Twitter
                  </Button>
                )}
                {business.social_media_links.youtube && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon icon="mdi:youtube" />}
                    href={business.social_media_links.youtube}
                    target="_blank"
                  >
                    YouTube
                  </Button>
                )}
              </Flex>
            </CardContent>
          </Card>
        )}

        {/* Types of Work Undertaken */}
        {business.types_of_work_undertaken &&
          business.types_of_work_undertaken.length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Types of Work Undertaken
                </Typography>
                <Grid container spacing={1}>
                  {business.types_of_work_undertaken.map((workType, index) => (
                    <Grid key={index}>
                      <Chip
                        label={workType}
                        icon={<Icon icon="mdi:check-circle" />}
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

        {/* Certifications */}
        {business.certifications && business.certifications.length > 0 && (
          <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Certifications & Memberships
              </Typography>
              <Grid container spacing={1}>
                {business.certifications.map((cert, index) => (
                  <Grid key={index}>
                    <Chip
                      label={cert}
                      icon={<Icon icon="mdi:certificate" />}
                      color="success"
                      variant="outlined"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Insurance Policies */}
        {business.insurance_policies &&
          business.insurance_policies.length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Insurance Coverage
                </Typography>
                <Grid container spacing={1}>
                  {business.insurance_policies.map((policy, index) => (
                    <Grid key={index}>
                      <Chip
                        label={policy}
                        icon={<Icon icon="mdi:shield-check" />}
                        color="info"
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

        {/* Gallery */}
        {business.gallery_urls && business.gallery_urls.length > 0 && (
          <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Gallery
              </Typography>
              <ImageList variant="masonry" cols={3} gap={8}>
                {business.gallery_urls.map((imageUrl, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={imageUrl}
                      alt={`${business.business_name} gallery ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: 8 }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </CardContent>
          </Card>
        )}

        {/* Contact Action */}
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Get in Touch
            </Typography>
            {showContactInfo ? (
              <Alert>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  mb={1}
                  color="success.main"
                >
                  Contact Information Revealed!
                </Typography>
                <Typography variant="body2">
                  You can now see the business contact details above. Reach out
                  to discuss your project requirements.
                </Typography>
              </Alert>
            ) : (
              <Alert severity="info">
                Click &#34;Contact Business&#34; to reveal their contact
                information and get in touch about your project needs.
              </Alert>
            )}
          </CardContent>
        </Card>
        <EndorsementsSection
          businessId={business.id}
          initialData={endorsementData}
        />
      </Stack>
    </Box>
  );
};

export default BusinessStandardLayout;

// app/my-listings/businesses/view/[id]/components/BusinessTabbedLayout.tsx
"use client";

import React, { useState } from "react";
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
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import { Business } from "@/types/business";

interface BusinessTabbedLayoutProps {
  business: Business;
  showContactInfo: boolean;
  onVisitWebsite: () => void;
}

const BusinessTabbedLayout: React.FC<BusinessTabbedLayoutProps> = ({
  business,

  onVisitWebsite,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Services",
    "Gallery",
    "Team",
    "Reviews",
    "Contact",
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

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
        <Flex key={day} justifyContent="space-between" mb={0.5}>
          <Typography fontWeight={600}>{dayNames[index]}:</Typography>
          <Typography>{hours}</Typography>
        </Flex>
      ) : null;
    });
  };

  const renderOverviewTab = () => (
    <Box>
      {business.description && (
        <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              About Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {business.description}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Business Information
          </Typography>

          <Flex justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>Business Type:</Typography>
            <Typography>{business.business_type}</Typography>
          </Flex>

          <Flex justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>Legality Type:</Typography>
            <Typography>{business.legality_type}</Typography>
          </Flex>

          {business.nzbn_number && (
            <Flex justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>NZBN Number:</Typography>
              <Typography>{business.nzbn_number}</Typography>
            </Flex>
          )}

          <Flex justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>GST Registered:</Typography>
            <Typography>{business.gst_registered ? "Yes" : "No"}</Typography>
          </Flex>

          <Flex justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>Years in Trading:</Typography>
            <Typography color="primary.main" fontWeight={600}>
              {business.years_in_trading} year
              {business.years_in_trading === 1 ? "" : "s"}
            </Typography>
          </Flex>

          <Flex justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>Number of Employees:</Typography>
            <Typography>{business.employees}</Typography>
          </Flex>

          <Flex justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>Region:</Typography>
            <Typography>{business.region}</Typography>
          </Flex>

          {business.serviced_areas && business.serviced_areas.length > 0 && (
            <Flex justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>Serviced Areas:</Typography>
              <Typography>{business.serviced_areas.join(", ")}</Typography>
            </Flex>
          )}

          <Flex justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>Works Out of Zone:</Typography>
            <Typography>
              {business.out_of_zone_working ? "Yes" : "No"}
            </Typography>
          </Flex>

          {business.is_verified && (
            <Flex justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>Verified Business:</Typography>
              <Flex gap={1}>
                <Icon icon="mdi:check-decagram" color="#4caf50" />
                <Typography color="success.main" fontWeight={600}>
                  Verified
                  {business.verified_at &&
                    ` on ${dayjs(business.verified_at).format("DD MMM YYYY")}`}
                </Typography>
              </Flex>
            </Flex>
          )}

          {business.availability_date && (
            <Flex justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>Available From:</Typography>
              <Typography color="success.main" fontWeight={600}>
                {dayjs(business.availability_date).format("DD MMM YYYY")} (
                {getDaysUntil(business.availability_date)})
              </Typography>
            </Flex>
          )}

          {business.promoted_date && (
            <Flex justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>Promoted Since:</Typography>
              <Typography>
                {dayjs(business.promoted_date).format("DD MMM YYYY")}
              </Typography>
            </Flex>
          )}

          <Flex justifyContent="space-between">
            <Typography fontWeight={600}>Registered:</Typography>
            <Typography>
              {dayjs(business.created_at).format("DD MMM YYYY")} (
              {getYearsSinceRegistration(business.created_at)} ago)
            </Typography>
          </Flex>
        </CardContent>
      </Card>

      {business.certifications && business.certifications.length > 0 && (
        <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 2 }}>
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
    </Box>
  );

  const renderServicesTab = () => (
    <Box>
      {business.types_of_work_undertaken &&
        business.types_of_work_undertaken.length > 0 && (
          <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Services We Offer
              </Typography>
              <Grid container spacing={1}>
                {business.types_of_work_undertaken.map((workType, index) => (
                  <Grid key={index}>
                    <Chip
                      label={workType}
                      icon={<Icon icon="mdi:check-circle" />}
                      color="primary"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

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
    </Box>
  );

  const renderGalleryTab = () => (
    <Box>
      {business.gallery_urls && business.gallery_urls.length > 0 ? (
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Our Work
            </Typography>
            <ImageList variant="masonry" cols={isMdUp ? 3 : 2} gap={8}>
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
      ) : (
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Alert severity="info">No gallery images available yet.</Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderTeamTab = () => (
    <Box>
      <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Our Team
          </Typography>
          <Alert severity="info" icon={<Icon icon="mdi:information" />}>
            Team member profiles coming soon! This feature will showcase our
            professional team members.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );

  const renderReviewsTab = () => (
    <Box>
      <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Customer Reviews
          </Typography>
          <Alert severity="info" icon={<Icon icon="mdi:star" />}>
            Reviews and ratings coming soon! Customers will be able to leave
            feedback here.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );

  const renderContactTab = () => (
    <Box>
      <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Location
          </Typography>

          <Flex alignItems="flex-start" gap={1} mb={1}>
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

          {business.is_multi_branch && business.branch_addresses.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ my: 2 }} />
              <Typography fontWeight={600} mb={1}>
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

      <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Get in Touch
          </Typography>

          {business.website && (
            <Flex justifyContent="space-between" mb={2} alignItems="center">
              <Typography fontWeight={600}>Website:</Typography>
              <Button
                variant="text"
                size="small"
                onClick={onVisitWebsite}
                endIcon={<Icon icon="mdi:open-in-new" />}
              >
                Visit Website
              </Button>
            </Flex>
          )}

          <Divider sx={{ my: 2 }} />

          <Flex justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>Email:</Typography>
            <Typography color="primary.main">
              <a
                href={`mailto:${business.contact_email}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {business.contact_email}
              </a>
            </Typography>
          </Flex>

          {business.office_phone && (
            <Flex justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>Office Phone:</Typography>
              <Typography color="primary.main">
                <a
                  href={`tel:${business.office_phone}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {business.office_phone}
                </a>
              </Typography>
            </Flex>
          )}

          {business.phone_number && (
            <Flex justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>Phone:</Typography>
              <Typography color="primary.main">
                <a
                  href={`tel:${business.phone_number}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {business.phone_number}
                </a>
              </Typography>
            </Flex>
          )}

          {business.mobile_contacts.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography fontWeight={600} mb={1}>
                Mobile Contacts:
              </Typography>
              {business.mobile_contacts.map((contact, index) => (
                <Flex
                  key={index}
                  justifyContent="space-between"
                  mb={0.5}
                  ml={2}
                >
                  <Typography variant="body2">{contact.name}:</Typography>
                  <Typography variant="body2" color="primary.main">
                    <a
                      href={`tel:${contact.number}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {contact.number}
                    </a>
                  </Typography>
                </Flex>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {Object.keys(business.social_media_links).length > 0 && (
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Follow Us
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
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return renderOverviewTab();
      case "Services":
        return renderServicesTab();
      case "Gallery":
        return renderGalleryTab();
      case "Team":
        return renderTeamTab();
      case "Reviews":
        return renderReviewsTab();
      case "Contact":
        return renderContactTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMdUp ? "fullWidth" : "scrollable"}
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: isMdUp ? "space-between" : "center",
            },
            userSelect: "none",
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              value={tab}
              sx={{ userSelect: "none" }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ py: 2 }}>{renderTabContent()}</Box>
    </Box>
  );
};

export default BusinessTabbedLayout;

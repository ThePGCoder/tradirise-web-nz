// src/app/profile/components/ProfileClient.tsx
"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Avatar,
  Chip,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  Stack,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Image from "next/image";
import dayjs from "dayjs";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import Flex from "@/global/Flex";
import { toggleTradeProfileAction } from "../profile-actions";
import { UserProfile } from "../types/profile-types";
import CustomCard from "@/components/CustomCard";
import PageHeader from "@/components/PageHeader";

interface ProfileClientProps {
  profile: UserProfile;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ profile }) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();

  const [tradeEnabled, setTradeEnabled] = useState(
    profile.trade_profile_enabled
  );
  const [isTogglingTrade, setIsTogglingTrade] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    changeActiveRoute("My Profile");
  }, [changeActiveRoute]);

  const handleEditProfile = () => {
    router.push("/profiles/profile/edit");
  };

  const handleToggleTrade = async (checked: boolean) => {
    setIsTogglingTrade(true);
    setError(null);

    try {
      const result = await toggleTradeProfileAction(checked);

      if (result.success) {
        setTradeEnabled(checked);
        setSuccess(
          checked
            ? "Trade profile enabled successfully!"
            : "Trade profile disabled successfully!"
        );
        if (!checked) {
          setActiveTab(0);
        }
        router.refresh();
      } else {
        setError(result.error || "Failed to update trade profile status");
        setTradeEnabled(!checked);
      }
    } catch (err) {
      console.error("Error toggling trade profile:", err);
      setError("An unexpected error occurred");
      setTradeEnabled(!checked);
    } finally {
      setIsTogglingTrade(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getDisplayName = () => {
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    return `${firstName} ${lastName}`.trim() || profile.username || "User";
  };

  const getAuthProviderInfo = () => {
    const providerId = profile.provider_id?.toLowerCase() || "email";

    const providers: Record<string, { icon: string; label: string }> = {
      google: { icon: "devicon:google", label: "Google" },
      facebook: { icon: "devicon:facebook", label: "Facebook" },
      email: { icon: "mdi:email", label: "Email" },
    };

    return providers[providerId] || providers.email;
  };

  return (
    <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
      <PageHeader title="My Profile" />
      <CustomCard sx={{ p: 0, overflow: "hidden" }}>
        {/* Cover Image */}
        <Box
          sx={{
            height: 200,
            bgcolor: "grey.200",
            backgroundImage: profile.cover_url
              ? `url(${profile.cover_url})`
              : `url(/site2.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        />

        {/* Profile Content */}
        <Box sx={{ px: 4, pb: 4 }}>
          <Flex
            justifyContent="space-between"
            alignItems="flex-start"
            mt={-7.5}
            mb={3}
          >
            <Avatar
              src={profile.avatar_url || ""}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid",
                borderColor: "background.paper",
                bgcolor: "primary.main",
              }}
            >
              {!profile.avatar_url ? (
                <Icon icon="mdi:account-circle" width="100%" height="100%" />
              ) : (
                profile.first_name?.[0] || profile.username?.[0] || "U"
              )}
            </Avatar>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditProfile}
              startIcon={<Icon icon="mdi:pencil" />}
              sx={{ mt: 5 }}
            >
              Edit Profile
            </Button>
          </Flex>

          {/* Name and Username */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={600}>
              {getDisplayName()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              @{profile.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {dayjs(profile.created_at).format("MMMM YYYY")}
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}

          {/* Trade Profile Toggle */}
          <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 3 }}>
            <CardContent>
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Trade Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tradeEnabled
                      ? "Your trade profile is visible to employers"
                      : "Enable to showcase your trade skills and experience"}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tradeEnabled}
                      onChange={(e) => handleToggleTrade(e.target.checked)}
                      disabled={isTogglingTrade}
                      color="primary"
                    />
                  }
                  label=""
                />
              </Flex>

              {!tradeEnabled && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Enable your trade profile to connect with potential employers
                  and showcase your skills in the building and construction
                  industry.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Tabs - Only show if trade is enabled */}
          {tradeEnabled && (
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
              >
                <Tab label="User Profile" />
                <Tab label="Trade Profile" />
              </Tabs>
            </Box>
          )}

          <Stack spacing={2} my={3}>
            {/* Profile Tab Content */}
            {(!tradeEnabled || activeTab === 0) && (
              <>
                {/* User Information */}
                <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      User Information
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
                        Username:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textAlign: { md: "right" } }}
                      >
                        @{profile.username}
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
                        Full Name:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textAlign: { md: "right" } }}
                      >
                        {getDisplayName()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: { md: "space-between" },
                        alignItems: { md: "center" },
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        Account Type:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          textAlign: { md: "right" },
                        }}
                      >
                        <Icon
                          icon={getAuthProviderInfo().icon}
                          width={18}
                          height={18}
                        />
                        <Typography variant="body1">
                          {getAuthProviderInfo().label}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Trade Tab Content - Only show if enabled and on trade tab */}
            {tradeEnabled && activeTab === 1 && (
              <>
                {/* Bio */}
                {profile.bio && (
                  <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2}>
                        Professional Bio
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {profile.bio}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Information */}
                <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      Contact Information
                    </Typography>

                    {profile.contact_email && (
                      <Box mb={1}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.secondary"
                        >
                          Contact Email:
                        </Typography>
                        <Typography variant="body1">
                          {profile.contact_email}
                        </Typography>
                      </Box>
                    )}

                    {profile.mobile && (
                      <Box mb={1}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.secondary"
                        >
                          Mobile:
                        </Typography>
                        <Typography variant="body1">
                          {profile.mobile}
                        </Typography>
                      </Box>
                    )}

                    {profile.website && (
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.secondary"
                        >
                          Website:
                        </Typography>
                        <Typography variant="body1">
                          {profile.website}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Location & Experience */}
                <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      Location & Experience
                    </Typography>

                    {profile.region && (
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
                        <Typography
                          variant="body1"
                          sx={{ textAlign: { md: "right" } }}
                        >
                          {profile.region}
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
                        Max Servicable Radius:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textAlign: { md: "right" } }}
                      >
                        {profile.max_servicable_radius >= 200
                          ? "Nationwide"
                          : `${profile.max_servicable_radius || 0} km`}
                      </Typography>
                    </Box>

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
                        Years in Trade:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textAlign: { md: "right" } }}
                      >
                        {profile.years_in_trade || "0"}{" "}
                        {profile.years_in_trade === 1 ? "year" : "years"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Roles */}
                {profile.primary_trade_role && (
                  <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2}>
                        Roles
                      </Typography>

                      <Box mb={2}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.secondary"
                        >
                          Primary Role:
                        </Typography>
                        <Box mt={0.5}>
                          <Chip
                            label={profile.primary_trade_role}
                            color="primary"
                          />
                        </Box>
                      </Box>

                      {profile.secondary_trade_roles &&
                        profile.secondary_trade_roles.length > 0 && (
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="text.secondary"
                              mb={1}
                            >
                              Secondary Roles:
                            </Typography>
                            <Grid container spacing={1}>
                              {profile.secondary_trade_roles.map((item, i) => (
                                <Grid key={i}>
                                  <Chip
                                    label={item}
                                    variant="outlined"
                                    color="primary"
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                    </CardContent>
                  </Card>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2}>
                        Skills
                      </Typography>
                      <Grid container spacing={1}>
                        {profile.skills.map((skill, i) => (
                          <Grid key={i}>
                            <Chip label={skill} color="info" />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                {/* Accreditations */}
                {profile.accreditations &&
                  profile.accreditations.length > 0 && (
                    <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                          Accreditations
                        </Typography>
                        <Grid container spacing={1}>
                          {profile.accreditations.map((a, i) => (
                            <Grid key={i}>
                              <Chip label={a} color="success" />
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  )}

                {/* Gallery */}
                {profile.gallery_urls && profile.gallery_urls.length > 0 && (
                  <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2}>
                        Work Gallery
                      </Typography>
                      <ImageList
                        sx={{ width: "100%", height: "auto" }}
                        cols={3}
                        gap={8}
                      >
                        {profile.gallery_urls.map((url, index) => (
                          <ImageListItem key={index}>
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                                height: 250,
                                borderRadius: 1,
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                              onClick={() => window.open(url, "_blank")}
                            >
                              <Image
                                src={url}
                                alt={`Gallery ${index + 1}`}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </Box>
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </Stack>
        </Box>
      </CustomCard>
    </Box>
  );
};

export default ProfileClient;

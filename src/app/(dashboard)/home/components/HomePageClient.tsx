"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, Modal, Button, Grid } from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

import FadeIn from "@/components/FadeIn";
import CustomCard from "@/components/CustomCard";
import { useThemeMode } from "@/hooks/useThemeMode";
import { lightTheme, darkTheme } from "@/styles/theme";
import Logo from "@/components/Logo";
import ImageCrossfade from "@/components/ImageCrossfade";

interface ProfileData {
  username: string;
  first_name: string | null;
  last_name: string | null;
}

interface HomeClientProps {
  user: User | null;
  profile: ProfileData | null;
}

const BACKGROUND_IMAGES = [
  "/site.png", // Replace with your actual image paths
  "/site2.png",
  "/site3.png",
];

const HomeClient: React.FC<HomeClientProps> = ({ user, profile }) => {
  const { mode } = useThemeMode();
  const router = useRouter();

  const [viewListingsModalOpen, setViewListingsModalOpen] = useState(false);
  const [addListingModalOpen, setAddListingModalOpen] = useState(false);
  const [viewProfileModalOpen, setViewProfileModalOpen] = useState(false);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get display name
  const getDisplayName = () => {
    if (!profile) return "there";
    if (profile.first_name) return profile.first_name;
    return profile.username;
  };

  // Modal style
  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 600 },
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  // View All Listings Modal Options (Public)
  const viewListingsOptions = [
    {
      title: "Personnel",
      desc: "Browse available personnel",
      icon: "mdi:account-circle",
      route: "/listings/personnel",
    },
    {
      title: "Positions",
      desc: "View open positions",
      icon: "fluent:person-star-16-filled",
      route: "/listings/positions",
    },
    {
      title: "Projects",
      desc: "Explore project opportunities",
      icon: "mingcute:house-fill",
      route: "/listings/projects",
    },
    {
      title: "Businesses",
      desc: "Discover businesses in NZ via list or map",
      icon: "ic:baseline-business",
      route: "/listings/businesses",
    },
  ];

  // Add Listing Modal Options (Authenticated only)
  const addListingOptions = [
    {
      title: "Personnel",
      desc: "Post personnel availability",
      icon: "mdi:account-circle",
      route: "/listings/personnel/add-personnel",
    },
    {
      title: "Position",
      desc: "Post a job opening",
      icon: "fluent:person-star-16-filled",
      route: "/listings/positions/add-positions",
    },
    {
      title: "Project",
      desc: "Post a new project",
      icon: "mingcute:house-fill",
      route: "/listings/projects/add-project",
    },
    {
      title: "Business",
      desc: "List your business",
      icon: "ic:baseline-business",
      route: "/profiles/business-profiles/add-business",
    },
  ];

  // View Profile Modal Options (Authenticated only)
  const viewProfileOptions = [
    {
      title: "User & Trade Profile",
      desc: "Your user & trade profile",
      icon: "mdi:account-circle",
      route: "/profiles/profile",
    },
    {
      title: "My Businesses",
      desc: "Your business profile(s)",
      icon: "ic:baseline-business",
      route: "/profiles/business-profiles",
    },
  ];

  // ✅ Different actions based on authentication
  const publicActions = [
    {
      title: "Browse Listings",
      desc: "Browse all available listings.",
      icon: "fluent:text-bullet-list-square-search-20-filled",
      onClick: () => setViewListingsModalOpen(true),
    },
    {
      title: "Login",
      desc: "Log in to access all features.",
      icon: "solar:login-2-bold",
      onClick: () => router.push("/login"),
    },
    {
      title: "Create Account",
      desc: "Join our platform today.",
      icon: "mdi:account-circle",
      onClick: () => router.push("/register"),
    },
    {
      title: "Learn More",
      desc: "Discover what we offer.",
      icon: "mdi:information",
      onClick: () => router.push("/about"),
    },
  ];

  const authenticatedActions = [
    {
      title: "Browse Listings",
      desc: "Browse all available listings.",
      icon: "fluent:text-bullet-list-square-search-20-filled",
      onClick: () => setViewListingsModalOpen(true),
    },
    {
      title: "My Listings",
      desc: "See and manage your active ads.",
      icon: "fluent:text-bullet-list-square-person-20-filled",
      onClick: () => router.push("/my-listings"),
    },
    {
      title: "New Listing",
      desc: "Post a new position, project, or business.",
      icon: "mdi:plus-box",
      onClick: () => setAddListingModalOpen(true),
    },
    {
      title: "View My Profiles",
      desc: "Access and edit your profile.",
      icon: "mdi:account-circle",
      onClick: () => setViewProfileModalOpen(true),
    },
  ];

  const actions = user ? authenticatedActions : publicActions;

  const handleModalOptionClick = (
    route: string,
    setModalOpen: (open: boolean) => void
  ) => {
    setModalOpen(false);
    router.push(route);
  };

  const renderModalOptions = (
    options: typeof viewListingsOptions,
    setModalOpen: (open: boolean) => void
  ) => (
    <Grid
      container
      spacing={2}
      justifyContent={options.length === 3 ? "center" : "flex-start"}
    >
      {options.map((option, idx) => (
        <Grid
          size={{ xs: 12, sm: options.length === 3 && idx === 2 ? 12 : 6 }}
          key={idx}
          sx={
            options.length === 3 && idx === 2
              ? { display: "flex", justifyContent: "center" }
              : {}
          }
        >
          <CustomCard
            onClick={() => handleModalOptionClick(option.route, setModalOpen)}
            sx={{
              cursor: "pointer",
              p: 3,
              textAlign: "center",
              width:
                options.length === 3 && idx === 2
                  ? { xs: "100%", sm: "50%" }
                  : "100%",

              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Icon
                icon={option.icon}
                height={36}
                color={
                  mode === "light"
                    ? lightTheme.palette.primary.main
                    : darkTheme.palette.primary.main
                }
              />
              <Typography variant="subtitle1" fontWeight={600}>
                {option.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {option.desc}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <FadeIn>
      {/* Solid background layer */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: mode === "dark" ? "grey.900" : "common.white",
          zIndex: -2,
          marginLeft: { xs: "0px", sm: "0px", md: "320px" },
        }}
      />

      {/* Image overlay */}
      <ImageCrossfade
        images={BACKGROUND_IMAGES}
        interval={6000}
        duration={1.5}
        alt="Trade background"
        objectFit="cover"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0.15,
        }}
      />

      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        justifyContent="center"
        minHeight="calc(100vh - 100px)"
        alignItems="center"
        px={2}
        py={6}
      >
        {/* Welcome Section */}
        <Box py={2}>
          <Logo
            fontSize={{
              xs: 32,
              sm: 38,
              md: 46,
              lg: 52,
            }}
            iconHeight={{
              xs: 32,
              sm: 38,
              md: 46,
              lg: 52,
            }}
            countryFontSize={{
              xs: 10,
              sm: 10,
              md: 12,
              lg: 12,
            }}
            countryIconSize={{
              xs: 10,
              md: 14,
            }}
            countryLetterSpacing={5}
            showCountry={true}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            pt: 2,
            fontSize: {
              xs: "1.1rem",
              sm: "1.25rem",
              md: "1.35rem",
              lg: "1.5rem",
            },
          }}
        >
          {user ? `${getGreeting()}, ${getDisplayName()}` : `${getGreeting()}`}
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
              lg: "1.25rem",
            },
          }}
        >
          {user
            ? "What do you want to do today?"
            : "Welcome! Sign in to get started."}
        </Typography>

        {/* Actions Grid */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
          }}
          gap={6}
          mt={4}
          width="100%"
          maxWidth="1000px"
        >
          {actions.map((action, idx) => (
            <CustomCard
              key={idx}
              onClick={action.onClick}
              sx={{
                cursor: "pointer",
                p: 3,
                textAlign: "center",

                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <Icon
                  icon={action.icon}
                  height={40}
                  color={
                    mode === "light"
                      ? lightTheme.palette.primary.main
                      : darkTheme.palette.primary.main
                  }
                />
                <Typography variant="h6" fontWeight="bold">
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.desc}
                </Typography>
              </Stack>
            </CustomCard>
          ))}
        </Box>

        {/* View All Listings Modal */}
        <Modal
          open={viewListingsModalOpen}
          onClose={() => setViewListingsModalOpen(false)}
          aria-labelledby="view-listings-modal"
        >
          <Box sx={modalStyle}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              textAlign="center"
            >
              View All Listings
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={3}
              textAlign="center"
            >
              Choose the type of listings you want to browse
            </Typography>
            {renderModalOptions(viewListingsOptions, setViewListingsModalOpen)}
            <Box mt={3} textAlign="center">
              <Button
                variant="text"
                onClick={() => setViewListingsModalOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Add Listing Modal (Authenticated only) */}
        {user && (
          <Modal
            open={addListingModalOpen}
            onClose={() => setAddListingModalOpen(false)}
            aria-labelledby="add-listing-modal"
          >
            <Box sx={modalStyle}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                textAlign="center"
              >
                Add a Listing
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                mb={3}
                textAlign="center"
              >
                What type of listing would you like to create?
              </Typography>
              {renderModalOptions(addListingOptions, setAddListingModalOpen)}
              <Box mt={3} textAlign="right">
                <Button
                  variant="text"
                  onClick={() => setAddListingModalOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>
        )}

        {/* View Profile Modal (Authenticated only) */}
        {user && (
          <Modal
            open={viewProfileModalOpen}
            onClose={() => setViewProfileModalOpen(false)}
            aria-labelledby="view-profile-modal"
          >
            <Box sx={modalStyle}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                textAlign="center"
              >
                View Profile
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                mb={3}
                textAlign="center"
              >
                Select which profile you want to view or edit
              </Typography>
              {renderModalOptions(viewProfileOptions, setViewProfileModalOpen)}
              <Box mt={3} textAlign="right">
                <Button
                  variant="text"
                  onClick={() => setViewProfileModalOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
      </Box>
    </FadeIn>
  );
};

export default HomeClient;

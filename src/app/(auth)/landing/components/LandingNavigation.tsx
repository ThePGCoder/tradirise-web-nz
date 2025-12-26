// app/components/LandingNavigation.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Logo from "@/components/Logo";
import Flex from "@/global/Flex";
import ThemeToggle from "@/app/(dashboard)/layout/ThemeToggle";
import { useThemeMode } from "@/hooks/useThemeMode";
import Center from "@/global/Center";

const LandingNavigation = () => {
  const router = useRouter();
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<"nz" | "au">("nz");

  useEffect(() => {
    // Detect current site based on hostname
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      // Check for production domains
      if (hostname.includes(".com.au")) {
        setCurrentCountry("au");
      } else if (hostname.includes(".co.nz")) {
        setCurrentCountry("nz");
      } else {
        // Default to NZ for localhost and other domains
        setCurrentCountry("nz");
      }
    }
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const scrollToPricing = () => {
    handleDrawerClose();
    const element = document.getElementById("pricing-section");
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleLogin = () => {
    handleDrawerClose();
    router.push("/login");
  };

  const handleRegister = () => {
    handleDrawerClose();
    router.push("/register");
  };

  const handleExplore = () => {
    handleDrawerClose();
    router.push("/home");
  };

  const handleCountrySwitch = () => {
    handleDrawerClose();
    const hostname = window.location.hostname;

    // If on localhost, just toggle the state for testing
    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      setCurrentCountry(currentCountry === "nz" ? "au" : "nz");
      // You could also store this in localStorage to persist the choice
      localStorage.setItem(
        "selectedCountry",
        currentCountry === "nz" ? "au" : "nz"
      );
    } else {
      // Production behavior - redirect to other domain
      const newCountry = currentCountry === "nz" ? "au" : "nz";
      const newUrl =
        newCountry === "au"
          ? "https://tradirise.com.au"
          : "https://tradirise.co.nz";
      window.location.href = newUrl;
    }
  };

  // Current country (what user is on)
  const currentCountryName =
    currentCountry === "nz" ? "New Zealand" : "Australia";
  const currentFlagIcon =
    currentCountry === "nz" ? "circle-flags:nz" : "circle-flags:au";

  // Other country (what they can switch to)
  const otherCountryName =
    currentCountry === "nz" ? "Australia" : "New Zealand";

  const menuItems = [
    {
      text: "Guest",
      icon: "ion:ticket-sharp",
      onClick: handleExplore,
    },
    {
      text: "Pricing",
      icon: "mage:dollar-fill",
      onClick: scrollToPricing,
    },
    {
      text: "Login",
      icon: "mdi:lock-open-variant",
      onClick: handleLogin,
    },
    {
      text: "Register",
      icon: "vaadin:rocket",
      onClick: handleRegister,
    },
  ];

  return (
    <>
      {/* Floating Navigation */}
      <Box sx={{ position: "fixed", zIndex: 1200, width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            backdropFilter: "blur(15px)",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: isMobile ? "space-between" : "right",
              position: "relative",
              gap: 1,
              minHeight: { xs: 56, sm: 64 },
            }}
          >
            {/* Desktop Logo */}
            {!isMobile && (
              <Box
                sx={{
                  position: "absolute",
                  left: 24,
                  top: 20,
                  transition: "filter 0.3s ease",
                  userSelect: "none",
                }}
              >
                <Logo fontSize="24px" />
              </Box>
            )}

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Button
                  color="dusk"
                  variant="text"
                  onClick={scrollToPricing}
                  sx={{ fontWeight: 600 }}
                  startIcon={<Icon icon="mage:dollar-fill" />}
                >
                  Pricing
                </Button>
                <Button
                  color="dusk"
                  variant="text"
                  onClick={handleExplore}
                  sx={{ fontWeight: 600 }}
                  startIcon={<Icon icon="ion:ticket-sharp" />}
                >
                  Guest
                </Button>

                <Button
                  onClick={() => router.push("/register")}
                  sx={{ fontWeight: 600 }}
                  startIcon={<Icon icon="vaadin:rocket" />}
                >
                  Register
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  sx={{ fontWeight: 600 }}
                  startIcon={<Icon icon="mdi:lock-open-variant" />}
                >
                  <Box>Login</Box>
                </Button>

                {/* Country Switcher - Desktop */}
                <Tooltip title={`Switch to ${otherCountryName}`} arrow>
                  <IconButton
                    onClick={handleCountrySwitch}
                    sx={{
                      position: "relative",
                      width: 36,
                      height: 36,
                      padding: 0.5,
                      borderRadius: "50%",
                      border:
                        mode === "light"
                          ? "2px solid rgba(0,0,0,0.1)"
                          : "2px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        border:
                          mode === "light"
                            ? "2px solid rgba(0,0,0,0.3)"
                            : "2px solid rgba(255,255,255,0.4)",
                      },
                    }}
                  >
                    <Icon icon={currentFlagIcon} width={28} height={28} />
                  </IconButton>
                </Tooltip>

                <ThemeToggle />
              </>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <IconButton onClick={handleDrawerToggle}>
                  <Icon icon="heroicons:bars-3" width={24} height={24} />
                </IconButton>
                <Flex alignItems="center" sx={{ userSelect: "none" }}>
                  <Logo fontSize="18px" countryIconSize={12} />
                </Flex>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {/* Country Switcher - Mobile */}
                  <Tooltip title={`Switch to ${otherCountryName}`} arrow>
                    <IconButton
                      onClick={handleCountrySwitch}
                      sx={{
                        position: "relative",
                        width: 32,
                        height: 32,
                        padding: 0.5,
                        borderRadius: "50%",
                        border:
                          mode === "light"
                            ? "2px solid rgba(0,0,0,0.1)"
                            : "2px solid rgba(255,255,255,0.2)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          border:
                            mode === "light"
                              ? "2px solid rgba(0,0,0,0.3)"
                              : "2px solid rgba(255,255,255,0.4)",
                        },
                      }}
                    >
                      <Icon icon={currentFlagIcon} width={24} height={24} />
                    </IconButton>
                  </Tooltip>
                  <ThemeToggle />
                </Box>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor:
              mode === "light"
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(26, 32, 44, 0.95)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Center padding={3}>
          <Logo fontSize="20px" showCountry={true} countryIconSize={12} />
        </Center>

        <Divider />

        {/* Country Switcher in Drawer */}
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCountrySwitch}
            startIcon={<Icon icon={currentFlagIcon} width={24} height={24} />}
            sx={{
              justifyContent: "flex-start",
              py: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {currentCountryName} - Switch to {otherCountryName}
          </Button>
        </Box>

        <Divider sx={{ mt: 1 }} />

        <List sx={{ px: 1, pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={item.onClick}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                px: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(0, 0, 0, 0.08)"
                      : "rgba(255, 255, 255, 0.12)",
                },
                "&:active": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(0, 0, 0, 0.12)"
                      : "rgba(255, 255, 255, 0.16)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: theme.palette.primary.main,
                  transition: "color 0.2s ease-in-out",
                }}
              >
                <Icon icon={item.icon} width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: 500,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default LandingNavigation;

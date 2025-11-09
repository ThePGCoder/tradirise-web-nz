// app/components/LandingNavigation.tsx
"use client";

import React, { useState } from "react";
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
                <ThemeToggle />
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

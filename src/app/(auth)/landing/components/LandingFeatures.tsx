// app/components/LandingFeatures.tsx
"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import { darkTheme, lightTheme } from "@/styles/theme";
import { useThemeMode } from "@/hooks/useThemeMode";

const LandingFeatures = () => {
  const { mode } = useThemeMode();

  const items = [
    {
      icon: "eos-icons:role-binding",
      title: "List a Position",
      desc: "Post a classified listing for an available position in your business.",
      onClick: () => {},
    },
    {
      icon: "mingcute:house-fill",
      title: "List a Project",
      desc: "Post a project listing to connect with suitable trades.",
      onClick: undefined,
    },
    {
      icon: "entypo:v-card",
      title: "List Trade Skills",
      desc: "Create a classified profile showcasing your trade skills.",
      onClick: () => {},
    },
    {
      icon: "ic:baseline-business",
      title: "List Your Business",
      desc: "Publish a business listing to be discovered by potential clients.",
      onClick: undefined,
    },
    {
      icon: "icon-park-solid:market-analysis",
      title: "List Trade Assets",
      desc: "Advertise equipment, vehicles, and materials as classified listings.",
      onClick: () => {},
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* First 4 cards in 2x2 grid */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        gap={4}
        rowGap={4}
        sx={{ width: "100%", mb: 4 }}
      >
        {items.slice(0, 4).map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1 + idx * 0.3,
              duration: 0.6,
            }}
          >
            <CustomCard
              sx={{
                px: 3,
                py: 4,
                height: "100%",
                cursor: item.onClick ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
              onClick={item.onClick}
            >
              <Stack
                spacing={1}
                alignItems="center"
                sx={{ height: "100%", justifyContent: "center" }}
              >
                <Box
                  sx={{
                    color:
                      mode === "light"
                        ? lightTheme.palette.primary.main
                        : darkTheme.palette.primary.main,
                  }}
                >
                  <Icon icon={item.icon} height={45} />
                </Box>
                <Typography variant="h6" textAlign="center" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  textAlign="center"
                  color="text.secondary"
                >
                  {item.desc}
                </Typography>
              </Stack>
            </CustomCard>
          </motion.div>
        ))}
      </Box>

      {/* 5th card centered */}
      <Box display="flex" justifyContent="center" sx={{ width: "100%" }}>
        <Box sx={{ width: { xs: "100%" } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1 + 4 * 0.3,
              duration: 0.6,
            }}
          >
            <CustomCard
              sx={{
                px: 3,
                py: 4,
                height: "100%",
                cursor: items[4].onClick ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
              onClick={items[4].onClick}
            >
              <Stack
                spacing={1}
                alignItems="center"
                sx={{ height: "100%", justifyContent: "center" }}
              >
                <Box
                  sx={{
                    color:
                      mode === "light"
                        ? lightTheme.palette.primary.main
                        : darkTheme.palette.primary.main,
                  }}
                >
                  <Icon icon={items[4].icon} height={45} />
                </Box>
                <Typography variant="h6" textAlign="center" fontWeight="bold">
                  {items[4].title}
                </Typography>
                <Typography
                  variant="body2"
                  textAlign="center"
                  color="text.secondary"
                >
                  {items[4].desc}
                </Typography>
              </Stack>
            </CustomCard>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingFeatures;

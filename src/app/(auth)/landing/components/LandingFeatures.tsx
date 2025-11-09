// app/components/LandingFeatures.tsx
"use client";

import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import { useThemeMode } from "@/hooks/useThemeMode";
import { darkTheme, lightTheme } from "@/styles/theme";

const LandingFeatures = () => {
  const { mode } = useThemeMode();

  const items = [
    {
      icon: "eos-icons:role-binding",
      title: "List A Position",
      desc: "List a position available in your business.",
    },
    {
      icon: "mingcute:house-fill",
      title: "List Your Project",
      desc: "Find suitable trades to help with your project.",
    },
    {
      icon: "entypo:v-card",
      title: "List Your Trade Skills",
      desc: "Make yourself available to other businesses.",
    },
    {
      icon: "ic:baseline-business",
      title: "List Your Business",
      desc: "Make yourself available to potential clients.",
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
      gap={4}
      rowGap={4}
      sx={{ width: "100%" }}
    >
      {items.map((item, idx) => (
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
              cursor: "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
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
  );
};

export default LandingFeatures;

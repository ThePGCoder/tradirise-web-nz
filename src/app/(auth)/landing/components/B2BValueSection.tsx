// components/B2BValueSection.tsx
"use client";

import React from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import { Center } from "@/components/Center";
import { useThemeMode } from "@/hooks/useThemeMode";
import { darkTheme, lightTheme } from "@/styles/theme";

const B2BValueSection = () => {
  const { mode } = useThemeMode();

  const valuePoints = [
    {
      icon: "streamline-ultimate:begging-hand-coin-2-bold",
      title: "Simple Subscription Only",
      desc: "No charges per lead, per contact, or per quote. Unlike other platforms, we don't profit from every customer inquiry you receive.",
    },
    {
      icon: "mingcute:steering-wheel-fill",
      title: "You're In Control",
      desc: "No algorithms deciding your fate. Connect directly with clients and businesses, negotiate your rates, and build genuine professional relationships.",
    },
    {
      icon: "mdi:shield-check",
      title: "Your Skills Have Value",
      desc: "Your expertise shouldn't be undervalued by automated bidding systems. Set your own rates and showcase the true worth of your craftsmanship.",
    },
    {
      icon: "mdi:handshake",
      title: "Direct Professional Connections",
      desc: "Build lasting professional relationships without intermediaries. Connect with clients and employers who value quality work and service.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, userSelect: "none" }}>
      <Container maxWidth="lg">
        <Stack
          spacing={2.5}
          alignItems="center"
          textAlign="center"
          sx={{ mb: { xs: 5, md: 7 } }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
              userSelect: "none",
            }}
          >
            Built for Real Business
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 750,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              lineHeight: 1.6,
              userSelect: "none",
            }}
          >
            No middlemen. No exploitation. No pre-charges. Just direct,
            professional connections that respect your expertise and put you in
            the driver&#39;s seat.
          </Typography>
        </Stack>

        <Center>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ width: "100%" }}
          >
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              }}
              gap={{ xs: 3, md: 4 }}
              sx={{ width: "100%" }}
            >
              {valuePoints.map((item, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <CustomCard
                    sx={{
                      px: { xs: 2.5, md: 3 },
                      py: { xs: 3.5, md: 4 },
                      height: "100%",
                      cursor: "default",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Stack
                      spacing={2}
                      alignItems="center"
                      sx={{
                        height: "100%",
                        justifyContent: "center",
                        userSelect: "none",
                      }}
                    >
                      <Box
                        sx={{
                          color:
                            mode === "light"
                              ? lightTheme.palette.primary.main
                              : darkTheme.palette.primary.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon icon={item.icon} height={48} />
                      </Box>
                      <Typography
                        variant="h6"
                        textAlign="center"
                        fontWeight={600}
                        sx={{ userSelect: "none" }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        textAlign="center"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                          userSelect: "none",
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </Stack>
                  </CustomCard>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Center>
      </Container>
    </Box>
  );
};

export default B2BValueSection;

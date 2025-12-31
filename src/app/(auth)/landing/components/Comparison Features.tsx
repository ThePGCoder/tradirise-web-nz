// app/components/ComparisonFeatures.tsx
"use client";

import React from "react";
import { Box, Container, Typography, Stack, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import CustomCard from "@/components/CustomCard";

const ComparisonFeatures = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Key Advantages */}
        <Box>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              textAlign="center"
              mb={4}
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              TradiRise Unique Features
            </Typography>
          </motion.div>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
          >
            {[
              {
                icon: "mdi:account-group",
                title: "Multiple Businesses",
                desc: "Manage multiple trade businesses from a single profile. Perfect for tradies with diverse skills.",
              },
              {
                icon: "mdi:excavator",
                title: "Trade Classifieds",
                desc: "Buy and sell tools, equipment, and materials. A complete marketplace for the trade industry.",
              },
              {
                icon: "vaadin:list-select",
                title: "Job Board & Directory",
                desc: "Post job positions, find skilled tradies, and build your team. More than just customer leads.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <CustomCard
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    height: "100%",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <Icon
                    icon={item.icon}
                    width={48}
                    height={48}
                    color={theme.palette.primary.main}
                  />
                  <Typography variant="h6" fontWeight={600} mt={2} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CustomCard>
              </motion.div>
            ))}
          </Stack>
        </Box>

        {/* All-in-One Platform Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Box mt={6}>
            <CustomCard
              sx={{
                p: 4,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                textAlign="center"
                color="primary"
              >
                The Complete Trade Platform
              </Typography>
              <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
                sx={{ maxWidth: 800, mx: "auto" }}
              >
                Unlike platforms that focus primarily on paid lead generation,
                TradiRise operates as a trade business directory and classifieds
                platform. Businesses manage their public profile, showcase
                projects, post job positions, list tools or equipment, and
                connect directly with customers — all under a predictable
                subscription model without per-lead fees.
              </Typography>
            </CustomCard>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ComparisonFeatures;

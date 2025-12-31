// app/components/CompetitorComparisonTable.tsx
"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useThemeMode } from "@/hooks/useThemeMode";
import CustomCard from "@/components/CustomCard";

const CompetitorComparisonTable = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Factual comparison data - based on publicly available information
  const comparisonData = [
    {
      feature: "Platform Model",
      tradirise: "Business listing directory",
      others: "Quote request marketplaces",
    },
    {
      feature: "Pricing Model",
      tradirise: "Fixed monthly subscription",
      others: "Pay per lead models",
    },
    {
      feature: "Commission on Jobs",
      tradirise: "0%",
      others: "None",
    },
    {
      feature: "Lead Cost",
      tradirise: "No per-lead fees",
      others: "Varies by job type & location",
    },
    {
      feature: "Customer Contact",
      tradirise: "Direct contact without per-lead fees",
      others: "Contact unlocked via paid leads",
    },
    {
      feature: "Portfolio Display",
      tradirise: "No hard limits on photos",
      others: "Photo gallery included",
    },
    {
      feature: "Business Profile",
      tradirise: "Comprehensive profile page",
      others: "Profile page",
    },
    {
      feature: "Reviews & Ratings",
      tradirise: "Yes",
      others: "Yes",
    },
    {
      feature: "Bidding Required",
      tradirise: "No",
      others: "Yes",
    },
    {
      feature: "Multiple Businesses",
      tradirise: "Yes - from 1 profile",
      others: "No",
    },
    {
      feature: "Job Positions Board",
      tradirise: "Yes - hire tradies",
      others: "No",
    },
    {
      feature: "Project Showcase",
      tradirise: "No per-project limits",
      others: "Limited portfolio",
    },
    {
      feature: "Business Directory",
      tradirise: "Yes - searchable",
      others: "Limited search",
    },
    {
      feature: "Tradie Directory",
      tradirise: "Yes - find tradies",
      others: "No (customers post jobs)",
    },
    {
      feature: "Trade Classifieds",
      tradirise: "Yes - tools & equipment",
      others: "No",
    },
    {
      feature: "Best For",
      tradirise:
        "Generally suited to established tradies building an online presence",
      others: "Generally suited to quote-based job bidding & lead acquisition",
    },
  ];

  const TableContent = () => (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "1rem" },
              minWidth: { xs: 120, md: 150 },
              position: "sticky",
              left: 0,
              backgroundColor: mode === "light" ? "white" : "grey.900",
              zIndex: 2,
            }}
          >
            Feature
          </TableCell>
          <TableCell
            align="center"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "1rem" },
              minWidth: { xs: 150, md: 180 },
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={0.5}
            >
              <Typography
                fontWeight={700}
                fontSize={{ xs: "0.95rem", md: "1.1rem" }}
              >
                TradiRise
              </Typography>
              <Chip
                label="You are here"
                size="small"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  height: 20,
                }}
              />
            </Box>
          </TableCell>
          <TableCell
            align="center"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "1rem" },
              minWidth: { xs: 150, md: 180 },
            }}
          >
            Other Platforms
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {comparisonData.map((row, index) => (
          <TableRow
            key={index}
            sx={{
              "&:nth-of-type(odd)": {
                backgroundColor:
                  mode === "light"
                    ? "action.hover"
                    : "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            <TableCell
              component="th"
              scope="row"
              sx={{
                position: { xs: "sticky", md: "static" },
                left: 0,
                backgroundColor: {
                  xs: mode === "light" ? "white" : "grey.900",
                  md: "transparent",
                },
                zIndex: 1,
              }}
            >
              <Typography
                fontWeight={600}
                fontSize={{ xs: "0.85rem", md: "0.95rem" }}
              >
                {row.feature}
              </Typography>
            </TableCell>
            <TableCell
              align="center"
              sx={{
                backgroundColor:
                  mode === "light"
                    ? "rgba(25, 118, 210, 0.08)"
                    : "rgba(144, 202, 249, 0.08)",
              }}
            >
              <Typography
                fontWeight={600}
                color="primary"
                fontSize={{ xs: "0.8rem", md: "0.95rem" }}
              >
                {row.tradirise}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography
                variant="body2"
                fontSize={{ xs: "0.8rem", md: "0.875rem" }}
              >
                {row.others}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Platform Comparison
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 900,
                mx: "auto",
                mt: 2,
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Compare TradiRise with other popular trade platforms
            </Typography>
          </Box>
        </motion.div>

        {/* Mobile scroll hint */}
        {isMobile && (
          <Box textAlign="center" mb={2}>
            <Chip
              icon={
                <Icon
                  icon="mdi:gesture-swipe-horizontal"
                  width={18}
                  height={18}
                />
              }
              label="Scroll horizontally to see all features"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        {/* Table - Both Desktop and Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TableContainer
            component={CustomCard}
            sx={{
              borderRadius: 2,
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            <TableContent />
          </TableContainer>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <CustomCard
            sx={{
              mt: 6,
              p: 3,
            }}
          >
            <Box display="flex" gap={2} alignItems="flex-start">
              <Icon
                icon="mdi:information-outline"
                width={24}
                height={24}
                color={theme.palette.text.secondary}
              />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  paragraph
                  sx={{ mb: 1 }}
                >
                  <strong>Disclaimer:</strong> This comparison is based on
                  publicly available information and general platform
                  positioning as of December 2024. Features, pricing structures,
                  and availability may change over time.
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Information is provided for general comparison purposes only
                  and reflects typical use cases rather than guaranteed
                  outcomes. Prospective users should independently verify
                  current features and pricing by visiting each platform&#39;s
                  official website.
                </Typography>
              </Box>
            </Box>
          </CustomCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CompetitorComparisonTable;

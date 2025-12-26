// app/components/CompetitorComparisonTable.tsx
"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Stack,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useThemeMode } from "@/hooks/useThemeMode";

const CompetitorComparisonTable = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Factual comparison data - based on publicly available information
  const comparisonData = [
    {
      feature: "Platform Model",
      tradirise: "Business listing directory",
      builderscrack: "Quote request marketplace",
      hipages: "Lead generation marketplace",
    },
    {
      feature: "Pricing Model",
      tradirise: "Fixed monthly subscription",
      builderscrack: "Pay per lead",
      hipages: "Pay per lead + subscription options",
    },
    {
      feature: "Commission on Jobs",
      tradirise: "0%",
      builderscrack: "None",
      hipages: "None",
    },
    {
      feature: "Lead Cost",
      tradirise: "No per-lead fees",
      builderscrack: "Varies by job type",
      hipages: "Varies by job type & location",
    },
    {
      feature: "Customer Contact",
      tradirise: "Direct contact without per-lead fees",
      builderscrack: "Contact unlocked via bidding",
      hipages: "Contact unlocked via paid leads",
    },
    {
      feature: "Portfolio Display",
      tradirise: "No hard limits on photos",
      builderscrack: "Photo gallery included",
      hipages: "Photo gallery included",
    },
    {
      feature: "Business Profile",
      tradirise: "Comprehensive profile page",
      builderscrack: "Profile page",
      hipages: "Profile page",
    },
    {
      feature: "Reviews & Ratings",
      tradirise: "Yes",
      builderscrack: "Yes",
      hipages: "Yes",
    },
    {
      feature: "Bidding Required",
      tradirise: "No",
      builderscrack: "Yes",
      hipages: "Yes",
    },
    {
      feature: "Multiple Businesses",
      tradirise: "Yes - from 1 profile",
      builderscrack: "No",
      hipages: "No",
    },
    {
      feature: "Job Positions Board",
      tradirise: "Yes - hire tradies",
      builderscrack: "No",
      hipages: "No",
    },
    {
      feature: "Project Showcase",
      tradirise: "No per-project limits",
      builderscrack: "Limited portfolio",
      hipages: "Limited portfolio",
    },
    {
      feature: "Business Directory",
      tradirise: "Yes - searchable",
      builderscrack: "Limited search",
      hipages: "Limited search",
    },
    {
      feature: "Tradie Directory",
      tradirise: "Yes - find tradies",
      builderscrack: "No (customers post jobs)",
      hipages: "No (customers post jobs)",
    },
    {
      feature: "Trade Classifieds",
      tradirise: "Yes - tools & equipment",
      builderscrack: "No",
      hipages: "No",
    },
    {
      feature: "Best For",
      tradirise:
        "Generally suited to established tradies building an online presence",
      builderscrack: "Generally suited to quote-based job bidding",
      hipages: "Generally suited to high-volume lead acquisition",
    },
  ];

  const TableContent = () => (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: mode === "light" ? "primary.main" : "primary.dark",
          }}
        >
          <TableCell
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "1rem" },
              minWidth: { xs: 120, md: 150 },
              position: "sticky",
              left: 0,
              backgroundColor:
                mode === "light" ? "primary.main" : "primary.dark",
              zIndex: 2,
            }}
          >
            Feature
          </TableCell>
          <TableCell
            align="center"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "1rem" },
              minWidth: { xs: 150, md: 180 },
              backgroundColor:
                mode === "light" ? "primary.dark" : "rgba(0, 0, 0, 0.2)",
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
                  backgroundColor: "white",
                  color: "primary.main",
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
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "1rem" },
              minWidth: { xs: 150, md: 180 },
            }}
          >
            Builderscrack (NZ)
          </TableCell>
          <TableCell
            align="center"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "1rem" },
              minWidth: { xs: 150, md: 180 },
            }}
          >
            Hipages (AU)
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
                {row.builderscrack}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography
                variant="body2"
                fontSize={{ xs: "0.8rem", md: "0.875rem" }}
              >
                {row.hipages}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: mode === "light" ? "grey.50" : "transparent",
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
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
            Compare TradiRise with other popular trade platforms in New Zealand
            and Australia
          </Typography>
        </Box>

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
        <TableContainer
          component={Paper}
          elevation={mode === "light" ? 2 : 4}
          sx={{
            borderRadius: 2,
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          <TableContent />
        </TableContainer>

        {/* Key Advantages */}
        <Box mt={6}>
          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            textAlign="center"
            mb={4}
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
          >
            TradiRise Unique Features
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="center"
          >
            <Paper
              elevation={mode === "light" ? 2 : 4}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                textAlign: "center",
                maxWidth: { md: 320 },
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              <Icon
                icon="mdi:briefcase-variant-outline"
                width={48}
                height={48}
                color={theme.palette.primary.main}
              />
              <Typography variant="h6" fontWeight={600} mt={2} gutterBottom>
                Multiple Businesses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage multiple trade businesses from a single profile. Perfect
                for tradies with diverse skills.
              </Typography>
            </Paper>
            <Paper
              elevation={mode === "light" ? 2 : 4}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                textAlign: "center",
                maxWidth: { md: 320 },
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              <Icon
                icon="mdi:toolbox-outline"
                width={48}
                height={48}
                color={theme.palette.primary.main}
              />
              <Typography variant="h6" fontWeight={600} mt={2} gutterBottom>
                Trade Classifieds
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Buy and sell tools, equipment, and materials. A complete
                marketplace for the trade industry.
              </Typography>
            </Paper>
            <Paper
              elevation={mode === "light" ? 2 : 4}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                textAlign: "center",
                maxWidth: { md: 320 },
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              <Icon
                icon="mdi:account-group"
                width={48}
                height={48}
                color={theme.palette.primary.main}
              />
              <Typography variant="h6" fontWeight={600} mt={2} gutterBottom>
                Job Board & Directory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Post job positions, find skilled tradies, and build your team.
                More than just customer leads.
              </Typography>
            </Paper>
          </Stack>
        </Box>

        {/* All-in-One Platform Highlight */}
        <Box mt={6}>
          <Paper
            elevation={mode === "light" ? 3 : 5}
            sx={{
              p: 4,
              borderRadius: 2,
              background:
                mode === "light"
                  ? "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)"
                  : "linear-gradient(135deg, rgba(144, 202, 249, 0.1) 0%, rgba(144, 202, 249, 0.05) 100%)",
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <Typography
              variant="h5"
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
              projects, post job positions, list tools or equipment, and connect
              directly with customers — all under a predictable subscription
              model without per-lead fees.
            </Typography>
          </Paper>
        </Box>

        {/* Legal Disclaimer */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 2,
            backgroundColor:
              mode === "light"
                ? "rgba(158, 158, 158, 0.08)"
                : "rgba(189, 189, 189, 0.08)",
            border: "1px solid",
            borderColor: mode === "light" ? "grey.300" : "grey.700",
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
                publicly available information and general platform positioning
                as of December 2024. Features, pricing structures, and
                availability may change over time. Builderscrack and Hipages are
                registered trademarks of their respective owners. TradiRise is
                not affiliated with, endorsed by, or sponsored by these
                companies.
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Information is provided for general comparison purposes only and
                reflects typical use cases rather than guaranteed outcomes.
                Prospective users should independently verify current features
                and pricing by visiting each platform’s official website.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Source Attribution */}
        <Box mt={3} textAlign="center">
          <Typography variant="caption" color="text.secondary" component="div">
            Comparison data sourced from public websites and published pricing
            as of December 2024.
            <br />
            Builderscrack:{" "}
            <Box
              component="a"
              href="https://www.builderscrack.co.nz"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              www.builderscrack.co.nz
            </Box>
            {" | "}Hipages:{" "}
            <Box
              component="a"
              href="https://www.hipages.com.au"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              www.hipages.com.au
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CompetitorComparisonTable;

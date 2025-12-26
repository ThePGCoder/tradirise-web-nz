// app/components/AboutSection.tsx
"use client";

import React from "react";
import { Box, Container, Typography, Paper, Stack } from "@mui/material";
import { Icon } from "@iconify/react";
import { useThemeMode } from "@/hooks/useThemeMode";

const AboutSection = () => {
  const { mode } = useThemeMode();

  const whatWeDo = [
    {
      icon: "mdi:handshake",
      title: "Connection Platform",
      description:
        "We provide a platform that connects tradies with potential customers seeking trade services.",
    },
    {
      icon: "mdi:store",
      title: "Business Listings",
      description:
        "Tradies can create profiles and showcase their businesses, services, and portfolios.",
    },
    {
      icon: "mdi:chat",
      title: "Direct Communication",
      description:
        "We facilitate direct communication between tradies and customers for quotes and inquiries.",
    },
    {
      icon: "mdi:star",
      title: "Review System",
      description:
        "Customers can leave reviews based on their experiences with tradies they've hired.",
    },
  ];

  const whatWeDont = [
    {
      icon: "mdi:close-circle",
      title: "Not a Hiring Agent",
      description:
        "We do not hire, employ, or engage tradies on behalf of customers.",
    },
    {
      icon: "mdi:close-circle",
      title: "No Service Guarantee",
      description:
        "We do not guarantee the quality, timeliness, or completion of any work performed by tradies.",
    },
    {
      icon: "mdi:close-circle",
      title: "No Payment Processing",
      description:
        "We do not handle payments between customers and tradies. All financial transactions are direct.",
    },
    {
      icon: "mdi:close-circle",
      title: "No Liability for Work",
      description:
        "We are not responsible for disputes, damages, or issues arising from work performed.",
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
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
            What is TradiRise?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto", mt: 2 }}
          >
            TradiRise is an independent platform connecting skilled tradies with
            customers. We provide the tools for connection, but all work
            agreements and services are between you and the tradie directly.
          </Typography>
        </Box>

        {/* What We Do */}
        <Box mb={6}>
          <Typography
            variant="h4"
            fontWeight={600}
            gutterBottom
            textAlign="center"
            mb={4}
            sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}
          >
            What We Do
          </Typography>
          <Stack spacing={3}>
            {whatWeDo.map((item, index) => (
              <Paper
                key={index}
                elevation={mode === "light" ? 1 : 3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Box
                    sx={{
                      backgroundColor: "primary.main",
                      borderRadius: "50%",
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      icon={item.icon}
                      width={28}
                      height={28}
                      color="white"
                    />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* What We Don't Do */}
        <Box mb={6}>
          <Typography
            variant="h4"
            fontWeight={600}
            gutterBottom
            textAlign="center"
            mb={4}
            color="error.main"
            sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}
          >
            What We Don't Do
          </Typography>
          <Stack spacing={3}>
            {whatWeDont.map((item, index) => (
              <Paper
                key={index}
                elevation={mode === "light" ? 1 : 3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "error.light",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Box
                    sx={{
                      backgroundColor: "error.main",
                      borderRadius: "50%",
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      icon={item.icon}
                      width={28}
                      height={28}
                      color="white"
                    />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Legal Notice */}
        <Paper
          elevation={mode === "light" ? 2 : 4}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor:
              mode === "light" ? "grey.50" : "rgba(255, 255, 255, 0.05)",
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Important Notice
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            TradiRise operates solely as a platform for connecting tradies with
            potential customers. We are not a party to any agreement between
            tradies and customers. All tradies listed on our platform are
            independent contractors operating their own businesses.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Customers are responsible for conducting their own due diligence,
            including verifying licenses, insurance, and qualifications before
            engaging any tradie. We recommend obtaining multiple quotes,
            checking references, and ensuring proper contracts are in place
            before any work begins.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            For disputes or issues with work performed, customers should contact
            the tradie directly or seek appropriate legal advice. TradiRise does
            not mediate disputes or provide refunds for services rendered by
            tradies.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutSection;

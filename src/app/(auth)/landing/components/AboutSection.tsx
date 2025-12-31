// app/components/AboutSection.tsx
"use client";

import React from "react";
import { Box, Container, Typography, Stack, CardContent } from "@mui/material";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import CustomCard from "@/components/CustomCard";

const AboutSection = () => {
  const whatWeDo = [
    {
      icon: "charm:circle-tick",
      title: "Connection Platform",
      description:
        "We provide a platform that connects tradies with potential customers seeking trade services.",
    },
    {
      icon: "charm:circle-tick",
      title: "Business Listings",
      description:
        "Tradies can create profiles and showcase their businesses, services, and portfolios.",
    },
    {
      icon: "charm:circle-tick",
      title: "Direct Communication",
      description:
        "We facilitate direct communication between tradies and customers for quotes and inquiries.",
    },
    {
      icon: "charm:circle-tick",
      title: "Review System",
      description:
        "Customers can leave reviews based on their experiences with tradies they've hired.",
    },
  ];

  const whatWeDont = [
    {
      icon: "charm:circle-cross",
      title: "Not a Hiring Agent",
      description:
        "We do not hire, employ, or engage tradies on behalf of customers.",
    },
    {
      icon: "charm:circle-cross",
      title: "No Service Guarantee",
      description:
        "We do not guarantee the quality, timeliness, or completion of any work performed by tradies.",
    },
    {
      icon: "charm:circle-cross",
      title: "No Payment Processing",
      description:
        "We do not handle payments between customers and tradies. All financial transactions are direct.",
    },
    {
      icon: "charm:circle-cross",
      title: "No Liability for Work",
      description:
        "We are not responsible for disputes, damages, or issues arising from work performed.",
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
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
              What is TradiRise?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: "auto", mt: 2 }}
            >
              TradiRise is an independent platform connecting skilled tradies
              with customers. We provide the tools for connection, but all work
              agreements and services are between you and the tradie directly.
            </Typography>
          </Box>
        </motion.div>

        {/* What We Do */}
        <Box mb={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              fontWeight={600}
              gutterBottom
              textAlign="center"
              mb={4}
              color="success.main"
              sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}
            >
              What We Do
            </Typography>
          </motion.div>
          <Stack spacing={3}>
            {whatWeDo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <CustomCard
                  sx={{
                    p: 2,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={4}>
                      <Box
                        sx={{
                          color: "success.main",
                        }}
                      >
                        <Icon icon={item.icon} width={48} height={48} />
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
                  </CardContent>
                </CustomCard>
              </motion.div>
            ))}
          </Stack>
        </Box>

        {/* What We Don't Do */}
        <Box mb={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              fontWeight={600}
              gutterBottom
              textAlign="center"
              mb={4}
              color="error.main"
              sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}
            >
              What We Don&#39;t Do
            </Typography>
          </motion.div>
          <Stack spacing={3}>
            {whatWeDont.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <CustomCard
                  sx={{
                    p: 2,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={4}>
                      <Box
                        sx={{
                          color: "error.main",
                        }}
                      >
                        <Icon icon={item.icon} width={48} height={48} />
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
                  </CardContent>
                </CustomCard>
              </motion.div>
            ))}
          </Stack>
        </Box>

        {/* Legal Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <CustomCard
            sx={{
              p: 4,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Important Notice
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              TradiRise operates solely as a platform for connecting tradies
              with potential customers. We are not a party to any agreement
              between tradies and customers. All tradies listed on our platform
              are independent contractors operating their own businesses.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Customers are responsible for conducting their own due diligence,
              including verifying licenses, insurance, and qualifications before
              engaging any tradie. We recommend obtaining multiple quotes,
              checking references, and ensuring proper contracts are in place
              before any work begins.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For disputes or issues with work performed, customers should
              contact the tradie directly or seek appropriate legal advice.
              TradiRise does not mediate disputes or provide refunds for
              services rendered by tradies.
            </Typography>
          </CustomCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutSection;

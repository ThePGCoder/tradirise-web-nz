// app/components/LandingHero.tsx
"use client";

import React from "react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Logo from "@/components/Logo";
import Slogan from "@/components/Slogan";
import CustomCard from "@/components/CustomCard";
import { Center } from "@/components/Center";
import { darkTheme, lightTheme } from "@/styles/theme";
import { useThemeMode } from "@/hooks/useThemeMode";

const MotionBox = motion(Box);

const LandingHero = () => {
  const router = useRouter();
  const { mode } = useThemeMode();

  const items = [
    {
      icon: "eos-icons:role-binding",
      title: "List A Position",
      desc: "List a position available in your business.",
      onClick: () => {},
    },
    {
      icon: "mingcute:house-fill",
      title: "List Your Project",
      desc: "Find suitable trades to help with your project.",
      onClick: undefined,
    },
    {
      icon: "entypo:v-card",
      title: "List Your Trade Skills",
      desc: "Make yourself available to other businesses.",
      onClick: () => {},
    },
    {
      icon: "ic:baseline-business",
      title: "List Your Business",
      desc: "Make yourself available to potential clients.",
      onClick: undefined,
    },
  ];

  const handleExplore = () => {
    router.push("/home");
  };

  return (
    <Container sx={{ py: 4, pt: 20 }}>
      <Stack alignItems="center" sx={{ userSelect: "none" }}>
        {/* Extra Small (xs) */}
        <Box display={{ xs: "flex", sm: "none" }}>
          <Logo
            fontSize="36px"
            iconHeight="40px"
            showCountry={true}
            countryFontSize={10}
            countryLetterSpacing={6}
          />
        </Box>
        <Box display={{ xs: "flex", sm: "none" }} sx={{ mt: 4 }}>
          <Slogan fontSize="18px" />
        </Box>

        {/* Small (sm) */}
        <Box display={{ xs: "none", sm: "flex", md: "none" }}>
          <Logo
            fontSize="48px"
            iconHeight="52px"
            showCountry={true}
            countryFontSize={12}
            countryLetterSpacing={8}
          />
        </Box>
        <Box display={{ xs: "none", sm: "flex", md: "none" }} sx={{ mt: 4 }}>
          <Slogan fontSize="22px" />
        </Box>

        {/* Medium (md) */}
        <Box display={{ xs: "none", sm: "none", md: "flex", lg: "none" }}>
          <Logo
            fontSize="60px"
            iconHeight="64px"
            showCountry={true}
            countryFontSize={13}
            countryLetterSpacing={9}
          />
        </Box>
        <Box
          display={{ xs: "none", sm: "none", md: "flex", lg: "none" }}
          sx={{ mt: 3 }}
        >
          <Slogan fontSize="24px" />
        </Box>

        {/* Large (lg) and Extra Large (xl) */}
        <Box display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}>
          <Logo
            fontSize="75px"
            iconHeight="75px"
            showCountry={true}
            countryFontSize={15}
            countryLetterSpacing={10}
          />
        </Box>
        <Box
          display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
          sx={{ mt: 4 }}
        >
          <Slogan fontSize="28px" />
        </Box>
      </Stack>

      <MotionBox
        textAlign="center"
        sx={{ mt: 4 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Center>
          <Stack spacing={{ xs: 2, sm: 2, md: 4 }} alignItems="center">
            <Box
              display={{ xs: "flex", sm: "flex", md: "none" }}
              sx={{ maxWidth: 1200, userSelect: "none" }}
            >
              <Typography variant="subtitle1" sx={{ mt: 4 }}>
                Connecting tradespeople, clients, employers, and businesses —
                all in one place. Find work, post jobs, and grow your trade.
              </Typography>
            </Box>

            <Box
              display={{ xs: "none", sm: "none", md: "Flex" }}
              sx={{ maxWidth: 1200, userSelect: "none" }}
            >
              <Typography variant="h6" sx={{ mt: 2 }}>
                Connecting tradespeople, clients, employers, and businesses —
                all in one place. Find work, post jobs, and grow your trade.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={5}
              justifyContent="center"
              width="100%"
              py={4}
            >
              <Button
                size="large"
                color="dusk"
                fullWidth
                onClick={handleExplore}
                sx={{ fontSize: 16, fontWeight: 600 }}
                startIcon={<Icon icon="ion:ticket-sharp" />}
              >
                Guest
              </Button>

              <Button
                size="large"
                fullWidth
                sx={{ borderWidth: 2, fontSize: 16, fontWeight: 600 }}
                onClick={() => router.push("/login")}
                startIcon={<Icon icon="vaadin:rocket" />}
              >
                Register
              </Button>

              <Button
                size="large"
                fullWidth
                sx={{ borderWidth: 2, fontSize: 16, fontWeight: 600 }}
                onClick={() => router.push("/login")}
                startIcon={<Icon icon="mdi:lock-open-variant" />}
              >
                Login
              </Button>
            </Stack>

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
                      cursor: item.onClick ? "pointer" : "default",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
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
                      <Typography
                        variant="h6"
                        textAlign="center"
                        fontWeight="bold"
                      >
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
          </Stack>
        </Center>
      </MotionBox>
    </Container>
  );
};

export default LandingHero;

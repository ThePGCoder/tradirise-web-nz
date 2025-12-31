// app/components/LandingHero.tsx
"use client";

import React from "react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Logo from "@/components/Logo";
import Slogan from "@/components/Slogan";
import { Center } from "@/components/Center";
import LandingFeatures from "./LandingFeatures";

const MotionBox = motion(Box);

const LandingHero = () => {
  const router = useRouter();

  const handleExplore = () => {
    router.push("/home");
  };

  return (
    <Container sx={{ pt: 20 }}>
      <Stack alignItems="center" sx={{ userSelect: "none" }}>
        {/* Extra Small (xs) */}
        <Box display={{ xs: "flex", sm: "none" }}>
          <Logo
            fontSize="36px"
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

        {/* Large (lg) */}
        <Box
          display={{
            xs: "none",
            sm: "none",
            md: "none",
            lg: "flex",
            xl: "none",
          }}
        >
          <Logo
            fontSize="75px"
            showCountry={true}
            countryFontSize={15}
            countryLetterSpacing={10}
          />
        </Box>

        {/* Extra Large (xl) */}
        <Box
          display={{
            xs: "none",
            sm: "none",
            md: "none",
            lg: "none",
            xl: "flex",
          }}
        >
          <Logo
            fontSize="100px"
            showCountry={true}
            countryFontSize={20}
            countryLetterSpacing={12}
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
                Connecting tradespeople, clients, and businesses through modern
                trade classifieds — all in one place. Post listings, discover
                opportunities, and grow your trade presence.
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

            <LandingFeatures />
          </Stack>
        </Center>
      </MotionBox>
    </Container>
  );
};

export default LandingHero;

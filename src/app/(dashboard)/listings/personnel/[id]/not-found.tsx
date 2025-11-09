// src/app/projects/[id]/not-found.tsx
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Icon } from "@iconify/react";
import Center from "@/global/Center";
import Flex from "@/global/Flex";
import Link from "next/link";

const PersonnelNotFound: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Center sx={{ minHeight: "75vh" }}>
        <Box textAlign="center">
          <Box color="text.secondary" sx={{ opacity: 0.3, mb: 2 }}>
            <Icon icon="mdi:account-search" width={80} height={80} />
          </Box>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Personnel Not Found
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            The personnel listing could not be found
          </Typography>

          <Flex gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              component={Link}
              href="/listings/personnel"
              variant="contained"
              size="small"
              startIcon={<Icon icon="mdi:arrow-left" />}
            >
              Back to Personnel
            </Button>

            <Button
              component={Link}
              href="/"
              variant="text"
              size="small"
              startIcon={<Icon icon="mdi:home" />}
            >
              Go Home
            </Button>
          </Flex>
        </Box>
      </Center>
    </Container>
  );
};

export default PersonnelNotFound;

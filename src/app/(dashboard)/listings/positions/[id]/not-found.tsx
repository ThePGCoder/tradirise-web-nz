// app/listings/positions/[id]/not-found.tsx
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Icon } from "@iconify/react";
import Center from "@/global/Center";
import Flex from "@/global/Flex";
import Link from "next/link";

const PositionNotFound: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Center sx={{ minHeight: "60vh" }}>
        <Box textAlign="center">
          <Box color="text.secondary" sx={{ opacity: 0.3, mb: 2 }}>
            <Icon icon="mdi:briefcase-search" width={80} height={80} />
          </Box>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Position Not Found
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            The position listing could not be found
          </Typography>

          <Flex gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              component={Link}
              href="/listings/positions"
              variant="contained"
              size="small"
              startIcon={<Icon icon="mdi:arrow-left" />}
            >
              Back to Positions
            </Button>

            <Button
              component={Link}
              href="/"
              variant="outlined"
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

export default PositionNotFound;

// app/listings/projects/[id]/not-found.tsx
import { Container, Typography, Button, Box } from "@mui/material";
import { Icon } from "@iconify/react";
import Center from "@/global/Center";
import Flex from "@/global/Flex";
import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <Container maxWidth="md">
      <Center sx={{ minHeight: "60vh" }}>
        <Box textAlign="center">
          <Box color="text.secondary" sx={{ opacity: 0.3, mb: 2 }}>
            <Icon icon="mdi:folder-search" width={80} height={80} />
          </Box>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Project Not Found
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            The project listing could not be found
          </Typography>

          <Flex gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              component={Link}
              href="/listings/projects"
              variant="contained"
              size="small"
              startIcon={<Icon icon="mdi:arrow-left" />}
            >
              Back to Projects
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
}

import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import { Box, Stack } from "@mui/material";

import RegisterForm from "./components/RegisterForm";
import ImageCrossfade from "@/components/ImageCrossfade";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Stack items vertically
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
        minHeight: "calc(100vh - 50px)", // Take up at least the full viewport height
        width: "100vw", // Take up the full viewport width
        p: 2, // Add some padding
      }}
    >
      {/* Mobile layout */}
      <Box
        sx={{
          display: { lg: "none" },
          width: { xs: "100%", sm: "400px", md: "450px" },
        }}
      >
        <CustomCard>
          <RegisterForm />
        </CustomCard>
      </Box>

      {/* Desktop layout */}
      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        <CustomCard>
          <Flex>
            {/* Cover */}
            <Box
              position="relative"
              sx={{
                width: 400,
                height: "600",
                flexShrink: 0,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <ImageCrossfade
                images={["/site.png", "/site2.png", "/site3.png"]}
              />
            </Box>

            <Stack width={400} alignItems="center" gap={2} position="relative">
              <RegisterForm />
            </Stack>
          </Flex>
        </CustomCard>
      </Box>
    </Box>
  );
};

export default Register;

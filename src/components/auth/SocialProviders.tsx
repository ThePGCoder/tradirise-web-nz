"use client";
import React from "react";
import { Button, Box } from "@mui/material";
import { Icon } from "@iconify/react";
import { signInWithGoogle } from "@/lib/authActions";

const SocialProviders: React.FC = () => {
  return (
    <Box component="form" action={signInWithGoogle} sx={{ width: "100%" }}>
      <Button
        type="submit"
        fullWidth
        variant="text"
        startIcon={<Icon icon="logos:google-icon" />}
      >
        Continue with Google
      </Button>
    </Box>
  );
};

export default SocialProviders;

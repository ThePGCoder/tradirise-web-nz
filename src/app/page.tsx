"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { Box } from "@mui/material";
import { orange } from "@mui/material/colors";
import Middle from "@/components/Middle";
import { useThemeMode } from "@/hooks/useThemeMode";
import { motion } from "framer-motion";

const Splash: React.FC = () => {
  const { mode } = useThemeMode();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/landing");
    }, 2000); // Wait 2 seconds before redirecting

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Middle>
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{
          scale: 1,
          rotate: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              icon="fa7-solid:earth-oceania"
              color={mode === "light" ? orange[800] : orange[300]}
              height={100}
            />
          </Box>
        </motion.div>
      </motion.div>
    </Middle>
  );
};

export default Splash;

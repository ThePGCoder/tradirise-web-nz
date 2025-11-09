"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface ImageCrossfadeProps {
  images: string[];
  interval?: number; // Time in milliseconds between transitions (default: 5000)
  duration?: number; // Fade transition duration in seconds (default: 1)
  sx?: object;
  alt?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export default function ImageCrossfade({
  images,
  interval = 5000,
  duration = 1,
  sx = {},
  alt = "Crossfade image",
  objectFit = "cover",
}: ImageCrossfadeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...sx,
      }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: objectFit,
          }}
        />
      </AnimatePresence>
    </Box>
  );
}

// src/components/CustomStepper.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Icon } from "@iconify/react";

interface CustomStepperProps {
  steps: string[];
  activeStep: number;
  orientation?: "horizontal" | "vertical";
  showStepNumbers?: boolean;
  completedIcon?: string;
  stepSpacing?: number;
  onStepClick?: (stepIndex: number) => void;
  clickableSteps?: boolean;
}

const CustomStepper: React.FC<CustomStepperProps> = ({
  steps,
  activeStep,
  orientation = "horizontal",
  showStepNumbers = true,
  completedIcon = "mdi:check",
  stepSpacing = 150,
  onStepClick,
  clickableSteps = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to active step
  useEffect(() => {
    if (
      orientation === "horizontal" &&
      stepRefs.current[activeStep] &&
      scrollContainerRef.current
    ) {
      const stepElement = stepRefs.current[activeStep];
      const container = scrollContainerRef.current;

      if (stepElement) {
        const containerWidth = container.offsetWidth;
        const stepLeft = stepElement.offsetLeft;
        const stepWidth = stepElement.offsetWidth;

        // Center the active step
        const scrollPosition = stepLeft - containerWidth / 2 + stepWidth / 2;

        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }
    }
  }, [activeStep, orientation]);

  const handleStepClick = (index: number) => {
    if (clickableSteps && onStepClick) {
      onStepClick(index);
    }
  };

  if (orientation === "vertical") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
        }}
      >
        {steps.map((label, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mb: index === steps.length - 1 ? 0 : 3,
              position: "relative",
            }}
          >
            {/* Step Circle */}
            <Box
              onClick={() => handleStepClick(index)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  index < activeStep
                    ? "primary.main"
                    : index === activeStep
                    ? "primary.main"
                    : "grey.300",
                color:
                  index <= activeStep
                    ? "primary.contrastText"
                    : "text.secondary",
                fontSize: "0.875rem",
                fontWeight: "medium",
                flexShrink: 0,
                cursor: clickableSteps ? "pointer" : "default",
                transition: "all 0.3s ease",
                "&:hover": clickableSteps
                  ? {
                      transform: "scale(1.1)",
                    }
                  : {},
              }}
            >
              {index < activeStep ? (
                <Icon icon={completedIcon} width={20} />
              ) : showStepNumbers ? (
                index + 1
              ) : (
                ""
              )}
            </Box>

            {/* Step Content */}
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color:
                    index <= activeStep ? "text.primary" : "text.secondary",
                  fontWeight: index === activeStep ? "medium" : "normal",
                  cursor: clickableSteps ? "pointer" : "default",
                  userSelect: "none",
                }}
                onClick={() => handleStepClick(index)}
              >
                {label}
              </Typography>
            </Box>

            {/* Vertical Connector Line */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  left: 15,
                  top: 32,
                  width: 2,
                  height: 24,
                  backgroundColor:
                    index < activeStep ? "primary.main" : "grey.300",
                  transition: "background-color 0.3s ease",
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  }

  // Horizontal stepper with auto-scroll
  return (
    <Box
      ref={scrollContainerRef}
      sx={{
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        scrollBehavior: "smooth",
        userSelect: "none",
        // Custom scrollbar styling
        "&::-webkit-scrollbar": {
          height: 8,
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(0,0,0,0.1)",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          background: (theme) => theme.palette.primary.main,
          borderRadius: 4,
          "&:hover": {
            background: (theme) => theme.palette.primary.dark,
          },
        },
        // Firefox scrollbar
        scrollbarWidth: "thin",
        scrollbarColor: (theme) =>
          `${theme.palette.primary.main} rgba(0,0,0,0.1)`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: {
            xs: "flex-start",
            xl: "center",
          },
          position: "relative",
          py: 2,
          px: 2,
          minWidth: "100%",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          {steps.map((label, index) => (
            <Box
              key={index}
              ref={(el: HTMLDivElement | null) => {
                stepRefs.current[index] = el;
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                minWidth: `${stepSpacing}px`,
                cursor: clickableSteps ? "pointer" : "default",
                userSelect: "none",
              }}
              onClick={() => handleStepClick(index)}
            >
              {/* Step Circle */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    index < activeStep
                      ? "primary.main"
                      : index === activeStep
                      ? "primary.main"
                      : "grey.300",
                  color: index <= activeStep ? "primary.contrastText" : "#000",
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  zIndex: 2,
                  position: "relative",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                  userSelect: "none",
                  "&:hover": clickableSteps
                    ? {
                        transform: "scale(1.1)",
                        boxShadow: 2,
                      }
                    : {},
                }}
              >
                {index < activeStep ? (
                  <Icon icon={completedIcon} width={20} />
                ) : showStepNumbers ? (
                  index + 1
                ) : (
                  ""
                )}
              </Box>

              {/* Step Label */}
              <Typography
                variant="body2"
                sx={{
                  mt: 1.5,
                  textAlign: "center",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  color:
                    index <= activeStep ? "text.primary" : "text.secondary",
                  fontWeight: index === activeStep ? "medium" : "normal",
                  maxWidth: "140px",
                  lineHeight: 1.3,
                  transition: "color 0.3s ease",
                  minHeight: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  "&::selection": {
                    background: "transparent",
                  },
                }}
              >
                {label}
              </Typography>

              {/* Horizontal Connector Line */}
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 15,
                    left: "calc(50% + 20px)",
                    width: `${stepSpacing - 40}px`,
                    height: 2,
                    backgroundColor:
                      index < activeStep ? "primary.main" : "grey.300",
                    zIndex: 1,
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomStepper;

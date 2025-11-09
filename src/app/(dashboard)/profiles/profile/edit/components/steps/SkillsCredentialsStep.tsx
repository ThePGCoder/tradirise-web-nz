// src/app/profile/edit/components/steps/SkillsCredentialsStep.tsx
"use client";

import React, { useState } from "react";
import {
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { Icon } from "@iconify/react";
import {
  AccreditationItem,
  ProfileFormData,
  SkillItem,
} from "../../../types/profile-types";
import {
  skillsByTrade,
  accreditationsByCategory,
} from "@/lib/data/skillsAndAccreditations";

interface SkillsCredentialsStepProps {
  formData: ProfileFormData;
  onInputChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
}

const SkillsCredentialsStep: React.FC<SkillsCredentialsStepProps> = ({
  formData,
  onInputChange,
}) => {
  // Convert flat array to structured format (for backward compatibility)
  const parseSkills = (): SkillItem[] => {
    if (!formData.skills || formData.skills.length === 0) return [];
    if (typeof formData.skills[0] === "object") {
      return formData.skills as SkillItem[];
    }
    return [];
  };

  const parseAccreditations = (): AccreditationItem[] => {
    if (!formData.accreditations || formData.accreditations.length === 0)
      return [];
    if (typeof formData.accreditations[0] === "object") {
      return formData.accreditations as AccreditationItem[];
    }
    return [];
  };

  const [skills, setSkills] = useState<SkillItem[]>(parseSkills());
  const [accreditations, setAccreditations] = useState<AccreditationItem[]>(
    parseAccreditations()
  );

  const isSkillSelected = (trade: string, skill: string): boolean => {
    return skills.some((s) => s.trade === trade && s.skill === skill);
  };

  const isAccreditationSelected = (
    category: string,
    accreditation: string
  ): boolean => {
    return accreditations.some(
      (a) => a.category === category && a.accreditation === accreditation
    );
  };

  const handleSkillToggle = (trade: string, skill: string) => {
    let updatedSkills: SkillItem[];

    if (isSkillSelected(trade, skill)) {
      updatedSkills = skills.filter(
        (s) => !(s.trade === trade && s.skill === skill)
      );
    } else {
      updatedSkills = [...skills, { trade, skill }];
    }

    setSkills(updatedSkills);
    onInputChange("skills", updatedSkills);
  };

  const handleAccreditationToggle = (
    category: string,
    accreditation: string
  ) => {
    let updatedAccreditations: AccreditationItem[];

    if (isAccreditationSelected(category, accreditation)) {
      updatedAccreditations = accreditations.filter(
        (a) => !(a.category === category && a.accreditation === accreditation)
      );
    } else {
      updatedAccreditations = [...accreditations, { category, accreditation }];
    }

    setAccreditations(updatedAccreditations);
    onInputChange("accreditations", updatedAccreditations);
  };

  const getTradeSkillCount = (trade: string): number => {
    return skills.filter((s) => s.trade === trade).length;
  };

  const getCategoryAccreditationCount = (category: string): number => {
    return accreditations.filter((a) => a.category === category).length;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Skills & Credentials
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select all applicable skills and accreditations
      </Typography>

      <Grid container spacing={3}>
        {/* Skills Section */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Skills
          </Typography>

          {Object.entries(skillsByTrade).map(([trade, tradeSkills]) => (
            <Accordion
              key={trade}
              disableGutters
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                "&:before": { display: "none" },
                mb: 1,
              }}
            >
              <AccordionSummary
                expandIcon={<Icon icon="mdi:chevron-down" />}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Typography fontWeight={500}>{trade}</Typography>
                  {getTradeSkillCount(trade) > 0 && (
                    <Chip
                      label={getTradeSkillCount(trade)}
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <FormGroup>
                  <Grid container spacing={1}>
                    {tradeSkills.map((skill) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={skill}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isSkillSelected(trade, skill)}
                              onChange={() => handleSkillToggle(trade, skill)}
                            />
                          }
                          label={skill}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Display selected skills summary */}
          {skills.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "primary.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Skills ({skills.length})
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {skills.map((item, index) => (
                  <Chip
                    key={index}
                    label={`${item.trade}: ${item.skill}`}
                    size="small"
                    color="primary"
                    onDelete={() => handleSkillToggle(item.trade, item.skill)}
                    deleteIcon={<Icon icon="mdi:close" />}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Grid>

        {/* Accreditations Section */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Accreditations
          </Typography>

          {Object.entries(accreditationsByCategory).map(
            ([category, categoryAccreditations]) => (
              <Accordion
                key={category}
                disableGutters
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "&:before": { display: "none" },
                  mb: 1,
                }}
              >
                <AccordionSummary
                  expandIcon={<Icon icon="mdi:chevron-down" />}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Typography fontWeight={500}>{category}</Typography>
                    {getCategoryAccreditationCount(category) > 0 && (
                      <Chip
                        label={getCategoryAccreditationCount(category)}
                        size="small"
                        color="success"
                      />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <FormGroup>
                    <Grid container spacing={1}>
                      {categoryAccreditations.map((accreditation) => (
                        <Grid
                          size={{ xs: 12, sm: 6, md: 4 }}
                          key={accreditation}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isAccreditationSelected(
                                  category,
                                  accreditation
                                )}
                                onChange={() =>
                                  handleAccreditationToggle(
                                    category,
                                    accreditation
                                  )
                                }
                              />
                            }
                            label={accreditation}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            )
          )}

          {/* Display selected accreditations summary */}
          {accreditations.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "success.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Accreditations ({accreditations.length})
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {accreditations.map((item, index) => (
                  <Chip
                    key={index}
                    label={`${item.category}: ${item.accreditation}`}
                    size="small"
                    color="success"
                    onDelete={() =>
                      handleAccreditationToggle(
                        item.category,
                        item.accreditation
                      )
                    }
                    deleteIcon={<Icon icon="mdi:close" />}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillsCredentialsStep;

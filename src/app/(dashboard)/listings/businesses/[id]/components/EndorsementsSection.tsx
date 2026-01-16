"use client";

import React, { useState, useTransition } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { BusinessEndorsementData } from "../../types/endorsements";
import {
  createRecommendation,
  toggleCategoryEndorsement,
  toggleEndorsement,
} from "../../actions/endorsements";
import {
  ENDORSEMENT_CATEGORIES,
  RELATIONSHIP_TYPES,
} from "@/lib/data/reviewData";

dayjs.extend(relativeTime);

interface EndorsementsSectionProps {
  businessId: string;
  initialData: BusinessEndorsementData;
}

export default function EndorsementsSection({
  businessId,
  initialData,
}: EndorsementsSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleEndorse = async () => {
    startTransition(async () => {
      const result = await toggleEndorsement(businessId);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleCategoryEndorse = async (category: string) => {
    startTransition(async () => {
      const result = await toggleCategoryEndorsement(businessId, category);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 3
          ? [...prev, tag]
          : prev
    );
  };

  const handleSubmitRecommendation = async () => {
    if (!selectedRelationship) return;

    startTransition(async () => {
      const result = await createRecommendation(businessId, {
        relationshipType: selectedRelationship,
        tags: selectedTags,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setDialogOpen(false);
        setSelectedRelationship("");
        setSelectedTags([]);
      }
    });
  };

  return (
    <Box>
      {/* Metrics Overview Card */}
      <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Trust & Reputation
          </Typography>

          <Stack direction="row" spacing={4} flexWrap="wrap">
            {/* Endorsements */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                <Typography variant="h4">⭐</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {initialData.totalEndorsements}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Endorsements
              </Typography>
            </Box>

            {/* Recommendations */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                <Typography variant="h4">👍</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {initialData.totalRecommendations}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Recommendations
              </Typography>
            </Box>

            {/* Views */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                <Typography variant="h4">👁️</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {initialData.totalViews.toLocaleString()}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Profile Views
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant={initialData.hasUserEndorsed ? "outlined" : "contained"}
              color="primary"
              onClick={handleEndorse}
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <Icon icon="mdi:star" />
                )
              }
            >
              {initialData.hasUserEndorsed ? "Endorsed" : "Endorse"}
            </Button>
            <Button
              variant={
                initialData.hasUserRecommended ? "outlined" : "contained"
              }
              color="success"
              onClick={() => setDialogOpen(true)}
              disabled={isPending}
              startIcon={<Icon icon="mdi:thumb-up" />}
            >
              {initialData.hasUserRecommended
                ? "Update Recommendation"
                : "Recommend"}
            </Button>
          </Stack>

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Category Endorsements */}
      {initialData.categoryEndorsements.length > 0 && (
        <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Most Endorsed For
            </Typography>
            <Stack spacing={2}>
              {initialData.categoryEndorsements
                .slice(0, 5)
                .map(({ category, count, hasUserEndorsed }) => (
                  <Box key={category}>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0.5}
                    >
                      <Flex alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight={600}>
                          {category}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${count}`}
                          color="primary"
                          variant="outlined"
                        />
                      </Flex>
                      <Button
                        size="small"
                        variant={hasUserEndorsed ? "contained" : "outlined"}
                        onClick={() => handleCategoryEndorse(category)}
                        disabled={isPending}
                      >
                        {hasUserEndorsed ? "Endorsed" : "Endorse"}
                      </Button>
                    </Flex>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        (count / initialData.totalRecommendations) * 100,
                        100
                      )}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Breakdown */}
      {Object.keys(initialData.relationshipBreakdown).length > 0 && (
        <Card variant="outlined" sx={{ bgcolor: "transparent", mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Recommendations Breakdown
            </Typography>
            <Stack spacing={1}>
              {Object.entries(initialData.relationshipBreakdown).map(
                ([type, count]) => (
                  <Flex
                    key={type}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">{type}</Typography>
                    <Chip
                      label={count}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Flex>
                )
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Recent Recommendations */}
      {initialData.recommendations.length > 0 && (
        <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Recent Recommendations
            </Typography>
            <Stack spacing={2} divider={<Divider />}>
              {initialData.recommendations.map((rec) => (
                <Box key={rec.id}>
                  <Flex justifyContent="space-between" mb={1}>
                    <Typography variant="body1" fontWeight={600}>
                      {rec.recommenderName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(rec.createdAt).fromNow()}
                    </Typography>
                  </Flex>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {rec.relationshipType}
                  </Typography>
                  <Flex gap={0.5} flexWrap="wrap">
                    {rec.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Flex>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Recommendation Dialog */}
      {/* Recommendation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Recommend This Business
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Relationship Type */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                How do you know this business? *
              </FormLabel>
              <RadioGroup
                value={selectedRelationship}
                onChange={(e) => setSelectedRelationship(e.target.value)}
              >
                {RELATIONSHIP_TYPES.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio />}
                    label={type}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Tags */}
            <Box>
              <Typography variant="body2" fontWeight={600} mb={1}>
                What stands out about them? (Choose up to 3)
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                mb={2}
                display="block"
              >
                Optional - Select qualities that best describe your experience
              </Typography>
              <Flex gap={1} flexWrap="wrap">
                {ENDORSEMENT_CATEGORIES.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagToggle(tag)}
                    color={selectedTags.includes(tag) ? "primary" : "default"}
                    variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Flex>
              <Typography variant="caption" color="text.secondary" mt={1}>
                {selectedTags.length}/3 selected
              </Typography>
            </Box>

            <Alert severity="info" icon={<Icon icon="mdi:information" />}>
              Your name will be visible. This is a relationship attestation, not
              a detailed review.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRecommendation}
            variant="contained"
            disabled={!selectedRelationship || isPending}
            startIcon={isPending && <CircularProgress size={16} />}
          >
            Submit Recommendation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

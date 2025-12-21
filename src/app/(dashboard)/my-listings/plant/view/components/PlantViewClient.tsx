// app/my-listings/plant/view/[id]/components/PlantViewClient.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useState } from "react";
import Flex from "@/global/Flex";
import ShareButton from "@/components/ShareButton";

interface PlantData {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  equipment_type: string;
  category: string;
  make?: string;
  model?: string;
  year?: number;
  condition: string;
  listing_type: string;
  sale_price?: number;
  price_type: string;
  hours_used?: number;
  delivery_available: boolean;
  region: string;
  posted_date: string;
  status: string;
  features?: string[];
  images?: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  auth_id: string;
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface PlantViewClientProps {
  plant: PlantData;
}

const PlantViewClient: React.FC<PlantViewClientProps> = ({ plant }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getExpiryDate = (postedDate: string) =>
    dayjs(postedDate).add(90, "days"); // Equipment listings typically 90 days

  const getDaysUntil = (dateString: string) => {
    const date = dayjs(dateString);
    const diff = date.diff(dayjs(), "day");
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    return `in ${diff} days`;
  };

  const formatPrice = () => {
    if (!plant.sale_price) return "POA";
    const priceStr = `$${Number(plant.sale_price).toLocaleString()}`;
    if (plant.price_type === "negotiable") return `${priceStr} (negotiable)`;
    return priceStr;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/plant/${plant.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete plant listing");
      }

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Error deleting plant listing:", error);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const expiryDate = getExpiryDate(plant.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);
  const expiryDays = expiryDate.diff(dayjs(), "day");

  const getEquipmentSubtitle = () => {
    const parts = [];
    if (plant.year) parts.push(plant.year);
    if (plant.make) parts.push(plant.make);
    if (plant.model) parts.push(plant.model);
    return parts.length > 0 ? parts.join(" ") : plant.equipment_type;
  };

  return (
    <Box margin="auto" width="100%" maxWidth={1200} pt={3}>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<Icon icon="mdi:arrow-left" />}
          onClick={() => router.back()}
          variant="text"
        >
          Back to Listings
        </Button>
      </Flex>

      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              {plant.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {getEquipmentSubtitle()}
            </Typography>
          </Box>
          <Chip
            label={isExpired ? "Expired" : "Active"}
            size="medium"
            color={isExpired ? "error" : "success"}
            sx={{ fontSize: "1rem", height: 32 }}
          />
        </Flex>
      </Box>

      <Grid container spacing={3}>
        {/* Images */}
        {plant.images && plant.images.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Images ({plant.images.length})
                </Typography>
                <ImageList cols={4} gap={8}>
                  {plant.images.map((url, index) => (
                    <ImageListItem key={url}>
                      <img
                        src={url}
                        alt={`${plant.title} ${index + 1}`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      {index === 0 && (
                        <Chip
                          label="Main"
                          size="small"
                          color="primary"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                          }}
                        />
                      )}
                    </ImageListItem>
                  ))}
                </ImageList>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {/* Description */}
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap" }}
                  color="text.secondary"
                >
                  {plant.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Equipment Details */}
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Equipment Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Equipment Type
                    </Typography>
                    <Typography variant="body1">
                      {plant.equipment_type}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">{plant.category}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Condition
                    </Typography>
                    <Chip label={plant.condition} size="small" color="info" />
                  </Grid>
                  {plant.hours_used && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Hours Used
                      </Typography>
                      <Typography variant="body1">
                        {plant.hours_used.toLocaleString()} hours
                      </Typography>
                    </Grid>
                  )}
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">{plant.region}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Features */}
            {plant.features && plant.features.length > 0 && (
              <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Features
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {plant.features.map((feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {/* Price */}
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Price
                </Typography>
                <Typography variant="h4" color="success.main" fontWeight={600}>
                  {formatPrice()}
                </Typography>
                {plant.delivery_available && (
                  <Chip
                    label="Delivery Available"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Contact Information
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {plant.contact_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href={`mailto:${plant.contact_email}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {plant.contact_email}
                      </a>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href={`tel:${plant.contact_phone}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {plant.contact_phone}
                      </a>
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Ad Details */}
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Ad Details
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Posted
                    </Typography>
                    <Typography variant="body1">
                      {getDaysUntil(plant.posted_date)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Expires
                    </Typography>
                    <Typography variant="body1">
                      {getDaysUntil(expiryDate.toISOString())}
                    </Typography>
                  </Box>
                  <Box>
                    <Chip
                      label={isExpired ? "Expired" : `${expiryDays} days left`}
                      size="small"
                      color={isExpired ? "error" : "warning"}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Flex gap={2} justifyContent="flex-end" mt={3}>
        <ShareButton
          useModal={true}
          variant="text"
          buttonText="Share"
          color="success"
          shareData={{
            url: `${window.location.origin}/plant/${plant.id}`,
            title: plant.title,
            description: `${getEquipmentSubtitle()} - ${plant.region}`,
          }}
        />

        <Button
          startIcon={<Icon icon="mdi:pencil" />}
          onClick={() => router.push(`/my-listings/plant/edit/${plant.id}`)}
          variant="text"
          color="primary"
        >
          Edit
        </Button>

        <Button
          startIcon={<Icon icon="mdi:delete" />}
          onClick={() => setDeleteDialogOpen(true)}
          variant="text"
          color="error"
        >
          Delete
        </Button>
      </Flex>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Equipment Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this equipment listing? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={
              isDeleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Icon icon="mdi:delete" />
              )
            }
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlantViewClient;

// app/my-listings/materials/view/[id]/components/MaterialViewClient.tsx
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

interface MaterialData {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  material_type: string;
  category: string;
  condition: string;
  quantity: number;
  unit: string;
  price: number;
  price_type: string;
  price_unit?: string;
  grade_quality?: string;
  dimensions?: string;
  brand?: string;
  delivery_available: boolean;
  delivery_cost?: string;
  minimum_order?: string;
  available_quantity?: number;
  location_details?: string;
  region: string;
  posted_date: string;
  status: string;
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

interface MaterialViewClientProps {
  material: MaterialData;
}

const MaterialViewClient: React.FC<MaterialViewClientProps> = ({
  material,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getExpiryDate = (postedDate: string) =>
    dayjs(postedDate).add(90, "days");

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
    const priceStr = `$${Number(material.price).toLocaleString()}`;
    if (material.price_unit) return `${priceStr}/${material.price_unit}`;
    if (material.price_type === "negotiable") return `${priceStr} (negotiable)`;
    return priceStr;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/materials/${material.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete material listing");
      }

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Error deleting material listing:", error);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const expiryDate = getExpiryDate(material.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);
  const expiryDays = expiryDate.diff(dayjs(), "day");

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
              {material.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {material.material_type} • {material.category}
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
        {material.images && material.images.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Images ({material.images.length})
                </Typography>
                <ImageList cols={4} gap={8}>
                  {material.images.map((url, index) => (
                    <ImageListItem key={url}>
                      <img
                        src={url}
                        alt={`${material.title} ${index + 1}`}
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
                  {material.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Material Details */}
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Material Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Material Type
                    </Typography>
                    <Typography variant="body1">
                      {material.material_type}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">{material.category}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Condition
                    </Typography>
                    <Chip
                      label={material.condition}
                      size="small"
                      color="info"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Quantity
                    </Typography>
                    <Typography variant="body1">
                      {material.quantity} {material.unit}
                    </Typography>
                  </Grid>
                  {material.grade_quality && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Grade/Quality
                      </Typography>
                      <Typography variant="body1">
                        {material.grade_quality}
                      </Typography>
                    </Grid>
                  )}
                  {material.dimensions && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Dimensions
                      </Typography>
                      <Typography variant="body1">
                        {material.dimensions}
                      </Typography>
                    </Grid>
                  )}
                  {material.brand && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Brand
                      </Typography>
                      <Typography variant="body1">{material.brand}</Typography>
                    </Grid>
                  )}
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">{material.region}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Delivery & Availability */}
            {(material.delivery_available ||
              material.minimum_order ||
              material.available_quantity) && (
              <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Delivery & Availability
                  </Typography>
                  <Stack spacing={1.5}>
                    {material.delivery_available && (
                      <Box>
                        <Chip
                          label={`Delivery Available${material.delivery_cost ? ` - ${material.delivery_cost}` : ""}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    )}
                    {material.minimum_order && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Minimum Order
                        </Typography>
                        <Typography variant="body1">
                          {material.minimum_order}
                        </Typography>
                      </Box>
                    )}
                    {material.available_quantity && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Available Quantity
                        </Typography>
                        <Typography variant="body1">
                          {material.available_quantity} {material.unit}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
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
                <Chip
                  label={material.price_type}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
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
                      {material.contact_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href={`mailto:${material.contact_email}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {material.contact_email}
                      </a>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href={`tel:${material.contact_phone}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {material.contact_phone}
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
                      {getDaysUntil(material.posted_date)}
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
            url: `${window.location.origin}/materials/${material.id}`,
            title: material.title,
            description: `${material.material_type} - ${material.quantity} ${material.unit} in ${material.region}`,
          }}
        />

        <Button
          startIcon={<Icon icon="mdi:pencil" />}
          onClick={() =>
            router.push(`/my-listings/materials/edit/${material.id}`)
          }
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
        <DialogTitle>Delete Material Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this material listing? This action
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

export default MaterialViewClient;

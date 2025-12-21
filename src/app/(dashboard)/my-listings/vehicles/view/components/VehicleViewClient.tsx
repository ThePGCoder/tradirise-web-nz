// app/my-listings/vehicles/view/[id]/components/VehicleViewClient.tsx
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

interface VehicleData {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  price: number;
  price_type: string;
  mileage?: number;
  registration_expires?: string;
  wof_expires?: string;
  transmission?: string;
  fuel_type?: string;
  body_type?: string;
  engine_size?: string;
  doors?: number;
  seats?: number;
  color?: string;
  vin?: string;
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

interface VehicleViewClientProps {
  vehicle: VehicleData;
}

const VehicleViewClient: React.FC<VehicleViewClientProps> = ({ vehicle }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getExpiryDate = (postedDate: string) =>
    dayjs(postedDate).add(30, "days");

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
    const priceStr = `$${Number(vehicle.price).toLocaleString()}`;
    if (vehicle.price_type === "negotiable") return `${priceStr} (negotiable)`;
    return priceStr;
  };

  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    const date = dayjs(dateString);
    const now = dayjs();
    const diff = date.diff(now, "day");
    return diff >= 0 && diff <= 30;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete vehicle listing");
      }

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Error deleting vehicle listing:", error);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const expiryDate = getExpiryDate(vehicle.posted_date);
  const isExpired = dayjs().isAfter(expiryDate);
  const expiryDays = expiryDate.diff(dayjs(), "day");

  const getVehicleSubtitle = () => {
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
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
              {vehicle.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {getVehicleSubtitle()}
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
        {vehicle.images && vehicle.images.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Images ({vehicle.images.length})
                </Typography>
                <ImageList cols={4} gap={8}>
                  {vehicle.images.map((url, index) => (
                    <ImageListItem key={url}>
                      <img
                        src={url}
                        alt={`${vehicle.title} ${index + 1}`}
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
                  {vehicle.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Vehicle Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Vehicle Type
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.vehicle_type}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Condition
                    </Typography>
                    <Chip label={vehicle.condition} size="small" color="info" />
                  </Grid>
                  {vehicle.mileage && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Mileage
                      </Typography>
                      <Typography variant="body1">
                        {vehicle.mileage.toLocaleString()} km
                      </Typography>
                    </Grid>
                  )}
                  {vehicle.transmission && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Transmission
                      </Typography>
                      <Typography variant="body1">
                        {vehicle.transmission}
                      </Typography>
                    </Grid>
                  )}
                  {vehicle.fuel_type && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Fuel Type
                      </Typography>
                      <Typography variant="body1">
                        {vehicle.fuel_type}
                      </Typography>
                    </Grid>
                  )}
                  {vehicle.body_type && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Body Type
                      </Typography>
                      <Typography variant="body1">
                        {vehicle.body_type}
                      </Typography>
                    </Grid>
                  )}
                  {vehicle.engine_size && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Engine Size
                      </Typography>
                      <Typography variant="body1">
                        {vehicle.engine_size}
                      </Typography>
                    </Grid>
                  )}
                  {vehicle.color && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Color
                      </Typography>
                      <Typography variant="body1">{vehicle.color}</Typography>
                    </Grid>
                  )}
                  {vehicle.doors && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Doors
                      </Typography>
                      <Typography variant="body1">{vehicle.doors}</Typography>
                    </Grid>
                  )}
                  {vehicle.seats && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Seats
                      </Typography>
                      <Typography variant="body1">{vehicle.seats}</Typography>
                    </Grid>
                  )}
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">{vehicle.region}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Registration & WOF */}
            {(vehicle.registration_expires || vehicle.wof_expires) && (
              <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Registration & WOF
                  </Typography>
                  <Stack spacing={1.5}>
                    {vehicle.registration_expires && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Registration Expires
                        </Typography>
                        <Flex gap={1} alignItems="center">
                          <Typography variant="body1">
                            {dayjs(vehicle.registration_expires).format(
                              "DD MMM YYYY"
                            )}
                          </Typography>
                          {isExpiringSoon(vehicle.registration_expires) && (
                            <Chip
                              label="Expiring Soon"
                              size="small"
                              color="warning"
                            />
                          )}
                        </Flex>
                      </Box>
                    )}
                    {vehicle.wof_expires && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          WOF Expires
                        </Typography>
                        <Flex gap={1} alignItems="center">
                          <Typography variant="body1">
                            {dayjs(vehicle.wof_expires).format("DD MMM YYYY")}
                          </Typography>
                          {isExpiringSoon(vehicle.wof_expires) && (
                            <Chip
                              label="Expiring Soon"
                              size="small"
                              color="warning"
                            />
                          )}
                        </Flex>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <Card variant="outlined" sx={{ bgcolor: "transparent" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Features
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {vehicle.features.map((feature) => (
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
                      {vehicle.contact_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href={`mailto:${vehicle.contact_email}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {vehicle.contact_email}
                      </a>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href={`tel:${vehicle.contact_phone}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {vehicle.contact_phone}
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
                      {getDaysUntil(vehicle.posted_date)}
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
            url: `${window.location.origin}/vehicles/${vehicle.id}`,
            title: vehicle.title,
            description: `${getVehicleSubtitle()} - ${vehicle.region}`,
          }}
        />

        <Button
          startIcon={<Icon icon="mdi:pencil" />}
          onClick={() =>
            router.push(`/my-listings/vehicles/edit/${vehicle.id}`)
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
        <DialogTitle>Delete Vehicle Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this vehicle listing? This action
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

export default VehicleViewClient;

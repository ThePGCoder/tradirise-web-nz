// app/listings/marketplace/vehicles/[id]/VehiclesDetailClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  Grid,
  CardContent,
  IconButton,
  ImageList,
  ImageListItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import ShareButton from "@/components/ShareButton";
import FavouriteButton from "@/app/(dashboard)/my-favourites/components/FavouriteButton";
import CustomCard from "@/components/CustomCard";

interface VehicleAd {
  id: string;
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
  features?: string[];
  region: string;
  images?: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  is_business_listing: boolean;
  business_id?: string;
  auth_id: string;
  posted_date: string;
  updated_at: string;
  status: string;
  views: number;
  enquiries: number;
  username?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  business_logo_url?: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
  businesses?: {
    business_name?: string;
    logo_url?: string;
  };
}

interface VehicleDetailClientProps {
  vehicle: VehicleAd;
}

const VehicleDetailClient: React.FC<VehicleDetailClientProps> = ({
  vehicle,
}) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [success, setSuccess] = useState<string | null>(null);

  // Get valid images array
  const images = Array.isArray(vehicle.images)
    ? vehicle.images.filter((img) => img && img.trim() !== "")
    : [];

  useEffect(() => {
    console.log("=== VEHICLE DETAIL DEBUG ===");
    console.log("Vehicle data:", {
      id: vehicle.id,
      title: vehicle.title,
      images: vehicle.images,
      imagesType: typeof vehicle.images,
      isArray: Array.isArray(vehicle.images),
      imagesLength: vehicle.images?.length,
      validImages: images.length,
    });

    if (images.length > 0) {
      console.log("First image URL:", images[0]);
    }
  }, [vehicle, images]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage?: number) => {
    if (!mileage) return "Not specified";
    return `${mileage.toLocaleString()} km`;
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMM YYYY");
  };

  // Handle both flattened and nested data
  const displayAvatar = vehicle.is_business_listing
    ? vehicle.business_logo_url || vehicle.businesses?.logo_url || null
    : vehicle.avatar_url || vehicle.profiles?.avatar_url || null;

  const displayName = vehicle.is_business_listing
    ? vehicle.business_name ||
      vehicle.businesses?.business_name ||
      vehicle.contact_name
    : vehicle.contact_name;

  const firstName = vehicle.first_name || vehicle.profiles?.first_name;
  const username = vehicle.username || vehicle.profiles?.username;
  const businessName =
    vehicle.business_name || vehicle.businesses?.business_name;

  const avatarFallback = vehicle.is_business_listing
    ? (businessName?.[0] || vehicle.contact_name?.[0] || "B").toUpperCase()
    : (
        firstName?.[0] ||
        username?.[0] ||
        vehicle.contact_name?.[0] ||
        "U"
      ).toUpperCase();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load:", e.currentTarget.src);
    e.currentTarget.style.display = "none";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<Icon icon="mdi:arrow-left" />}
        onClick={() => router.push("/listings/marketplace?tab=vehicles")}
        sx={{ mb: 3 }}
      >
        Back to Marketplace
      </Button>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Main Image */}
          <CustomCard sx={{ mb: 2 }}>
            <Box
              sx={{
                width: "100%",
                height: 500,
                backgroundColor: "grey.200",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {images.length > 0 ? (
                <>
                  <Box
                    component="img"
                    src={images[selectedImage]}
                    alt={`${vehicle.title} - Image ${selectedImage + 1}`}
                    onError={handleImageError}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      backgroundColor: "grey.900",
                    }}
                  />

                  {/* Image Counter */}
                  <Chip
                    label={`${selectedImage + 1} / ${images.length}`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                    }}
                  />

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <IconButton
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        sx={{
                          position: "absolute",
                          left: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          },
                        }}
                      >
                        <Icon icon="mdi:chevron-left" width={32} />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                        sx={{
                          position: "absolute",
                          right: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          },
                        }}
                      >
                        <Icon icon="mdi:chevron-right" width={32} />
                      </IconButton>
                    </>
                  )}
                </>
              ) : (
                <Flex
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  color="grey.500"
                >
                  <Icon icon="mdi:car" width={80} height={80} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    No Images Available
                  </Typography>
                </Flex>
              )}
            </Box>
          </CustomCard>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <CustomCard sx={{ mb: 3 }}>
              <Box sx={{ p: 2 }}>
                <ImageList
                  sx={{ width: "100%", m: 0 }}
                  cols={Math.min(5, images.length)}
                  gap={8}
                >
                  {images.map((img, index) => (
                    <ImageListItem
                      key={index}
                      sx={{
                        cursor: "pointer",
                        border:
                          selectedImage === index
                            ? "3px solid primary.main"
                            : "3px solid transparent",
                        borderRadius: 1,
                        overflow: "hidden",
                        transition: "all 0.2s",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Box
                        component="img"
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        onError={handleImageError}
                        sx={{
                          width: "100%",
                          height: 100,
                          objectFit: "cover",
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            </CustomCard>
          )}

          {/* Vehicle Details */}
          <CustomCard>
            <CardContent>
              {/* Header */}
              <Flex alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={displayAvatar || undefined}
                  alt={displayName}
                  sx={{ width: 60, height: 60 }}
                >
                  {avatarFallback}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Typography>
                  <Typography color="text.secondary">
                    {vehicle.vehicle_type}
                  </Typography>
                </Box>
              </Flex>

              {/* Badges */}
              <Flex gap={1} mb={3} flexWrap="wrap">
                <Chip
                  label={vehicle.condition}
                  color={vehicle.condition === "new" ? "success" : "default"}
                />
                <Chip label={vehicle.price_type} variant="outlined" />
                {vehicle.is_business_listing && (
                  <Chip
                    label="Business Listing"
                    color="primary"
                    icon={<Icon icon="mdi:domain" />}
                  />
                )}
              </Flex>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {vehicle.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Specifications */}
              <Typography variant="h6" gutterBottom>
                Specifications
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mileage
                  </Typography>
                  <Typography variant="body1">
                    {formatMileage(vehicle.mileage)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Transmission
                  </Typography>
                  <Typography variant="body1">
                    {vehicle.transmission || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fuel Type
                  </Typography>
                  <Typography variant="body1">
                    {vehicle.fuel_type || "N/A"}
                  </Typography>
                </Grid>
                {vehicle.registration_expires && (
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Registration Expires
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(vehicle.registration_expires)}
                    </Typography>
                  </Grid>
                )}
                {vehicle.wof_expires && (
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      WOF Expires
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(vehicle.wof_expires)}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {vehicle.features && vehicle.features.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Features
                  </Typography>
                  <Box>
                    {vehicle.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </CustomCard>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Price Card */}
          <CustomCard sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {formatPrice(vehicle.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {vehicle.price_type}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Flex alignItems="center" gap={1} mb={1}>
                <Icon icon="mdi:map-marker" />
                <Typography variant="body2">{vehicle.region}</Typography>
              </Flex>

              <Flex alignItems="center" gap={1}>
                <Icon icon="mdi:calendar" />
                <Typography variant="body2">
                  Posted {formatDate(vehicle.posted_date)}
                </Typography>
              </Flex>
            </CardContent>
          </CustomCard>

          {/* Contact Card */}
          <CustomCard sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seller Information
              </Typography>
              <Flex alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={displayAvatar || undefined}
                  alt={displayName}
                  sx={{ width: 50, height: 50 }}
                >
                  {avatarFallback}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold">{displayName}</Typography>
                  {vehicle.is_business_listing && (
                    <Chip label="Business" size="small" />
                  )}
                </Box>
              </Flex>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Icon icon="mdi:email" />}
                sx={{ mb: 1 }}
              >
                Contact Seller
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Icon icon="mdi:phone" />}
              >
                {vehicle.contact_phone}
              </Button>
            </CardContent>
          </CustomCard>

          {/* Actions Card */}
          <CustomCard>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Actions
              </Typography>

              {/* Desktop Buttons */}
              <Flex
                gap={2}
                justifyContent="flex-start"
                flexDirection="column"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <FavouriteButton
                  itemType="vehicle"
                  itemId={vehicle.id}
                  size="medium"
                  fullWidth
                  onToggle={(isFavourited) => {
                    if (isFavourited) {
                      setSuccess("Vehicle saved to your favorites!");
                    }
                  }}
                />

                <ShareButton
                  useModal={true}
                  variant="text"
                  buttonText="Share Listing"
                  color="success"
                  shareData={{
                    url: `${window.location.origin}/listings/marketplace/vehicles/${vehicle.id}`,
                    title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                    description: vehicle.description,
                  }}
                />
              </Flex>

              {/* Mobile Icon Buttons */}
              <Flex
                gap={1}
                justifyContent="flex-end"
                sx={{ display: { xs: "flex", sm: "none" } }}
              >
                <FavouriteButton
                  itemType="vehicle"
                  itemId={vehicle.id}
                  size="small"
                  onToggle={(isFavourited) => {
                    if (isFavourited) {
                      setSuccess("Vehicle saved to your favorites!");
                    }
                  }}
                />

                <ShareButton
                  useModal={true}
                  variant="icon"
                  color="success"
                  shareData={{
                    url: `${window.location.origin}/listings/marketplace/vehicles/${vehicle.id}`,
                    title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                    description: vehicle.description,
                  }}
                />
              </Flex>
            </CardContent>
          </CustomCard>
        </Grid>
      </Grid>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VehicleDetailClient;

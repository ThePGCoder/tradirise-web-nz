import { useThemeMode } from "@/hooks/useThemeMode";
import {
  Button,
  Fab,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Stack,
  CardContent,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { lightTheme, darkTheme } from "@/styles/theme";
import CustomCard from "@/components/CustomCard";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AddListingDialogProps {}

const addListingOptions = [
  {
    title: "Add Tradie",
    desc: "Post personnel availability",
    icon: "entypo:v-card",
    route: "/listings/personnel/add-personnel",
  },
  {
    title: "Add Position",
    desc: "Post a job opening",
    icon: "eos-icons:role-binding",
    route: "/listings/positions/add-positions",
  },
  {
    title: "Add Project",
    desc: "Post a new project",
    icon: "mingcute:house-fill",
    route: "/listings/projects/add-project",
  },
  {
    title: "Promote Business",
    desc: "List your business",
    icon: "ic:baseline-business",
    route: "/listings/businesses/add-business",
  },
];

const AddListingDialog: React.FC<AddListingDialogProps> = () => {
  const [addListingDialogOpen, setAddListingDialogOpen] = useState(false);
  const { mode } = useThemeMode();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDialogOptionClick = (route: string) => {
    setAddListingDialogOpen(false);
    router.push(route);
  };

  const renderDialogOptions = () => (
    <Grid container spacing={2} justifyContent="center">
      {addListingOptions.map((option, idx) => (
        <Grid size={{ xs: 12, sm: 6 }} key={idx}>
          <CustomCard
            onClick={() => handleDialogOptionClick(option.route)}
            sx={{
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.05)", transition: "ease 0.2s" },
              backgroundImage:
                mode === "light"
                  ? "linear-gradient(#ffffff, #f8fafc)"
                  : "linear-gradient(#4a5568, #2d3748)",
            }}
          >
            <CardContent>
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <Icon
                  icon={option.icon}
                  height={40}
                  color={
                    mode === "light"
                      ? lightTheme.palette.primary.main
                      : darkTheme.palette.primary.main
                  }
                />
                <Typography variant="h6" fontWeight="bold">
                  {option.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.desc}
                </Typography>
              </Stack>
            </CardContent>
          </CustomCard>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {isMobile && (
        <Fab
          color="primary"
          onClick={() => setAddListingDialogOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
          }}
        >
          <Icon icon="mdi:plus" height={24} />
        </Fab>
      )}

      {!isMobile && (
        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={() => setAddListingDialogOpen(true)}
          startIcon={<Icon icon="mdi:plus" height={24} />}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            borderRadius: 2,
          }}
        >
          Add Listing
        </Button>
      )}

      {/* Add Listing Dialog */}
      <Dialog
        open={addListingDialogOpen}
        onClose={() => setAddListingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-listing-dialog-title"
      >
        <Box sx={{ textAlign: "center", pt: 4 }}>
          <Typography variant="h5" fontWeight="bold">
            Add a Listing
          </Typography>
        </Box>

        <DialogContent>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={3}
            textAlign="center"
          >
            What type of listing would you like to create?
          </Typography>
          {renderDialogOptions()}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", p: 3 }}>
          <Button
            startIcon={<Icon icon="mdi:close" />}
            variant="text"
            color="error"
            onClick={() => setAddListingDialogOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddListingDialog;

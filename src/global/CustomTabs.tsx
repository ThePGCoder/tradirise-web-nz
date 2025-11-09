"use client";

import Center from "@/global/Center";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MyListingsProps {}

const tabs = ["Personnel", "Positions", "Projects", "Businesses"];

const MyListings: React.FC<MyListingsProps> = () => {
  const [activeTab, setActiveTab] = useState("Personnel");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));

  const renderTabContent = () => {
    switch (activeTab) {
      case "Personnel":
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Personnel Listings
            </Typography>
            <Typography>Manage your personnel listings here.</Typography>
          </Box>
        );

      case "Positions":
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Position Listings
            </Typography>
            <Typography>Manage your position listings here.</Typography>
          </Box>
        );

      case "Projects":
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Project Listings
            </Typography>
            <Typography>Manage your project listings here.</Typography>
          </Box>
        );

      case "Businesses":
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Business Listings
            </Typography>
            <Typography>Manage your business listings here.</Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box margin="auto" width="100%" maxWidth={1100} px={2}>
      <Center py={2}>
        <Typography variant="h5">My Listings</Typography>
      </Center>

      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant={isMdUp ? "fullWidth" : "scrollable"}
        scrollButtons="auto"
        sx={{
          "& .MuiTabs-flexContainer": {
            justifyContent: isMdUp ? "space-between" : "center",
          },
        }}
      >
        {tabs.map((item) => (
          <Tab key={item} label={item} value={item} />
        ))}
      </Tabs>

      {renderTabContent()}
    </Box>
  );
};

export default MyListings;

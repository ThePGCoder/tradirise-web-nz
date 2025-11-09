"use client";

import { Box, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PlansTab from "./components/PlansTab";
import PaymentsTab from "./components/PaymentsTab";
import SettingsTab from "./components/SettingsTab";
import UsageTab from "./components/UsageTab";
import PageHeader from "@/components/PageHeader";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import PaymentSuccessModal from "./components/PaymentSuccessModal";
import PaymentCancelModal from "./components/PaymentCancelModal";
import InnerCustomCard from "@/components/InnerCustomCard";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AccountProps {}

const tabs = ["Plans", "Usage", "Payments", "Settings"];

const Account: React.FC<AccountProps> = () => {
  const [activeTab, setActiveTab] = useState("Plans");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const searchParams = useSearchParams();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));

  const renderTabContent = () => {
    switch (activeTab) {
      case "Plans":
        return <PlansTab />;

      case "Usage":
        return <UsageTab />;

      case "Payments":
        return <PaymentsTab />;

      case "Settings":
        return <SettingsTab />;

      default:
        return null;
    }
  };

  useEffect(() => {
    changeActiveRoute("Account");
  });

  useEffect(() => {
    // Check if redirected from successful payment
    if (searchParams.get("payment") === "success") {
      setSuccessModalOpen(true);
      // Switch to Settings tab to show the new subscription
      setActiveTab("Settings");
      // Clean up URL without adding to history
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }

    // Check if redirected from canceled payment
    if (searchParams.get("payment") === "canceled") {
      setCancelModalOpen(true);
      // Stay on Plans tab
      setActiveTab("Plans");
      // Clean up URL without adding to history
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
  };

  return (
    <Box margin="auto" width="100%" maxWidth={1400} px={2}>
      <PageHeader title="Account" />

      <InnerCustomCard>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant={isMdUp ? "fullWidth" : "scrollable"}
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: isMdUp ? "space-between" : "center",
            },
            userSelect: "none",
          }}
        >
          {tabs.map((item) => (
            <Tab
              key={item}
              label={item}
              value={item}
              sx={{ userSelect: "none" }}
            />
          ))}
        </Tabs>
      </InnerCustomCard>

      {renderTabContent()}

      <PaymentSuccessModal
        open={successModalOpen}
        onClose={handleCloseSuccessModal}
      />

      <PaymentCancelModal
        open={cancelModalOpen}
        onClose={handleCloseCancelModal}
      />
    </Box>
  );
};

export default Account;

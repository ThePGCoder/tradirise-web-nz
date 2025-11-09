"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Typography, Grid, Box } from "@mui/material";

import Flex from "@/global/Flex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import PersonnelCard from "./PersonnelCard";
import PersonnelFilters, { FilterState } from "./PersonnelFilters";

import { sharePersonnel } from "@/utils/shareUtils";
import { PersonnelWithProfile } from "../page";
import PageHeader from "@/components/PageHeader";
import AddButton from "@/app/(dashboard)/layout/components/AddButton";
import EmptyResult from "@/components/EmptyResult";

// Add dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);

interface PersonnelClientProps {
  initialPersonnel: PersonnelWithProfile[];
}

const PersonnelClient: React.FC<PersonnelClientProps> = ({
  initialPersonnel,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    trade: "",
    accreditations: [],
    availableFrom: "",
    sortBy: "newest",
    region: "",
    searchText: "",
  });

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const trades = [
      ...new Set(
        initialPersonnel.map((p) => p.primary_trade_role).filter(Boolean)
      ),
    ];

    // Accreditations are already pre-formatted strings like "Electrical: Registered Electrician"
    const accreditations = [
      ...new Set(initialPersonnel.flatMap((p) => p.accreditations || [])),
    ];

    const regions = [
      ...new Set(initialPersonnel.map((p) => p.region).filter(Boolean)),
    ];

    return {
      trades: trades.sort(),
      accreditations: accreditations.sort(),
      regions: regions.sort(),
    };
  }, [initialPersonnel]);

  // Filter and sort personnel based on current filters
  const filteredPersonnel = useMemo(() => {
    let filtered = [...initialPersonnel];

    // Text search
    if (filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (person) =>
          `${person.first_name || ""} ${person.last_name || ""}`
            .toLowerCase()
            .includes(searchTerm) ||
          (person.primary_trade_role || "")
            .toLowerCase()
            .includes(searchTerm) ||
          (person.bio || "").toLowerCase().includes(searchTerm) ||
          (person.skills || []).some((skill) =>
            skill.toLowerCase().includes(searchTerm)
          ) ||
          (person.region || "").toLowerCase().includes(searchTerm)
      );
    }

    // Trade filter
    if (filters.trade) {
      filtered = filtered.filter(
        (person) => person.primary_trade_role === filters.trade
      );
    }

    // Region filter
    if (filters.region) {
      filtered = filtered.filter((person) => person.region === filters.region);
    }

    // Accreditations filter
    if (filters.accreditations.length > 0) {
      filtered = filtered.filter(
        (person) =>
          person.accreditations &&
          filters.accreditations.some((filterAcc) =>
            person.accreditations.includes(filterAcc)
          )
      );
    }

    // Available from filter
    if (filters.availableFrom) {
      const filterDate = dayjs(filters.availableFrom);
      filtered = filtered.filter((person) =>
        dayjs(person.available_from).isSameOrBefore(filterDate, "day")
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
        );
        break;
      case "available_soon":
        filtered.sort(
          (a, b) =>
            dayjs(a.available_from).valueOf() -
            dayjs(b.available_from).valueOf()
        );
        break;
      case "name_az":
        filtered.sort((a, b) => {
          const nameA =
            `${a.first_name || ""} ${a.last_name || ""}`.trim() ||
            a.primary_trade_role;
          const nameB =
            `${b.first_name || ""} ${b.last_name || ""}`.trim() ||
            b.primary_trade_role;
          return nameA.localeCompare(nameB);
        });
        break;
    }

    return filtered;
  }, [initialPersonnel, filters]);

  useEffect(() => {
    changeActiveRoute("Personnel");
  }, [changeActiveRoute]);

  const handleViewDetails = (personnelId: string) => {
    router.push(`/listings/personnel/${personnelId}`);
  };

  const handleContact = (personnelId: string) => {
    console.log(`Contacting personnel ID: ${personnelId}`);
    const person = initialPersonnel.find((p) => p.id === personnelId);
    if (person?.contact_email) {
      window.location.href = `mailto:${person.contact_email}`;
    }
  };

  const handleSave = (personnelId: string) => {
    console.log(`Saving personnel ID: ${personnelId}`);
    // TODO: Implement save logic here
  };

  const handleShare = async (personnelId: string) => {
    const person = initialPersonnel.find((p) => p.id === personnelId);
    if (!person) return;

    try {
      const result = await sharePersonnel({
        id: person.id,
        first_name: person.first_name || "",
        last_name: person.last_name || "",
        primary_trade_role: person.primary_trade_role,
        region: person.region,
      });

      if (result.success) {
        if (result.method === "clipboard") {
          alert("Link copied to clipboard!");
          // TODO: Replace with proper toast/snackbar notification
        }
      } else if (result.cancelled) {
        console.log("Share cancelled by user");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Failed to share. Please try again.");
    }
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | string[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      trade: "",
      accreditations: [],
      availableFrom: "",
      sortBy: "newest",
      region: "",
      searchText: "",
    });
  };

  const hasActiveFilters = Boolean(
    filters.trade ||
      filters.accreditations.length > 0 ||
      filters.availableFrom ||
      filters.region ||
      filters.searchText.trim()
  );

  return (
    <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
      <PageHeader
        title="Find Personnel"
        description="Connect with skilled professionals and contractors for your projects"
      />

      {/* Filters Component */}
      <PersonnelFilters
        filters={filters}
        filterOptions={filterOptions}
        filtersExpanded={filtersExpanded}
        hasActiveFilters={hasActiveFilters}
        resultsCount={filteredPersonnel.length}
        onFilterChange={handleFilterChange}
        onToggleFilters={() => setFiltersExpanded(!filtersExpanded)}
        onClearFilters={clearAllFilters}
      />

      {/* Results Summary */}
      <Flex justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredPersonnel.length} of {initialPersonnel.length}{" "}
          personnel
        </Typography>
      </Flex>

      <Grid container columnSpacing={3} rowGap={3}>
        {filteredPersonnel.length > 0 ? (
          filteredPersonnel.map((person) => (
            <Grid
              key={person.id}
              size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
            >
              <PersonnelCard
                person={person}
                onViewDetails={handleViewDetails}
                onContact={handleContact}
                onSave={handleSave}
                onShare={handleShare}
              />
            </Grid>
          ))
        ) : (
          <Grid key="no-personnel" size={12}>
            <EmptyResult
              icon="entypo:v-card"
              description="Add personnel to see them here."
              title={
                hasActiveFilters
                  ? "No personnel match your filters"
                  : "No personnel available at the moment"
              }
              showButton={true}
              buttonText={
                hasActiveFilters ? "Clear All Filters" : "Add Personnel"
              }
              onButtonClick={() => {
                if (hasActiveFilters) {
                  clearAllFilters();
                } else {
                  router.push("/listings/personnel/add-personnel");
                }
              }}
              height="calc(100vh * 0.5)"
            />
          </Grid>
        )}
      </Grid>

      <AddButton />
    </Box>
  );
};

export default PersonnelClient;

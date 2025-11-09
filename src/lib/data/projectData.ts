export const groupedTradeOptions = [
  {
    group: "Core Building Trades",
    trades: [
      "Carpentry",
      "Joinery",
      "Construction",
      "Framing",
      "Masonry",
      "Bricklaying",
      "Concreting",
      "Drywall",
      "Plastering",
    ],
  },
  {
    group: "Finishing Trades",
    trades: ["Painting", "Decorating", "Tiling", "Flooring", "Wallpapering"],
  },
  {
    group: "Exterior & Roofing",
    trades: [
      "Roofing",
      "Cladding",
      "Waterproofing",
      "Glazing",
      "Fencing",
      "Decking",
    ],
  },
  {
    group: "Services & Mechanical",
    trades: ["Plumbing", "Electrical", "HVAC", "Gasfitting", "Drainlaying"],
  },
  {
    group: "Specialist Trades",
    trades: [
      "Welding",
      "Steel Fabrication",
      "Insulation",
      "Demolition",
      "Scaffolding",
      "Asbestos Removal",
    ],
  },
  {
    group: "Outdoor & Landscaping",
    trades: [
      "Landscaping",
      "Irrigation",
      "Paving",
      "Retaining Walls",
      "Garden Design",
    ],
  },
  {
    group: "Other",
    trades: ["Other"],
  },
];

export const budgetTypeOptions = [
  { value: "fixed", label: "Fixed Budget" },
  { value: "range", label: "Budget Range" },
  { value: "hourly", label: "Hourly Rate" },
  { value: "per_trade", label: "Per Trade/Task" },
  { value: "negotiable", label: "Negotiable" },
];

export const groupedProjectTypeOptions = [
  {
    group: "Residential - New Build",
    types: [
      "Residential New Build",
      "New House Construction",
      "Townhouse Development",
      "Unit Development",
      "Granny Flat",
      "Relocatable Home",
    ],
  },
  {
    group: "Residential - Renovations",
    types: [
      "Residential Renovation",
      "Full House Renovation",
      "Bathroom Renovation",
      "Kitchen Renovation",
      "Laundry Renovation",
      "Bedroom Addition",
      "Extension/Addition",
      "Second Story Addition",
      "Garage Conversion",
      "Basement Conversion",
    ],
  },
  {
    group: "Residential - Repairs & Maintenance",
    types: [
      "Repair & Maintenance",
      "Emergency Repair",
      "Weathertightness Repair",
      "Structural Repairs",
      "Minor Repairs",
      "Property Maintenance",
    ],
  },
  {
    group: "Commercial & Retail",
    types: [
      "Commercial Construction",
      "Office Building",
      "Retail Fit-out",
      "Shop Fit-out",
      "Restaurant Fit-out",
      "Office Renovation",
      "Commercial Maintenance",
      "Commercial Refurbishment",
    ],
  },
  {
    group: "Industrial & Specialist",
    types: [
      "Industrial Project",
      "Warehouse Construction",
      "Factory Fit-out",
      "Cold Store Construction",
      "Workshop Build",
    ],
  },
  {
    group: "Outdoor & Landscaping",
    types: [
      "Landscaping Project",
      "Garden Design & Build",
      "Outdoor Construction",
      "Deck Build",
      "Pergola/Gazebo",
      "Driveway",
      "Retaining Wall",
      "Fencing Project",
      "Pool Installation",
    ],
  },
  {
    group: "Heritage & Restoration",
    types: [
      "Heritage Restoration",
      "Character Home Renovation",
      "Historical Building Work",
      "Conservation Project",
    ],
  },
  {
    group: "Civic & Infrastructure",
    types: [
      "Educational Facility",
      "Healthcare Facility",
      "Community Building",
      "Sports Facility",
      "Infrastructure Work",
    ],
  },
  {
    group: "Other",
    types: ["Other"],
  },
];

export const groupedProjectDurationOptions = [
  {
    group: "Short Term (Up to 1 month)",
    durations: ["1 day", "2-3 days", "1 week", "2 weeks", "3 weeks", "4 weeks"],
  },
  {
    group: "Medium Term (1-3 months)",
    durations: ["6 weeks", "8 weeks", "10 weeks", "12 weeks"],
  },
  {
    group: "Long Term (3-6 months)",
    durations: ["16 weeks", "20 weeks", "24 weeks"],
  },
  {
    group: "Extended (6+ months)",
    durations: ["6-9 months", "9-12 months", "More than 12 months", "Ongoing"],
  },
];

export const groupedMaterialsProvidedOptions = [
  {
    group: "Full Materials Provision",
    options: [
      "All Materials Provided",
      "All Materials & Equipment Provided",
      "Turnkey - Everything Supplied",
    ],
  },
  {
    group: "Partial Materials Provision",
    options: [
      "Basic Materials Only",
      "Structural Materials Provided",
      "Finishing Materials Provided",
      "Specialty Items Provided",
      "Tools & Equipment Provided",
      "Safety Equipment Provided",
      "Mixed - Some Provided",
    ],
  },
  {
    group: "Client Responsibility",
    options: [
      "No Materials Provided",
      "Client Sources All Materials",
      "Client Sources Materials",
      "Labour Only Contract",
    ],
  },
  {
    group: "Contractor Responsibility",
    options: [
      "Contractor Sources All Materials",
      "Contractor Sources Materials",
      "Supply & Install Contract",
    ],
  },
  {
    group: "To Be Determined",
    options: [
      "Materials List Will Be Discussed",
      "To Be Negotiated",
      "Depends on Scope",
    ],
  },
];

export const groupedSiteAccessOptions = [
  {
    group: "Easy Access",
    options: [
      "Street Level Access",
      "Driveway Access",
      "Full Vehicle Access",
      "Flat Site",
      "Easy Access - No Restrictions",
    ],
  },
  {
    group: "Moderate Access",
    options: [
      "Slight Slope",
      "Shared Driveway",
      "Narrow Access",
      "Limited Parking",
      "Pedestrian Access Only",
    ],
  },
  {
    group: "Difficult Access",
    options: [
      "Steep Site",
      "No Vehicle Access",
      "Stairs Only",
      "Restricted Access Times",
      "Crane/Hoist Required",
      "Scaffolding Required",
    ],
  },
  {
    group: "Special Considerations",
    options: [
      "Occupied Building",
      "Heritage Area",
      "Gated Community",
      "Apartment/Unit",
      "High Rise",
      "Rural/Remote Location",
    ],
  },
];

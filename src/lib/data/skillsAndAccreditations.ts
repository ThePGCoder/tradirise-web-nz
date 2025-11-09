export const skillsByTrade: { [key: string]: string[] } = {
  Builder: ["Framing", "Set-out", "Renovation", "Concrete", "Finishing"],
  Electrician: [
    "Switchboard",
    "Prewire",
    "Rewiring",
    "Installation",
    "Testing",
  ],
  Plumber: [
    "Drainage",
    "Gas fitting",
    "Pipework",
    "Bathroom installation",
    "Maintenance",
  ],
  Carpenter: ["Cabinetry", "Joinery", "Decking", "Roofing", "Formwork"],
  Painter: [
    "Interior",
    "Exterior",
    "Spray painting",
    "Preparation",
    "Wallpapering",
  ],
  Roofer: [
    "Tile roofing",
    "Metal roofing",
    "Flat roofing",
    "Guttering",
    "Repairs",
  ],
  Landscaper: ["Design", "Paving", "Decking", "Planting", "Irrigation"],
  HVAC: ["Installation", "Maintenance", "Repair", "Ducting", "Climate control"],
};

// Hierarchical accreditations structure
export const accreditationsByCategory: { [key: string]: string[] } = {
  Electrical: [
    "Registered Electrician",
    "Electrical Inspector",
    "ESR License",
    "Apprentice Electrician",
  ],
  "Plumbing & Gas": [
    "Registered Plumber",
    "Gasfitter",
    "Drainlayer",
    "Plumbing Inspector",
  ],
  Building: ["LBP Carpentry", "LBP Site", "LBP Design", "Building Inspector"],
  "Health & Safety": ["Site Safe", "First Aid", "Height Safety", "Scaffold"],
  "Trade Certifications": [
    "NZQA Trade Certificate",
    "Red Seal",
    "Apprenticeship Certificate",
  ],
  Other: [
    "Driver License Class 2",
    "Driver License Class 4",
    "Forklift License",
    "Excavator Operator",
  ],
};

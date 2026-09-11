export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const INDIAN_UNION_TERRITORIES = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const OTHER_STATE_OPTION = "Others";

export const PROFILE_STATE_OPTIONS = [
  ...INDIAN_STATES,
  ...INDIAN_UNION_TERRITORIES,
  OTHER_STATE_OPTION,
] as const;

export const isOtherStateOption = (value?: string | null) => {
  const normalized = value?.trim().toLowerCase();

  return normalized === "other" || normalized === "others";
};

export const isKnownProfileStateOption = (value?: string | null) => {
  const normalized = value?.trim();

  if (!normalized) return false;

  return PROFILE_STATE_OPTIONS.some(option => option === normalized);
};

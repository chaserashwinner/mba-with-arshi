export const ELIGIBILITY_BUDGET_RANGES = [
  {
    label: "Under 5 Lakh",
    value: "UNDER_5",
  },
  {
    label: "5-10 Lakh",
    value: "FIVE_TO_TEN",
  },
  {
    label: "10-25 Lakh",
    value: "TEN_TO_TWENTY_FIVE",
  },
  {
    label: "25-50 Lakh",
    value: "TWENTY_FIVE_TO_FIFTY",
  },
  {
    label: "Above 50 Lakh",
    value: "ABOVE_FIFTY",
  },
] as const;

export type EligibilityBudgetRangeValue =
  (typeof ELIGIBILITY_BUDGET_RANGES)[number]["value"];

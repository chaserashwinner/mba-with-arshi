interface FilterOption {
  show: boolean;
  required: boolean;
}

interface Filter {
  category: FilterOption;
  quota: FilterOption;
  branch: FilterOption;
  year: FilterOption;
  round: FilterOption;
}

interface ToolSchema {
  _id: string; // Required _id property
  icon: string;
  name: string;
  video?: string;
  description?: string;
  data: any; // Adjust if you have a more specific structure for 'data'
  counselling?: string; // Assuming Counselling ID as a string
  exams?: string[]; // Array of Exam IDs
  course?: string; // Course ID
  discountedPrice?: number;
  originalPrice?: number;
  amount: number;
  price: number;
  predictor?: string; // Predictor ID
  averageRating?: number;
  ratingCount?: number;
  totalRatings?: number;

  filter: Filter;

  created: string;
  updated: string;
  archive: boolean;
}

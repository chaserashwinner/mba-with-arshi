interface PlanSchema {
  _id: string;
  icon: string; // No longer required
  name: string;
  description?: string;
  video?: string;
  course: string;
  features?: [],
  tool: string[];
  mentorship: string[];
  predictor: string[];
  playlist: string[];
  discountedPrice?: number;
  originalPrice?: number;
  amount: number;
  price: number;
  averageRating?: number;
  ratingCount?: number;
  totalRatings?: number;
  created: Date;
  updated: Date;
  archive: boolean;
}

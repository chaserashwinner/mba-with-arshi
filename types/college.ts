interface RatingTag {
  index: number;
  score: number;
}

interface Rating {
  index: number;
  course: string;
  rank: number;
  score: number;
  review: string;
  ratingTags: RatingTag[];
}

interface feesSchema {
  course: string;
  fees?: number;
  duration: string;
}

interface tempCourseSchema {
  course: string; // course id
  name: string;
  seats: string;
  totalFees: string;
  firstFees: string;
  highestPackage: string;
  averagePackage: string;
  duration: string;
  semesters: string;
}

interface PlacementDetail {
  year: string;
  highest: string;  // Could be number if you prefer
  average: string;  // Could be number if you prefer
  percentage: string; // Could be a number (e.g., 85)  if you prefer
  companies: string;  // Comma-separated list or an array of company names
}

interface SeatMatrix {
  course: string; // Course ID or name
  branch: string;
  seats: string;
}

interface CollegeSchema {
  _id: string;
  name: string;
  icon?: string;
  thumbnail?: string;
  video?: string;
  seo?: string;
  description?: string;
  affiliation?: string;
  established?: number;
  ownership?: string;
  location: {
    city: string;
    state: string;
    country: string;
    pin: number;
  };
  facilities?: number[];
  ratings: Rating[];
  agencyRatings: Rating[];
  userRatings: {
    user: string;
    name: string;
    course: string;
    score: number;
    review: string;
    ratingTags: RatingTag[];
  }[];
  tempCourseData: tempCourseSchema[];
  admission: string[];
  fees: feesSchema[];
  seatMatrix: SeatMatrix[];
  placement: PlacementDetail[];
  courses?: any[];
  exams?: any[];
  counsellings?: any[];
  courseData: any[];
  data?: object;
  created: string;
  updated: string;
  archive: boolean;
}

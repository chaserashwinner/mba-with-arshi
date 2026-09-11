interface formDataSchema {
  label: string;
  type: string;
  options?: string[];
  value?: string;
  required: boolean;
  accept: string;
}
interface MentorshipSchema {
  _id: string;
  icon: string;
  name: string;
  video?: string; // Optional property
  description?: string; // Optional property
  counselling: string;
  exams: string[];
  data: formDataSchema[];
  files: formDataSchema[];
  discountedPrice?: number;
  originalPrice?: number;
  amount: number;
  price: number;
  course: string;
  averageRating?: number;
  ratingCount?: number;
  totalRatings?: number;
  isConnectFlow?: boolean;
  ctaType?: "whatsapp" | "sms" | "call" | "link" | string | null;
  ctaValue?: string | number | null;
}

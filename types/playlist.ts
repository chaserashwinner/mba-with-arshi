interface PlaylistSchema {
  _id: string;
  icon: string;
  name: string;
  video?: string; // Optional property
  description?: string;
  data?: Object;
  media: MediaSchema[];
  counsellings: string[];
  exams: string[];
  course: string;
  paid: boolean;
  discountedPrice?: number;
  originalPrice?: number;
  amount: number;
  price: number;
  created: Date;
  updated: Date;
  archive: boolean;
}

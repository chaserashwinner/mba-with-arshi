interface MediaSchema {
  _id: string;
  index: number;
  thumbnail?: string;
  title: string;
  type: string;
  subtype?: string;
  body?: string;
  tags?: string[];
  seo?: string;
  parent?: string;
  draft?: boolean;
  data?: Record<string, any>;
  created?: string;
  updated?: string;
  archive?: boolean;

  // related to
  courses?: string[];
  exams?: string[];
  counsellings?: string[];
}

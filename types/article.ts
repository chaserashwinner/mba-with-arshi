export type ArticleCourseKey = "medical" | "engineering" | "mba";

export type BlogAuthorSchema = {
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
};

export type BlogArticleSchema = {
  _id: string;
  id: string;
  title: string;
  slug: string;
  course: string;
  courseSlug: ArticleCourseKey;
  body: string;
  excerpt: string;
  description: string;
  coverImage: string;
  thumbnail: string;
  author: BlogAuthorSchema;
  tags: string[];
  featured: boolean;
  published?: boolean;
  status?: string;
  deleted: boolean;
  publishedAt: string;
  created: string;
  updated: string;
  readingTime: number;
  views?: number;
  raw: any;
};

export type BlogPaginationSchema = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type BlogListParams = {
  course?: string;
  search?: string;
  tag?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
};

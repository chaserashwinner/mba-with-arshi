export interface PersonalInfo {
  name: string;
  brandName: string;
  tagline: string;
  eyebrow: string;
  headline: string;
  headlineItalic: string;
  bio: string;
  experienceYears: string;
  trustSubtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  avatarInitials: string[];
  heroImage: string;
  email: string;
  youtubeChannel: string;
  youtubeUrl: string;
}

export interface DecisionShortcut {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface CollegeOption {
  id: string;
  name: string;
  exam: string; // 'cat' | 'xat' | 'cmat' | 'mahcet' | 'nmat' | 'all'
  minPercentile: number;
  maxPercentile: number;
  budgetCategory: string; // 'low' | 'mid' | 'high' | 'all'
  feeText: string;
  avgPackage: string;
  city: string; // 'mumbai' | 'pune' | 'delhi' | 'bhopal' | 'kolkata' | 'goa'
  cityLabel: string;
  logoText: string;
  badge: string;
}

export interface VideoGuide {
  id: string;
  title: string;
  category: string; // 'colleges' | 'exam' | 'roi'
  categoryLabel: string;
  thumbnail: string;
  shortDesc: string;
  videoUrl: string;
  isFeatured?: boolean;
}

export interface RoadmapStep {
  step: string;
  tag: string;
  title: string;
  description: string;
  link: string;
}

export const PORTFOLIO_DATA: {
  personal: PersonalInfo;
  shortcuts: DecisionShortcut[];
  colleges: CollegeOption[];
  videos: VideoGuide[];
  roadmap: RoadmapStep[];
} = {
  personal: {
    name: "Arshi Khan",
    brandName: "MBA With Arshi",
    tagline: "College Guidance & Counselling",
    eyebrow: "MBA admissions, explained clearly",
    headline: "Choose your MBA",
    headlineItalic: "with facts, not hype.",
    bio: "Shortlist colleges by exam, percentile, budget and city. Get honest reviews and clear next steps from Arshi Khan.",
    experienceYears: "10+ years",
    trustSubtitle: "of student counselling experience",
    primaryCtaText: "Find my colleges",
    primaryCtaLink: "#find-colleges",
    secondaryCtaText: "Watch on YouTube",
    secondaryCtaLink: "https://www.youtube.com/@mbawitharshikhan",
    avatarInitials: ["AK", "CAT", "MBA"],
    heroImage: "https://media.licdn.com/dms/image/v2/D4D16AQGWsE57ouTjMA/profile-displaybackgroundimage-shrink_200_800/B4DZxcNKK0I8AU-/0/1771073486008?e=2147483647&t=scTwSIlQ8lb7O6dEcoM8zj3dP5zqB8n-vQEm8IWBad4&v=beta",
    email: "hello@mbawitharshi.in",
    youtubeChannel: "MBA WITH ARSHI",
    youtubeUrl: "https://www.youtube.com/@mbawitharshikhan",
  },
  shortcuts: [
    {
      id: "01",
      number: "01",
      title: "College Finder",
      subtitle: "Match options to your profile",
      link: "#find-colleges",
    },
    {
      id: "02",
      number: "02",
      title: "Honest Reviews",
      subtitle: "Fees, placement and reality",
      link: "#videos",
    },
    {
      id: "03",
      number: "03",
      title: "Exam Guidance",
      subtitle: "CAT, XAT, CMAT, MAH CET",
      link: "#guides",
    },
    {
      id: "04",
      number: "04",
      title: "1:1 Counselling",
      subtitle: "A clear plan for admission",
      link: "#counselling",
    },
  ],
  colleges: [
    {
      id: "col-1",
      name: "JBIMS Mumbai (Jamnalal Bajaj)",
      exam: "mahcet",
      minPercentile: 98,
      maxPercentile: 99,
      budgetCategory: "low",
      feeText: "₹7.0 Lakhs Total Fee",
      avgPackage: "₹27.6 LPA Avg",
      city: "mumbai",
      cityLabel: "Mumbai",
      logoText: "JBIMS",
      badge: "TOP ROI",
    },
    {
      id: "col-2",
      name: "SPJIMR Mumbai",
      exam: "cat",
      minPercentile: 85,
      maxPercentile: 99,
      budgetCategory: "high",
      feeText: "₹22.5 Lakhs Total Fee",
      avgPackage: "₹33.0 LPA Avg",
      city: "mumbai",
      cityLabel: "Mumbai",
      logoText: "SPJ",
      badge: "TIER 1",
    },
    {
      id: "col-3",
      name: "GIM Goa (Goa Institute of Mgt)",
      exam: "xat",
      minPercentile: 80,
      maxPercentile: 95,
      budgetCategory: "mid",
      feeText: "₹18.5 Lakhs Total Fee",
      avgPackage: "₹14.8 LPA Avg",
      city: "goa",
      cityLabel: "Goa",
      logoText: "GIM",
      badge: "POPULAR CHOICE",
    },
    {
      id: "col-4",
      name: "K J Somaiya Institute of Management",
      exam: "cmat",
      minPercentile: 80,
      maxPercentile: 92,
      budgetCategory: "mid",
      feeText: "₹19.8 Lakhs Total Fee",
      avgPackage: "₹12.3 LPA Avg",
      city: "mumbai",
      cityLabel: "Mumbai",
      logoText: "KJS",
      badge: "METRO LOCATION",
    },
    {
      id: "col-5",
      name: "PUMBA Pune University",
      exam: "mahcet",
      minPercentile: 95,
      maxPercentile: 99,
      budgetCategory: "low",
      feeText: "₹1.5 Lakhs Total Fee",
      avgPackage: "₹8.8 LPA Avg",
      city: "pune",
      cityLabel: "Pune",
      logoText: "PUM",
      badge: "HIGH ROI",
    },
    {
      id: "col-6",
      name: "FORE School of Management",
      exam: "cat",
      minPercentile: 75,
      maxPercentile: 90,
      budgetCategory: "mid",
      feeText: "₹16.9 Lakhs Total Fee",
      avgPackage: "₹14.0 LPA Avg",
      city: "delhi",
      cityLabel: "Delhi NCR",
      logoText: "FORE",
      badge: "DELHI HUB",
    },
    {
      id: "col-7",
      name: "LNCT Bhopal MBA",
      exam: "cmat",
      minPercentile: 60,
      maxPercentile: 85,
      budgetCategory: "low",
      feeText: "₹3.5 Lakhs Total Fee",
      avgPackage: "₹5.5 LPA Avg",
      city: "bhopal",
      cityLabel: "Bhopal",
      logoText: "LNCT",
      badge: "REGIONAL HUB",
    },
    {
      id: "col-8",
      name: "IMI Kolkata",
      exam: "cat",
      minPercentile: 65,
      maxPercentile: 85,
      budgetCategory: "low",
      feeText: "₹10.5 Lakhs Total Fee",
      avgPackage: "₹10.2 LPA Avg",
      city: "kolkata",
      cityLabel: "Kolkata",
      logoText: "IMIK",
      badge: "EAST INDIA",
    },
  ],
  videos: [
    {
      id: "v1",
      title: "How to shortlist the right B-school for your profile",
      category: "colleges",
      categoryLabel: "COLLEGE SHORTLISTING",
      thumbnail: "https://i.ytimg.com/vi/bywekjVGPOw/hqdefault.jpg",
      shortDesc: "A practical filter for fees, placements, location and fit.",
      videoUrl: "https://www.youtube.com/watch?v=bywekjVGPOw",
      isFeatured: true,
    },
    {
      id: "v2",
      title: "Top MBA colleges under ₹10 lakh",
      category: "roi",
      categoryLabel: "FEES & ROI",
      thumbnail: "https://i.ytimg.com/vi/EdM_kYj7hM8/hqdefault.jpg",
      shortDesc: "Lower-fee options and what to verify before applying.",
      videoUrl: "https://www.youtube.com/watch?v=EdM_kYj7hM8",
      isFeatured: true,
    },
    {
      id: "v3",
      title: "LNCT Bhopal MBA review",
      category: "colleges",
      categoryLabel: "COLLEGE REVIEW",
      thumbnail: "https://i.ytimg.com/vi/MoOjFwU5Tqs/hqdefault.jpg",
      shortDesc: "Admission, profile fit and the questions students should ask.",
      videoUrl: "https://www.youtube.com/watch?v=MoOjFwU5Tqs",
      isFeatured: true,
    },
    {
      id: "v4",
      title: "College options for 60–80 percentile",
      category: "exam",
      categoryLabel: "CMAT & EXAMS",
      thumbnail: "https://i.ytimg.com/vi/SUPsROCtLhw/hqdefault.jpg",
      shortDesc: "Build a realistic application list after your score.",
      videoUrl: "https://www.youtube.com/watch?v=SUPsROCtLhw",
      isFeatured: true,
    },
  ],
  roadmap: [
    {
      step: "01",
      tag: "PLAN",
      title: "Choose your exams",
      description: "CAT, XAT, CMAT, NMAT or MAH CET? Select entrance exams aligned with your target colleges.",
      link: "#videos",
    },
    {
      step: "02",
      tag: "SHORTLIST",
      title: "Build your college list",
      description: "Balance dream, target and safe choices based on percentile, budget, and location preference.",
      link: "#find-colleges",
    },
    {
      step: "03",
      tag: "DECIDE",
      title: "Compare final offers",
      description: "Check actual fees, ROI, campus placement records, and role outcomes before paying acceptance fees.",
      link: "#counselling",
    },
  ],
};

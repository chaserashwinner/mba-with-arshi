import { resolveCRMUrl } from "@/utils/crmUrl";

export type CourseToolType = "internal" | "external";
export type CourseToolIcon =
  | "academic"
  | "chart"
  | "choice"
  | "document"
  | "globe"
  | "mentor"
  | "preference"
  | "spark";
export type CourseToolTone = "amber" | "blue" | "emerald";

export interface CourseTool {
  title: string;
  type: CourseToolType;
  url: string;
  description: string;
  cta: string;
  icon: CourseToolIcon;
  tone: CourseToolTone;
  badge?: string;
  requiresAuth?: boolean;
  medicalOnly?: boolean;
  hiddenForMedical?: boolean;
  requiresCollegePreferenceAvailability?: boolean;
  testerOnly?: boolean;
  titleKey?: string;
  descriptionKey?: string;
  ctaKey?: string;
  badgeKey?: string;
}

export const COURSE_TOOLS: Record<string, CourseTool[]> = {
  MBA: [
    {
      title: "College Predictor",
      titleKey: "tools.default.collegePredictor.title",
      type: "internal",
      url: "/predictors",
      descriptionKey: "tools.default.collegePredictor.description",
      description:
        "Get a course-aware shortlist and counselling chances before rounds begin.",
      ctaKey: "tools.default.collegePredictor.cta",
      cta: "Open predictor",
      icon: "chart",
      tone: "amber",
      badgeKey: "tools.default.collegePredictor.badge",
      badge: "Popular",
    },
    {
      title: "Mentorships",
      titleKey: "tools.default.mentorships.title",
      type: "internal",
      url: "/mentorships",
      descriptionKey: "tools.default.mentorships.description",
      description:
        "Get expert guidance for strategy, shortlist review and round-wise decision support.",
      ctaKey: "tools.default.mentorships.cta",
      cta: "Talk to mentor",
      icon: "mentor",
      tone: "amber",
      badgeKey: "tools.default.mentorships.badge",
      badge: "Expert help",
    },
    {
      title: "Coupon Corner",
      type: "external",
      get url() {
        return resolveCRMUrl("/coupon-corner?utm_source=studentkhabri_domain");
      },
      description:
        "Access management-domain offers, discounts and partner coupons from one place.",
      cta: "Open coupon corner",
      icon: "spark",
      tone: "blue",
      badge: "Offers",
    },
  ],

  DEFAULT: [
    // Reserved for future dedicated predictor campaigns
    // {
    //   title: "Rank Predictor",
    //   titleKey: "rank_predictor",
    //   type: "internal",
    //   url: "/rank-predictor",
    //   descriptionKey: "rankPredictor.description",
    //   description: "Predict your expected rank based on your score",
    //   ctaKey: "predict_rank",
    //   cta: "Predict Rank",
    //   icon: "chart",
    //   tone: "blue",
    //   badgeKey: "rankPredictor.badge",
    //   badge: "Login required",
    //   requiresAuth: true,
    //   medicalOnly: true,
    // },
    {
      title: "Budget Predictor",
      titleKey: "budgetPredictor.title",
      type: "internal",
      url: "/budget-predictor",
      descriptionKey: "budgetPredictor.description",
      description:
        "Estimate the expected MBBS admission budget based on your rank, category and counselling preferences.",
      ctaKey: "budgetPredictor.cta",
      cta: "Predict Budget",
      icon: "chart",
      tone: "blue",
      badgeKey: "budgetPredictor.badge",
      badge: "Login required",
      requiresAuth: true,
      medicalOnly: true,
    },
    {
      title: "College Predictor",
      titleKey: "tools.default.collegePredictor.title",
      type: "internal",
      url: "/predictors",
      descriptionKey: "tools.default.collegePredictor.description",
      description:
        "Get a course-aware shortlist and counselling chances before rounds begin.",
      ctaKey: "tools.default.collegePredictor.cta",
      cta: "Open predictor",
      icon: "chart",
      tone: "amber",
      badgeKey: "tools.default.collegePredictor.badge",
      badge: "Popular",
    },
    {
      title: "Merit List Comparison",
      titleKey: "tools.default.meritListComparison.title",
      type: "internal",
      url: "/merit-list-comparison",
      descriptionKey: "tools.default.meritListComparison.description",
      description:
        "Compare merit lists and find colleges based on your rank, category and counselling data.",
      ctaKey: "tools.default.meritListComparison.cta",
      cta: "Compare Merit Lists",
      icon: "preference",
      tone: "emerald",
      badgeKey: "tools.default.meritListComparison.badge",
      badge: "NEW",
    },
    {
      title: "College Finder",
      titleKey: "tools.default.collegeFinder.title",
      type: "internal",
      url: "/college-finder",
      descriptionKey: "tools.default.collegeFinder.description",
      description:
        "Browse MBBS and BDS colleges by state, ownership, quota, fees, seats and cutoff context before shortlisting.",
      ctaKey: "tools.default.collegeFinder.cta",
      cta: "Explore colleges",
      icon: "academic",
      tone: "emerald",
      badgeKey: "tools.default.collegeFinder.badge",
      badge: "MBBS + BDS",
      medicalOnly: true,
    },
    {
      title: "NEET Admission Eligibility Checker",
      titleKey: "tools.default.neetEligibility.title",
      type: "internal",
      url: "/neet-admission-eligibility-checker",
      descriptionKey: "tools.default.neetEligibility.description",
      description:
        "Check admission eligibility based on NEET rank, category, budget, and domicile state.",
      ctaKey: "tools.default.neetEligibility.cta",
      cta: "Check Eligibility",
      icon: "choice",
      tone: "emerald",
      badgeKey: "tools.default.neetEligibility.badge",
      badge: "FREE",
      requiresAuth: true,
      medicalOnly: true,
    },
    {
      title: "Medicine Abroad",
      titleKey: "tools.default.medicineAbroad.title",
      type: "internal",
      url: "/medicine-abroad",
      descriptionKey: "tools.default.medicineAbroad.description",
      description:
        "Explore MBBS abroad options, countries, universities, fees, eligibility and admission guidance.",
      ctaKey: "tools.default.medicineAbroad.cta",
      cta: "Explore abroad options",
      icon: "globe",
      tone: "emerald",
      badgeKey: "tools.default.medicineAbroad.badge",
      badge: "MBBS Abroad",
      medicalOnly: true,
    },
    {
      title: "Choice Filling Tool",
      titleKey: "tools.default.choiceFilling.title",
      type: "internal",
      url: "/choice-tools",
      descriptionKey: "tools.default.choiceFilling.description",
      description:
        "Convert your shortlist into a smart preference order with dream, safe and backup choices.",
      ctaKey: "tools.default.choiceFilling.cta",
      cta: "Build choice list",
      icon: "choice",
      tone: "emerald",
      badgeKey: "tools.default.choiceFilling.badge",
      badge: "Smart order",
    },
    {
      title: "Medical College Predictor",
      type: "internal",
      url: "/medical/tester-predictor",
      description:
        "Predict eligible medical colleges using your NEET AIR, State and Category from our testing dataset.",
      cta: "Try Predictor",
      icon: "spark",
      tone: "emerald",
      badge: "TESTER",
      requiresAuth: true,
      testerOnly: true,
      medicalOnly: true,
    },
    {
      title: "College Preference List",
      titleKey: "tools.default.collegePreference.title",
      type: "internal",
      url: "/college-preference-list",
      descriptionKey: "tools.default.collegePreference.description",
      description:
        "Build and manage your college preference order based on rank, category, and state filters.",
      ctaKey: "tools.default.collegePreference.cta",
      cta: "Build preference list",
      icon: "preference",
      tone: "emerald",
      badgeKey: "tools.default.collegePreference.badge",
      badge: "Preference builder",
      requiresCollegePreferenceAvailability: true,
      hiddenForMedical: true,
    },
    {
      title: "Important PDFs",
      titleKey: "tools.default.importantPdfs.title",
      type: "internal",
      url: "/important-pdfs",
      descriptionKey: "tools.default.importantPdfs.description",
      description:
        "Browse essential notices, handbooks and counselling documents without digging around.",
      ctaKey: "tools.default.importantPdfs.cta",
      cta: "View PDFs",
      icon: "document",
      tone: "blue",
      badgeKey: "tools.default.importantPdfs.badge",
      badge: "Must read",
      hiddenForMedical: true,
    },
    {
      title: "Mentorships",
      titleKey: "tools.default.mentorships.title",
      type: "internal",
      url: "/mentorships",
      descriptionKey: "tools.default.mentorships.description",
      description:
        "Get expert guidance for strategy, shortlist review and round-wise decision support.",
      ctaKey: "tools.default.mentorships.cta",
      cta: "Talk to mentor",
      icon: "mentor",
      tone: "amber",
      badgeKey: "tools.default.mentorships.badge",
      badge: "Expert help",
    },
  ],
};

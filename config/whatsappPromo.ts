import { resolveCourseName } from "@/utils/courseMeta";
import { resolveCourseThemeKey, type CourseThemeKey } from "@/utils/courseThemes";

export const WHATSAPP_PROMO_CONFIG = {
  // Master feature flag for WhatsApp Community campaign
  enabled: true,
  // Configurable allowlist for target courses allowed to display the promo banner
  allowedCourses: ["engineering"] as CourseThemeKey[],
  link: "https://whatsapp.com/channel/0029VbD9J90FnSzE0FQGys2H",
  title: "Join our WhatsApp Community",
  bannerText: "Get coupon codes of up to 100% discount on tools.",
  ctaText: "Join WhatsApp Community",
  eventName: "whatsapp_community_banner_clicked",
};

/**
 * Resolves the active course theme key ('engineering' | 'medical' | 'mba')
 */
export const resolveCourseKey = (
  courseValue?: string | string[] | null,
  courses: any[] = [],
): CourseThemeKey => {
  const normalized = Array.isArray(courseValue) ? courseValue[0] : courseValue;

  if (normalized === "694b96e41b36acf35b509dd0") return "engineering";
  if (normalized === "694b96e41b36acf35b509dd1") return "medical";
  if (normalized === "694bb1556f4160ddaba25931") return "mba";

  const courseName = resolveCourseName(normalized || undefined, courses);
  if (courseName) {
    return resolveCourseThemeKey(courseName);
  }

  return "engineering";
};

/**
 * Checks if the active course is included in the allowedCourses configuration
 */
export const isCourseAllowedForPromo = (
  courseValue?: string | string[] | null,
  courses: any[] = [],
): boolean => {
  if (!WHATSAPP_PROMO_CONFIG.enabled) return false;

  const courseKey = resolveCourseKey(courseValue, courses);
  return WHATSAPP_PROMO_CONFIG.allowedCourses.includes(courseKey);
};

/**
 * Alias for backward compatibility
 */
export const isEngineeringCourseForPromo = isCourseAllowedForPromo;

import { resolveCourseThemeKey } from "@/utils/courseThemes";

export const SUPPORT_PHONES = {
  engineering: "9111500222",
  mba: "9111400222",
  medical: "9039366522",
} as const;

export const DEFAULT_SUPPORT_PHONE = SUPPORT_PHONES.medical;

/**
 * Resolves the course-specific support phone number.
 * If the course is unsupported or not specified, gracefully falls back to Medical (9039366522).
 */
export const getSupportPhoneForCourse = (
  courseValue?: string | string[] | null,
  coursesList: any[] = []
): string => {
  if (!courseValue) {
    return DEFAULT_SUPPORT_PHONE;
  }

  // Normalize courseValue
  const normalized = (Array.isArray(courseValue) ? courseValue[0] : courseValue).trim().toLowerCase();

  // Try to find the course in the courses list to match by slug/id/name
  const matchedCourse = coursesList.find(
    (c: any) =>
      c._id?.toLowerCase() === normalized ||
      c.slug?.toLowerCase() === normalized ||
      c.name?.toLowerCase() === normalized
  );

  const courseName = matchedCourse?.name || normalized;
  const themeKey = resolveCourseThemeKey(courseName);

  if (themeKey === "mba") {
    return SUPPORT_PHONES.mba;
  } else if (themeKey === "medical") {
    return SUPPORT_PHONES.medical;
  } else if (themeKey === "engineering") {
    // resolveCourseThemeKey defaults to "engineering".
    // We check if the courseName is explicitly engineering-related,
    // otherwise fallback to medical as per requirement 8.
    const nameLower = courseName.toLowerCase();
    if (
      nameLower.includes("engineering") ||
      nameLower.includes("jee") ||
      nameLower.includes("btech") ||
      nameLower === "694b96e41b36acf35b509dd0"
    ) {
      return SUPPORT_PHONES.engineering;
    }
  }

  return DEFAULT_SUPPORT_PHONE;
};

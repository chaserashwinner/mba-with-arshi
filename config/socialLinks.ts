import type { CourseThemeKey } from "@/utils/courseThemes";
import { resolveCourseThemeKey } from "@/utils/courseThemes";
import { resolveCourseName } from "@/utils/courseMeta";

type CourseMetaItem = {
  _id: string;
  name: string;
  slug?: string;
};

type CourseSocialLinks = {
  instagram: string;
  youtube: string;
};

export const COURSE_SOCIAL_LINKS: Record<CourseThemeKey, CourseSocialLinks> = {
  engineering: {
    instagram: "https://instagram.com/engineering.studentkhabri",
    youtube: "https://youtube.com/@studentkhabri",
  },
  medical: {
    instagram: "https://instagram.com/neet.studentkhabri",
    youtube: "https://youtube.com/@neet.studentkhabri",
  },
  mba: {
    instagram: "https://www.instagram.com/mbawitharshikhan",
    youtube: "https://youtube.com/@mbawitharshikhan",
  },
};

export const resolveCourseSocialLinks = (
  courseValue?: string | string[],
  courses: CourseMetaItem[] = [],
) => {
  const courseName = resolveCourseName(courseValue, courses);
  const courseKey = courseName
    ? resolveCourseThemeKey(courseName)
    : "engineering";

  return COURSE_SOCIAL_LINKS[courseKey] || COURSE_SOCIAL_LINKS.engineering;
};

import type { CourseThemeKey } from "@/utils/courseThemes";
import {
  createPublicImageAsset,
  type OptimizedImageAsset,
} from "@/utils/optimizedImages";

type MentorConfig = {
  name: string;
  role: string;
  experience: number;
  image: string;
  optimizedImage: OptimizedImageAsset;
  tag: string;
};

const createMentorImage = (basePath: string) =>
  createPublicImageAsset({
    basePath,
    extension: "png",
    width: 1280,
    height: 720,
  });

export const mentors: Record<CourseThemeKey, MentorConfig> = {
  medical: {
    name: "Avinash & Rothar Sir",
    role: "Medical Counsellor",
    experience: 8,
    image: "/mentors/avinash.png",
    optimizedImage: createMentorImage("/mentors/avinash"),
    tag: "Medical",
  },
  engineering: {
    name: "Rothar Sir",
    role: "Engineering Counsellor",
    experience: 8,
    image: "/mentors/rothar.png",
    optimizedImage: createMentorImage("/mentors/rothar"),
    tag: "ENGINEERING",
  },
  mba: {
    name: "Arshi Ma'am",
    role: "MBA Counsellor",
    experience: 7,
    image: "/mentors/arshi.png",
    optimizedImage: createMentorImage("/mentors/arshi"),
    tag: "MBA",
  },
};

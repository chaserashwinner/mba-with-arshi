import avatarImage from "@/assets/images/avatar.jpeg";
import whatsappIcon from "@/assets/images/whatsapp.png";
import collegePreferenceIcon from "@/assets/icons/college_preference.svg";
import mentorshipIcon from "@/assets/icons/mentorship.png";
import pdfIcon from "@/assets/icons/pdf.png";
import planIcon from "@/assets/icons/plan.png";
import predictorIcon from "@/assets/icons/predictor.png";
import toolIcon from "@/assets/icons/tool.png";
import { STUDENT_KHABRI_CDN_URL } from "@/src/utils/assetUrl";

export const STATIC_CDN_ASSETS = {
  avatar: {
    cdnPath: "assets/common/common/avatar-1780572128523-d6b5d1ab6788.jpeg",
    cdnUrl: `${STUDENT_KHABRI_CDN_URL}/assets/common/common/avatar-1780572128523-d6b5d1ab6788.jpeg`,
    fallback: avatarImage,
  },
  whatsapp: {
    cdnPath: "assets/common/common/whatsapp-1780572160597-b6fb8a5453cf.png",
    cdnUrl: `${STUDENT_KHABRI_CDN_URL}/assets/common/common/whatsapp-1780572160597-b6fb8a5453cf.png`,
    fallback: whatsappIcon,
  },
  collegePreference: {
    cdnPath:
      "assets/common/common/college_preference-1780572477090-5ae7ed746f9a.png",
    cdnUrl: `${STUDENT_KHABRI_CDN_URL}/assets/common/common/college_preference-1780572477090-5ae7ed746f9a.png`,
    fallback: collegePreferenceIcon,
  },
  mentorship: {
    cdnPath: "assets/common/common/mentorship-1780572224691-8d83c483187f.png",
    cdnUrl: `${STUDENT_KHABRI_CDN_URL}/assets/common/common/mentorship-1780572224691-8d83c483187f.png`,
    fallback: mentorshipIcon,
  },
  pdf: {
    cdnPath: "assets/common/common/pdf-1780572264970-8111b574d31d.png",
    cdnUrl: `${STUDENT_KHABRI_CDN_URL}/assets/common/common/pdf-1780572264970-8111b574d31d.png`,
    fallback: pdfIcon,
  },
  plan: {
    cdnPath: "assets/common/common/plan-1780572300885-8e96683601c7.png",
    cdnUrl: `${STUDENT_KHABRI_CDN_URL}/assets/common/common/plan-1780572300885-8e96683601c7.png`,
    fallback: planIcon,
  },
  predictor: {
    cdnPath: "assets/common/common/predictor-1780572322390-c3b8542b38da.png",
    cdnUrl: `${STUDENT_KHABRI_CDN_URL}/assets/common/common/predictor-1780572322390-c3b8542b38da.png`,
    fallback: predictorIcon,
  },
  tool: {
    cdnPath: "assets/common/common/tool-1780572345925-c2ae892d346a.png",
    cdnUrl: `${STUDENT_KHABRI_CDN_URL}/assets/common/common/tool-1780572345925-c2ae892d346a.png`,
    fallback: toolIcon,
  },
} as const;

export const STATIC_CDN_ASSET_FALLBACKS = Object.values(
  STATIC_CDN_ASSETS,
).reduce<Record<string, string>>((fallbacks, asset) => {
  fallbacks[asset.cdnPath.toLowerCase()] = asset.fallback;
  return fallbacks;
}, {});

const getCdnHost = () => {
  try {
    return new URL(STUDENT_KHABRI_CDN_URL).host.toLowerCase();
  } catch {
    return "";
  }
};

const getStaticAssetPath = (source?: unknown) => {
  const value = typeof source === "string" ? source.trim() : "";
  if (!value) return "";

  try {
    const url = new URL(value);
    const cdnHost = getCdnHost();

    if (!cdnHost || url.host.toLowerCase() !== cdnHost) return "";

    return decodeURI(url.pathname).replace(/^\/+/, "").toLowerCase();
  } catch {
    return "";
  }
};

export const getStaticAssetFallbackByUrl = (source?: unknown) => {
  const staticAssetPath = getStaticAssetPath(source);

  return staticAssetPath
    ? STATIC_CDN_ASSET_FALLBACKS[staticAssetPath]
    : undefined;
};

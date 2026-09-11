export const LANGUAGE_STORAGE_KEY = "studentkhabri.lang";

export const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    label: "EN",
  },
  {
    code: "hi",
    label: "हिन्दी",
  },
] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: AppLanguage = "en";
export const FALLBACK_LANGUAGE: AppLanguage = "en";

export const isSupportedLanguage = (
  value: unknown,
): value is AppLanguage =>
  typeof value === "string" &&
  SUPPORTED_LANGUAGES.some(language => language.code === value);

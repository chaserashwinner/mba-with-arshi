export type AssetType =
  | "image"
  | "video"
  | "icon"
  | "banner"
  | "avatar"
  | "thumbnail";

export type AssetUrlOptions = {
  type?: AssetType;
  fallback?: string | null;
  cdnBaseUrl?: string;
  uploadBaseUrl?: string;
  legacyBaseUrls?: Array<string | null | undefined>;
  preferCdn?: boolean;
};

export const STUDENT_KHABRI_CDN_URL =
  "https://d32ueyd2jde08b.cloudfront.net";

export const ASSET_FALLBACKS: Record<AssetType, string> = {
  image: "/placeholder/college_thumbnail.jpg",
  video: "/placeholder/video.svg",
  icon: "/icon.png",
  banner: "/placeholder/college_thumbnail.jpg",
  avatar: "/placeholder/avatars/1.jpg",
  thumbnail: "/placeholder/college_thumbnail.jpg",
};

const LOCAL_ASSET_PREFIXES = [
  "/_nuxt/",
  "/assets/",
  "/csvs/",
  "/home/",
  "/icons/",
  "/mentors/",
  "/placeholder/",
  "/favicon",
  "/icon",
  "/app_icon",
  "/manifest",
  "/data.csv",
];

const LEGACY_HOST_PARTS = [
  "digitaloceanspaces.com",
  "studentkhabri.com",
  "localhost",
  "127.0.0.1",
];

const unsafeAssetPattern = /^(javascript|vbscript):/i;
const invalidAssetValuePattern = /(^|[/=_-])(undefined|null)([/._-]|$)/i;

const toCleanString = (value: unknown) => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return `${value}`.trim();

  return "";
};

const normalizeBaseUrl = (baseUrl?: string | null) =>
  toCleanString(baseUrl).replace(/\/+$/, "");

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const joinAssetUrl = (baseUrl: string, assetPath: string) => {
  const base = normalizeBaseUrl(baseUrl);
  const key = trimSlashes(assetPath);

  if (!base) return key;
  if (!key) return base;

  return encodeURI(`${base}/${key}`);
};

const getUrlHost = (value: string) => {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return "";
  }
};

const getUrlOrigin = (value: string) => {
  try {
    return new URL(value).origin.toLowerCase();
  } catch {
    return "";
  }
};

export const isCdnAssetUrl = (
  value?: string | null,
  cdnBaseUrl = STUDENT_KHABRI_CDN_URL,
) => {
  const url = toCleanString(value);
  if (!/^https?:\/\//i.test(url)) return false;

  const urlHost = getUrlHost(url);
  const cdnHost = getUrlHost(cdnBaseUrl);

  return Boolean(urlHost && cdnHost && urlHost === cdnHost);
};

const isLocalPublicAsset = (value: string) => {
  if (!value.startsWith("/")) return false;

  return LOCAL_ASSET_PREFIXES.some(prefix =>
    value.toLowerCase().startsWith(prefix.toLowerCase()),
  );
};

const isSpecialBrowserUrl = (value: string) =>
  /^(data|blob):/i.test(value) || value.startsWith("#");

const hasInvalidAssetValue = (value: string) =>
  !value || unsafeAssetPattern.test(value) || invalidAssetValuePattern.test(value);

const stripUploadPrefix = (value: string) => {
  const clean = trimSlashes(value);
  const uploadIndex = clean.toLowerCase().lastIndexOf("uploads/");

  if (uploadIndex >= 0) {
    return clean.slice(uploadIndex + "uploads/".length);
  }

  return clean;
};

const stripServerUploadPrefix = (value: string) =>
  stripUploadPrefix(value).replace(/^asset\/server\/upload\/?/i, "");

const isLegacyUploadAssetKey = (value: string) =>
  /^sk-server_/i.test(stripServerUploadPrefix(value));

const resolveLegacyUploadAssetUrl = (
  value: string,
  uploadBaseUrl?: string | null,
) => {
  const uploadBase = normalizeBaseUrl(uploadBaseUrl);

  if (!uploadBase || !isLegacyUploadAssetKey(value)) return "";

  return joinAssetUrl(uploadBase, stripServerUploadPrefix(value));
};

const extractEmbeddedCdnUrl = (
  value: string,
  cdnBaseUrl = STUDENT_KHABRI_CDN_URL,
) => {
  const cdnHost = getUrlHost(cdnBaseUrl);
  if (!cdnHost) return "";

  const normalizedValue = value.replace(/\\/g, "/");
  const hostIndex = normalizedValue.toLowerCase().indexOf(cdnHost.toLowerCase());
  if (hostIndex < 0) return "";

  const path = normalizedValue
    .slice(hostIndex + cdnHost.length)
    .replace(/^[/:]+/, "/");

  if (!path || path === "/") return "";

  const embeddedPath = path.startsWith("/") ? path : `/${path}`;

  return encodeURI(`${normalizeBaseUrl(cdnBaseUrl)}${embeddedPath}`);
};

const extractLegacyAssetKey = (url: URL) => {
  const pathname = decodeURI(url.pathname || "");
  return stripServerUploadPrefix(pathname);
};

const matchesConfiguredLegacyBase = (
  source: string,
  legacyBaseUrls: AssetUrlOptions["legacyBaseUrls"] = [],
) => {
  const sourceOrigin = getUrlOrigin(source);

  return legacyBaseUrls.some(base => {
    const normalized = normalizeBaseUrl(base);

    if (!normalized) return false;

    return (
      source.toLowerCase().startsWith(normalized.toLowerCase()) ||
      sourceOrigin === getUrlOrigin(normalized)
    );
  });
};

export const isLegacyAssetUrl = (
  value?: string | null,
  options: AssetUrlOptions = {},
) => {
  const urlValue = toCleanString(value);
  if (!/^https?:\/\//i.test(urlValue) || isCdnAssetUrl(urlValue, options.cdnBaseUrl)) {
    return false;
  }

  try {
    const url = new URL(urlValue);
    const host = url.host.toLowerCase();
    const pathname = url.pathname.toLowerCase();

    return (
      pathname.includes("/uploads/") ||
      pathname.includes("sk-server") ||
      LEGACY_HOST_PARTS.some(part => host.includes(part)) ||
      matchesConfiguredLegacyBase(urlValue, options.legacyBaseUrls)
    );
  } catch {
    return false;
  }
};

export const getAssetFallback = (
  type: AssetType = "image",
  fallback?: string | null,
) => {
  const fallbackValue = toCleanString(fallback);

  if (fallbackValue && !hasInvalidAssetValue(fallbackValue)) return fallbackValue;

  return ASSET_FALLBACKS[type] || ASSET_FALLBACKS.image;
};

export const resolveAssetUrl = (
  source?: unknown,
  options: AssetUrlOptions = {},
): string => {
  const {
    type = "image",
    cdnBaseUrl = STUDENT_KHABRI_CDN_URL,
    preferCdn = true,
  } = options;
  const fallback = getAssetFallback(type, options.fallback);
  const value = toCleanString(source);

  if (hasInvalidAssetValue(value)) return fallback;
  if (isSpecialBrowserUrl(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (isCdnAssetUrl(value, cdnBaseUrl)) return encodeURI(value);

  const embeddedCdnUrl = extractEmbeddedCdnUrl(value, cdnBaseUrl);
  if (embeddedCdnUrl) return embeddedCdnUrl;

  if (/^https?:\/\//i.test(value)) {
    if (preferCdn && isLegacyAssetUrl(value, options)) {
      try {
        const assetKey = extractLegacyAssetKey(new URL(value));
        const legacyUploadUrl = resolveLegacyUploadAssetUrl(
          assetKey,
          options.uploadBaseUrl,
        );

        return legacyUploadUrl || joinAssetUrl(cdnBaseUrl, assetKey);
      } catch {
        return encodeURI(value);
      }
    }

    return encodeURI(value);
  }

  if (value.startsWith("/")) {
    if (isLocalPublicAsset(value)) return encodeURI(value);

    const assetKey = stripServerUploadPrefix(value);
    const legacyUploadUrl = resolveLegacyUploadAssetUrl(
      assetKey,
      options.uploadBaseUrl,
    );

    return legacyUploadUrl || joinAssetUrl(cdnBaseUrl, assetKey);
  }

  const assetKey = stripServerUploadPrefix(value);
  const legacyUploadUrl = resolveLegacyUploadAssetUrl(
    assetKey,
    options.uploadBaseUrl,
  );

  return legacyUploadUrl || joinAssetUrl(cdnBaseUrl, assetKey);
};

export const resolveAssetFallbackUrl = (
  fallback?: string | null,
  options: AssetUrlOptions = {},
) =>
  resolveAssetUrl(getAssetFallback(options.type, fallback), {
    ...options,
    fallback: ASSET_FALLBACKS[options.type || "image"],
    preferCdn: false,
  });

export const resolveAssetBackgroundImage = (
  source?: unknown,
  options: AssetUrlOptions = {},
) => {
  const resolved = resolveAssetUrl(source, options);
  const escaped = resolved.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  return `url('${escaped}')`;
};

export const appendAssetRetryParam = (source: string, attempt: number) => {
  if (!source || isSpecialBrowserUrl(source)) return source;
  if (/[?&](X-Amz-Signature|Signature|Expires)=/i.test(source)) return source;

  try {
    const url = new URL(source, "https://studentkhabri.invalid");
    url.searchParams.set("sk_asset_retry", `${attempt}`);

    if (source.startsWith("/")) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    const separator = source.includes("?") ? "&" : "?";

    return `${source}${separator}sk_asset_retry=${attempt}`;
  }
};

export const createAssetResolver =
  (options: AssetUrlOptions = {}) =>
  (source?: unknown, overrides: AssetUrlOptions = {}) =>
    resolveAssetUrl(source, {
      ...options,
      ...overrides,
      legacyBaseUrls: [
        ...(options.legacyBaseUrls || []),
        ...(overrides.legacyBaseUrls || []),
      ],
    });

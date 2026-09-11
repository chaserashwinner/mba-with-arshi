const WEB_PROTOCOL_PATTERN = /^https?:\/\//i;
const UNSAFE_PROTOCOL_PATTERN = /^(javascript|data|vbscript):/i;

export const normalizeExternalUrl = (value = "") => {
  const trimmedValue = String(value || "").trim();

  if (!trimmedValue || UNSAFE_PROTOCOL_PATTERN.test(trimmedValue)) return "";

  const urlValue = trimmedValue.startsWith("//")
    ? `https:${trimmedValue}`
    : WEB_PROTOCOL_PATTERN.test(trimmedValue)
      ? trimmedValue
      : `https://${trimmedValue}`;

  try {
    const url = new URL(urlValue);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname) return "";

    const isBareHost =
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      !/[/?#]/.test(urlValue.replace(WEB_PROTOCOL_PATTERN, "").replace(/^\/\//, ""));

    return isBareHost ? `${url.protocol}//${url.host}` : url.href;
  } catch (error) {
    return "";
  }
};

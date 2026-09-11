import { computed, ref, toValue, watch, type MaybeRefOrGetter } from "vue";
import { useRuntimeConfig } from "#imports";
import {
  appendAssetRetryParam,
  resolveAssetBackgroundImage,
  getAssetFallback,
  resolveAssetFallbackUrl,
  resolveAssetUrl,
  type AssetType,
  type AssetUrlOptions,
} from "@/src/utils/assetUrl";
import { getStaticAssetFallbackByUrl } from "@/src/config/cdnAssets";

export type UseAssetOptions = AssetUrlOptions & {
  maxRetries?: number;
};

const getRuntimeAssetOptions = (): AssetUrlOptions => {
  const runtimeConfig = useRuntimeConfig();
  const publicConfig = runtimeConfig.public || {};
  const spaces = `${publicConfig.spaces || ""}`;
  const newSpaces = `${publicConfig.newspaces || ""}`;

  return {
    uploadBaseUrl: spaces || newSpaces,
    legacyBaseUrls: [spaces, newSpaces].filter(Boolean),
  };
};

export const useAsset = (
  source: MaybeRefOrGetter<unknown>,
  options: MaybeRefOrGetter<UseAssetOptions> = {},
) => {
  const retryAttempt = ref(0);
  const loaded = ref(false);
  const failed = ref(false);
  const runtimeAssetOptions = getRuntimeAssetOptions();

  const normalizedOptions = computed<UseAssetOptions>(() => ({
    ...runtimeAssetOptions,
    ...toValue(options),
  }));

  const originalSrc = computed(() =>
    resolveAssetUrl(toValue(source), normalizedOptions.value),
  );

  const fallbackSrc = computed(() =>
    resolveAssetFallbackUrl(
      normalizedOptions.value.fallback ||
        getStaticAssetFallbackByUrl(originalSrc.value),
      normalizedOptions.value,
    ),
  );

  const type = computed<AssetType>(() => normalizedOptions.value.type || "image");
  const maxRetries = computed(() => normalizedOptions.value.maxRetries ?? 1);
  const missing = computed(
    () => originalSrc.value === getAssetFallback(type.value, normalizedOptions.value.fallback),
  );

  const src = computed(() => {
    if (failed.value) return fallbackSrc.value;
    if (retryAttempt.value > 0) {
      return appendAssetRetryParam(originalSrc.value, retryAttempt.value);
    }

    return originalSrc.value;
  });

  const markLoaded = () => {
    loaded.value = true;
    failed.value = false;
  };

  const markError = () => {
    loaded.value = false;

    if (retryAttempt.value < maxRetries.value) {
      retryAttempt.value += 1;
      return;
    }

    failed.value = true;
  };

  watch(
    () => [originalSrc.value, fallbackSrc.value],
    () => {
      retryAttempt.value = 0;
      loaded.value = false;
      failed.value = false;
    },
  );

  return {
    src,
    originalSrc,
    fallbackSrc,
    type,
    loaded,
    failed,
    missing,
    retryAttempt,
    markLoaded,
    markError,
  };
};

export const useAssetResolver = (baseOptions: AssetUrlOptions = {}) => {
  const runtimeAssetOptions = getRuntimeAssetOptions();
  const runtimeOptions = computed<AssetUrlOptions>(() => ({
    ...runtimeAssetOptions,
    ...baseOptions,
    legacyBaseUrls: [
      ...(runtimeAssetOptions.legacyBaseUrls || []),
      ...(baseOptions.legacyBaseUrls || []),
    ],
  }));

  const resolveAsset = (source?: unknown, options: AssetUrlOptions = {}) =>
    resolveAssetUrl(source, {
      ...runtimeOptions.value,
      ...options,
      legacyBaseUrls: [
        ...(runtimeOptions.value.legacyBaseUrls || []),
        ...(options.legacyBaseUrls || []),
      ],
    });

  const resolveAssetBackground = (
    source?: unknown,
    options: AssetUrlOptions = {},
  ) =>
    resolveAssetBackgroundImage(source, {
      ...runtimeOptions.value,
      ...options,
      legacyBaseUrls: [
        ...(runtimeOptions.value.legacyBaseUrls || []),
        ...(options.legacyBaseUrls || []),
      ],
    });

  return {
    resolveAsset,
    resolveAssetBackground,
  };
};

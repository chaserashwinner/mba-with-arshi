<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";
import { useHead, useState } from "#imports";
import { useAsset } from "@/src/hooks/useAsset";
import type { AssetType } from "@/src/utils/assetUrl";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    src?: string | null;
    fallback?: string | null;
    type?: AssetType;
    alt?: string;
    className?: string;
    priority?: boolean;
    preload?: boolean;
    controls?: boolean;
  }>(),
  {
    src: "",
    fallback: undefined,
    type: "image",
    alt: "",
    className: "",
    priority: false,
    preload: false,
    controls: true,
  },
);
const emit = defineEmits<{
  load: [];
  error: [];
}>();

const attrs = useAttrs();
const loadedAssetCache = useState<Record<string, boolean>>(
  "sk-loaded-asset-cache",
  () => ({}),
);
const failedAssetCache = useState<Record<string, boolean>>(
  "sk-failed-asset-cache",
  () => ({}),
);

const asset = useAsset(
  () => props.src,
  () => ({
    type: props.type,
    fallback: props.fallback,
  }),
);

const mediaRef = ref<HTMLImageElement | HTMLVideoElement | null>(null);
const isVideo = computed(() => props.type === "video");
const shouldPreload = computed(() => props.priority || props.preload);
const loading = computed(() =>
  props.priority ? "eager" : `${attrs.loading || "lazy"}`,
);
const fetchPriority = computed(() =>
  props.priority ? "high" : `${attrs.fetchpriority || attrs.fetchPriority || "auto"}`,
);
const rootClass = computed(() => [attrs.class, props.className]);
const rootStyle = computed(() => attrs.style);
const mediaClass = computed(() => [
  "sk-asset-renderer__media",
  props.type === "icon" ? "sk-asset-renderer__media--contain" : "",
  props.type === "video" ? "sk-asset-renderer__media--video" : "",
]);
const passthroughAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    loading: _loading,
    fetchpriority: _fetchpriority,
    fetchPriority: _fetchPriority,
    ...rest
  } = attrs;

  return rest;
});
const isLoaded = computed(
  () => asset.loaded.value || Boolean(loadedAssetCache.value[asset.src.value]),
);
const showSkeleton = computed(() => !isLoaded.value && !asset.failed.value);
const ariaLabel = computed(() => props.alt || undefined);

const markLoaded = () => {
  asset.markLoaded();
  loadedAssetCache.value[asset.src.value] = true;
  emit("load");
};

const markError = () => {
  failedAssetCache.value[asset.src.value] = true;
  asset.markError();
  emit("error");
};

watch(
  () => asset.src.value,
  async nextSrc => {
    if (loadedAssetCache.value[nextSrc]) {
      asset.markLoaded();
      return;
    }

    if (failedAssetCache.value[nextSrc]) {
      asset.markError();
    }
  },
  { immediate: true },
);

useHead(() =>
  shouldPreload.value && asset.src.value && !isVideo.value
    ? {
        link: [
          {
            rel: "preload",
            as: "image",
            href: asset.src.value,
          },
        ],
      }
    : {},
);
</script>

<template>
  <span
    class="sk-asset-renderer"
    :class="rootClass"
    :style="rootStyle"
    :aria-label="ariaLabel"
  >
    <span
      v-if="showSkeleton"
      class="sk-asset-renderer__skeleton"
      aria-hidden="true"
    ></span>

    <video
      v-if="isVideo"
      :key="asset.src.value"
      ref="mediaRef"
      v-bind="passthroughAttrs"
      :src="asset.src.value"
      :class="mediaClass"
      :controls="controls"
      preload="metadata"
      playsinline
      @loadeddata="markLoaded"
      @canplay="markLoaded"
      @error="markError"
    />

    <img
      v-else
      ref="mediaRef"
      v-bind="passthroughAttrs"
      :src="asset.src.value"
      :alt="alt"
      :class="[mediaClass, { 'sk-asset-renderer__media--loading': !isLoaded }]"
      :loading="loading"
      :fetchpriority="fetchPriority"
      decoding="async"
      @load="markLoaded"
      @error="markError"
    />
  </span>
</template>

<style scoped>
.sk-asset-renderer {
  position: relative;
  display: block;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.12);
}

.sk-asset-renderer__media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: inherit;
  opacity: 1;
  transition: opacity 180ms ease;
}

.sk-asset-renderer__media--loading {
  opacity: 0 !important;
  transition: none !important;
}

.sk-asset-renderer__media--contain {
  object-fit: contain;
}

.sk-asset-renderer__media--video {
  background: #000;
}

.sk-asset-renderer__skeleton {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
  background:
    linear-gradient(
      110deg,
      rgba(255, 255, 255, 0.12) 8%,
      rgba(255, 255, 255, 0.46) 18%,
      rgba(255, 255, 255, 0.12) 33%
    ),
    linear-gradient(135deg, rgba(15, 23, 42, 0.06), rgba(15, 23, 42, 0.12)),
    linear-gradient(var(--color-surface-soft, #f1f5f9), var(--color-surface-soft, #f1f5f9));
  background-size: 200% 100%, 100% 100%, 100% 100%;
  animation: sk-asset-renderer-shimmer 1.25s linear infinite;
}

@keyframes sk-asset-renderer-shimmer {
  to {
    background-position: -200% 0, 0 0;
  }
}
</style>

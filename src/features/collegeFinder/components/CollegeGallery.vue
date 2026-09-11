<script setup>
const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  alt: {
    type: String,
    default: "",
  },
});

const activeImage = ref("");
const galleryImages = computed(() =>
  (props.images || [])
    .map((image) => {
      if (typeof image === "string") {
        return {
          url: image,
          alt: props.alt,
          title: "",
          caption: "",
        };
      }

      return {
        url: image?.url || image?.src || image?.image || image?.path || "",
        alt: image?.alt || props.alt,
        title: image?.title || "",
        caption: image?.caption || "",
      };
    })
    .filter((image) => image.url),
);
const activeItem = computed(
  () =>
    galleryImages.value.find((image) => image.url === activeImage.value) ||
    galleryImages.value[0] ||
    null,
);

watch(
  galleryImages,
  (images) => {
    const urls = (images || []).map((img) => img.url).filter(Boolean);
    if (!activeImage.value || !urls.includes(activeImage.value)) {
      activeImage.value = urls[0] || "";
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-3">
    <div
      v-if="activeItem"
      class="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <ProtectedImage
        :src="activeItem.url"
        :alt="activeItem.alt || alt"
        type="image"
        class="aspect-video w-full object-cover"
      />
    </div>
    <div
      v-else
      class="grid aspect-video place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 text-center"
    >
      <p class="text-sm font-bold text-[var(--color-text-muted)]">
        No gallery images uploaded yet.
      </p>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="image in galleryImages"
        :key="image.url"
        type="button"
        class="overflow-hidden rounded-xl border transition"
        :class="activeImage === image.url ? 'border-[var(--color-primary)] ring-2 ring-[rgba(var(--color-primary-rgb),0.2)]' : 'border-[var(--color-border)]'"
        @click="activeImage = image.url"
      >
        <ProtectedImage
          :src="image.url"
          :alt="image.alt || alt"
          type="thumbnail"
          class="aspect-video w-full object-cover"
        />
      </button>
    </div>
  </div>
</template>

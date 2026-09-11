<script setup>
import {
  BookmarkIcon,
  MapPinIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/vue/24/solid";
import CollegeBadge from "./CollegeBadge.vue";

const props = defineProps({
  college: {
    type: Object,
    required: true,
  },
});

defineEmits(["share"]);
const { tr } = useAppI18n();
const ratingLabel = computed(() => (props.college.rating ? `${props.college.rating} / 5` : "N/A"));
</script>

<template>
  <section class="college-hero">
    <AssetRenderer
      :src="college.banner"
      :alt="college.name"
      type="banner"
      fallback="/placeholder/college_thumbnail.jpg"
      class="college-hero__image"
      fetchpriority="high"
      priority
    />

    <div class="college-hero__content">
      <div>
        <div class="flex flex-wrap gap-2">
          <CollegeBadge
            v-for="course in college.courseTypes"
            :key="course"
            :label="course"
            tone="primary"
          />
          <CollegeBadge :label="college.ownership" tone="success" />
        </div>
        <p class="college-hero__eyebrow text-sm font-black uppercase tracking-[0.18em] text-white/70">
          {{ college.shortName }}
        </p>
        <h1 class="college-hero__title max-w-4xl font-black">
          {{ college.name }}
        </h1>
        <div class="college-hero__meta flex flex-wrap items-center gap-4 text-sm font-bold text-white/80">
          <span class="inline-flex items-center gap-2">
            <MapPinIcon class="h-5 w-5 text-[var(--color-primary)]" />
            {{ college.city }}, {{ college.state }}
          </span>
          <span class="inline-flex items-center gap-2">
            <StarIcon class="h-5 w-5 text-amber-300" />
            {{ ratingLabel }}
          </span>
        </div>
      </div>

      <div class="college-hero__actions flex gap-2">
        <button type="button" class="sk-button-secondary border-white/15 bg-white/10 text-white" @click="$emit('share')">
          <ShareIcon class="h-4 w-4" />
          {{ tr("share", "Share") }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.college-hero :deep(.college-badge-success) {
  color: #86efac !important;
  background: rgba(34, 197, 94, 0.16) !important;
  border-color: rgba(34, 197, 94, 0.24) !important;
}

.college-hero :deep(.college-badge-warning) {
  color: #fcd34d !important;
  background: rgba(245, 158, 11, 0.18) !important;
  border-color: rgba(245, 158, 11, 0.28) !important;
}

.college-hero :deep(.college-badge-neutral) {
  color: #cbd5e1 !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
}

.college-hero {
  position: relative;
  display: grid;
  height: clamp(180px, 52vw, 220px);
  overflow: hidden;
  border-radius: 1.75rem;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.78)),
    var(--color-surface-soft);
}

.college-hero::before,
.college-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.college-hero::before {
  background: rgba(15, 23, 42, 0.48);
}

.college-hero::after {
  background:
    radial-gradient(circle at 12% 0%, rgba(34, 197, 94, 0.18), transparent 34%),
    linear-gradient(to top, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54) 52%, rgba(15, 23, 42, 0.18));
}

.college-hero__image {
  position: absolute;
  inset: 0;
  z-index: 0;
  height: 100%;
  width: 100%;
}

.college-hero__image :deep(.sk-asset-renderer__media) {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.college-hero__content {
  position: relative;
  z-index: 2;
  display: grid;
  height: 100%;
  align-content: end;
  gap: 0.75rem;
  padding: 1rem;
  color: #fff;
}

.college-hero__eyebrow {
  margin-top: 0.75rem;
}

.college-hero__title {
  display: -webkit-box;
  margin-top: 0.35rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: clamp(1.35rem, 5.6vw, 1.85rem);
  line-height: 1.08;
}

.college-hero__meta {
  margin-top: 0.5rem;
}

.college-hero__actions {
  flex-wrap: wrap;
}

@media (min-width: 640px) {
  .college-hero {
    height: clamp(220px, 30vw, 320px);
  }

  .college-hero__content {
    gap: 1rem;
    padding: 1.5rem;
  }

  .college-hero__title {
    -webkit-line-clamp: 2;
    font-size: clamp(2rem, 4vw, 2.75rem);
  }

  .college-hero__meta {
    margin-top: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .college-hero {
    height: clamp(260px, 32vw, 420px);
  }

  .college-hero__content {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 1.5rem;
    padding: 2rem;
  }

  .college-hero__title {
    font-size: clamp(2rem, 3vw, 3rem);
  }
}
</style>

<script setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

defineProps({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  actionLabel: {
    type: String,
    default: "",
  },
});

defineEmits(["action"]);
const { tr } = useAppI18n();
</script>

<template>
  <div class="surface-panel flex min-h-[22rem] flex-col items-center justify-center px-5 py-12 text-center">
    <div class="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-primary)]">
      <MagnifyingGlassIcon class="h-8 w-8" />
    </div>
    <h2 class="mt-5 text-2xl font-black text-[var(--color-text)]">
      {{ title || tr("collegeFinder.empty.title", "No colleges found") }}
    </h2>
    <p class="mt-2 max-w-lg text-sm leading-7 text-[var(--color-text-muted)]">
      {{
        description ||
        tr(
          "collegeFinder.empty.description",
          "Try changing the course, state, fee, or counselling filters.",
        )
      }}
    </p>
    <button
      v-if="actionLabel"
      type="button"
      class="sk-button-primary mt-6"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

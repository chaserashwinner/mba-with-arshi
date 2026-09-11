<script setup>
defineProps({
  cutoff: {
    type: Object,
    required: true,
  },
});

const { tr } = useAppI18n();
</script>

<template>
  <article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-black text-[var(--color-text)]">
          {{ cutoff.course }} - {{ cutoff.category_label || cutoff.category }}
        </h3>
        <p class="mt-1 text-sm font-bold text-[var(--color-text-muted)]">
          {{ cutoff.counselling }} · {{ cutoff.round }} · {{ cutoff.year }}
        </p>
      </div>
      <div class="rounded-2xl px-4 py-3 text-center text-white" style="background-image: var(--gradient-primary);">
        <p class="text-[11px] font-black uppercase tracking-[0.14em] text-white/75">
          {{ tr("collegeFinder.detail.closingRank", "Closing rank") }}
        </p>
        <p class="text-xl font-black">
          {{ cutoff.closingRank.toLocaleString("en-IN") }}
        </p>
      </div>
    </div>
  </article>
</template>

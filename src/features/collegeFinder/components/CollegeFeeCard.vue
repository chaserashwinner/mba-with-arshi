<script setup>
import { formatCurrency, formatFeeRange } from "../utils/formatters";

defineProps({
  fees: {
    type: Object,
    required: true,
  },
});

const { tr } = useAppI18n();
</script>

<template>
  <section class="surface-panel rounded-2xl p-5 sm:p-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-[var(--color-text)]">
          {{ tr("collegeFinder.detail.feeStructure", "Fee structure") }}
        </h2>
        <p class="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
          {{ fees.summary }}
        </p>
      </div>
      <div class="rounded-2xl px-4 py-3 text-white" style="background-image: var(--gradient-primary);">
        <p class="text-[11px] font-black uppercase tracking-[0.14em] text-white/75">
          {{ tr("collegeFinder.detail.annualRange", "Annual range") }}
        </p>
        <p class="text-lg font-black">
          {{ formatFeeRange(fees) }}
        </p>
      </div>
    </div>

    <div class="mt-5 divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)]">
      <div
        v-for="item in fees.items"
        :key="item.label"
        class="flex items-center justify-between gap-4 bg-[var(--color-surface-soft)] px-4 py-3 text-sm"
      >
        <span class="font-bold text-[var(--color-text-muted)]">{{ item.label }}</span>
        <span class="font-black text-[var(--color-text)]">
          {{ formatCurrency(item.amount) }}
          <span class="text-xs text-[var(--color-text-soft)]">/{{ item.period }}</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  tabs: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["update:modelValue"]);
const { tr } = useAppI18n();
</script>

<template>
  <div class="w-full overflow-x-auto">
    <div class="inline-flex min-w-full gap-2 rounded-2xl border p-1" style="background: var(--color-surface); border-color: var(--color-border);">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="min-h-[40px] flex-1 whitespace-nowrap rounded-xl px-3 text-sm font-black transition"
        :class="modelValue === tab.value ? 'sk-chip-active' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'"
        @click="$emit('update:modelValue', tab.value)"
      >
        {{ tr(tab.labelKey, tab.fallback) }}
      </button>
    </div>
  </div>
</template>

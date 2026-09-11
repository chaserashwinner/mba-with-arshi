<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: "neutral",
  },
});

const toneClass = computed(() => {
  const tones = {
    primary: "college-badge-primary",
    success: "college-badge-success",
    warning: "college-badge-warning",
    danger: "college-badge-danger",
    neutral: "college-badge-neutral",
  };

  return tones[props.tone] || tones.neutral;
});
</script>

<template>
  <span class="college-badge" :class="toneClass">
    {{ label }}
  </span>
</template>

<style scoped>
.college-badge {
  display: inline-flex;
  min-height: 1.75rem;
  align-items: center;
  gap: 0.35rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.college-badge-primary {
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
  border-color: rgba(var(--color-primary-rgb), 0.18);
}

.college-badge-success {
  color: var(--color-success);
  background: var(--color-success-soft);
  border-color: var(--color-success-border);
}

.college-badge-warning {
  color: var(--color-warning);
  background: var(--color-warning-soft);
  border-color: var(--color-warning-border);
}

.college-badge-danger {
  color: var(--color-danger);
  background: var(--color-danger-soft);
  border-color: var(--color-danger-border);
}

.college-badge-neutral {
  color: var(--color-text-muted);
  background: var(--color-surface);
}
</style>

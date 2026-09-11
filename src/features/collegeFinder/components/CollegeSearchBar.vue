<script setup>
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "clear"]);
const { tr } = useAppI18n();

const clearSearch = () => {
  emit("update:modelValue", "");
  emit("clear");
};
</script>

<template>
  <label class="relative block w-full">
    <span class="sr-only">
      {{ tr("collegeFinder.filters.searchLabel", "Search colleges") }}
    </span>
    <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-soft)]" />
    <input
      :value="modelValue"
      type="search"
      class="input-app min-h-[52px] rounded-2xl pl-12 pr-12 text-base"
      :placeholder="placeholder || tr('collegeFinder.filters.searchPlaceholder', 'Search by college name, city, state, quota...')"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="props.modelValue"
      type="button"
      class="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]"
      :aria-label="tr('collegeFinder.filters.clearSearch', 'Clear search')"
      @click="clearSearch"
    >
      <XMarkIcon class="h-4 w-4" />
    </button>
  </label>
</template>

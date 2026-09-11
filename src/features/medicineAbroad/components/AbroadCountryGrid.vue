<script setup>
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { getCountryRoute } from "../utils/formatters";

defineProps({
  countries: {
    type: Array,
    default: () => [],
  },
});

const { tr } = useAppI18n();
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <NuxtLink
      v-for="country in countries"
      :key="country.slug || country.name"
      :to="getCountryRoute(country.name)"
      class="sk-card sk-hover-lift rounded-2xl p-4"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-lg font-black text-[var(--color-text)]">
            {{ country.name }}
          </p>
          <p class="mt-1 text-sm font-bold text-[var(--color-text-soft)]">
            {{ tr("medicineAbroad.countryGrid.count", "{count} colleges", { count: country.count || 0 }) }}
          </p>
        </div>
        <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white" style="background-image: var(--gradient-primary);">
          <MapPinIcon class="h-5 w-5" />
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

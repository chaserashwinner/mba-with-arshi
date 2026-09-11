<script setup>
defineProps({
  count: {
    type: Number,
    default: 6,
  },
});
</script>

<template>
  <div class="grid gap-4">
    <article
      v-for="item in count"
      :key="item"
      class="surface-card overflow-hidden rounded-2xl"
    >
      <div class="sk-skeleton h-44 w-full border-0"></div>
      <div class="space-y-4 p-5">
        <div class="sk-skeleton h-5 w-3/4 rounded-full"></div>
        <div class="sk-skeleton h-4 w-1/2 rounded-full"></div>
        <div class="grid grid-cols-3 gap-3">
          <div class="sk-skeleton h-16 rounded-2xl"></div>
          <div class="sk-skeleton h-16 rounded-2xl"></div>
          <div class="sk-skeleton h-16 rounded-2xl"></div>
        </div>
        <div class="sk-skeleton h-11 rounded-2xl"></div>
      </div>
    </article>
  </div>
</template>

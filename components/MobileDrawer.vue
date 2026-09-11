<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);

function closeMenu() {
  emit('close');
}
</script>

<template>
  <div 
    class="mobile-drawer" 
    :class="{ open: isOpen }"
    :aria-hidden="!isOpen"
  >
    <button class="drawer-close" aria-label="Close menu" @click="closeMenu">×</button>
    <a href="#find-colleges" @click="closeMenu">Find Colleges</a>
    <a href="#videos" @click="closeMenu">Videos</a>
    <a href="#guides" @click="closeMenu">Exam Guides</a>
    <a href="#about" @click="closeMenu">About Arshi</a>
    <a href="#counselling" @click="closeMenu">Get Counselling</a>
  </div>
</template>

<style scoped>
.mobile-drawer {
  inset: 0;
  padding: 90px 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  position: fixed;
  z-index: 50;
  color: white;
  background: var(--violet-dark);
  transform: translateX(100%);
  transition: transform 0.25s ease;
}

.mobile-drawer.open {
  transform: translateX(0);
}

.mobile-drawer a {
  font-size: 1.5rem;
  font-weight: 750;
  color: white;
  transition: color 0.2s ease;
}

.mobile-drawer a:hover {
  color: var(--acid);
}

.drawer-close {
  position: absolute;
  right: 24px;
  top: 22px;
  border: 0;
  color: white;
  background: none;
  font-size: 2rem;
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { PORTFOLIO_DATA } from '~/data/portfolio';

const shortcuts = PORTFOLIO_DATA.shortcuts;
</script>

<template>
  <section class="decision-strip" aria-label="Portfolio Navigation Shortcuts">
    <a 
      v-for="item in shortcuts" 
      :key="item.id" 
      :href="item.link"
    >
      <span>{{ item.number }}</span>
      <div class="shortcut-text">
        <strong>{{ item.title }}</strong>
        <small>{{ item.subtitle }}</small>
      </div>
      <b aria-hidden="true">↗</b>
    </a>
  </section>
</template>

<style scoped>
.decision-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--ink);
  color: white;
}

.decision-strip a {
  min-height: 150px;
  padding: 29px clamp(20px, 3vw, 46px);
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 15px;
  align-items: center;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  transition: background 0.2s ease;
}

.decision-strip a:last-child {
  border-right: 0;
}

.decision-strip a:hover {
  background: var(--violet);
}

.decision-strip span {
  grid-row: 1 / 3;
  color: var(--acid);
  font-size: 0.68rem;
  font-weight: 850;
}

.shortcut-text {
  display: flex;
  flex-direction: column;
}

.decision-strip strong {
  font-size: 0.98rem;
  color: white;
  letter-spacing: -0.01em;
}

.decision-strip small {
  color: #aaa5b5;
  font-size: 0.72rem;
  margin-top: 2px;
}

.decision-strip a:hover small {
  color: white;
}

.decision-strip b {
  grid-row: 1 / 3;
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.decision-strip a:hover b {
  transform: translate(2px, -2px);
}

@media (max-width: 1120px) {
  .decision-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .decision-strip {
    grid-template-columns: 1fr;
  }
  .decision-strip a {
    min-height: 110px;
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>

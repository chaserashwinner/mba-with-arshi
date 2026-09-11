<script setup lang="ts">
import { PORTFOLIO_DATA } from '~/data/portfolio';

const roadmap = PORTFOLIO_DATA.roadmap;
</script>

<template>
  <section class="guides section" id="guides">
    <div class="guide-intro">
      <span class="kicker">One exam at a time</span>
      <h2>Your MBA admission roadmap</h2>
      <p>Follow the path that matches your exam and admission stage.</p>
    </div>

    <div class="roadmap">
      <a 
        v-for="item in roadmap" 
        :key="item.step" 
        :href="item.link"
        class="roadmap-card"
      >
        <span class="road-number">{{ item.step }}</span>
        <div>
          <small>{{ item.tag }}</small>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
        <b aria-hidden="true">→</b>
      </a>
    </div>
  </section>
</template>

<style scoped>
.guides {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 80px;
  align-items: start;
  background: var(--paper);
}

.section {
  padding: 110px max(5vw, 24px);
}

.guide-intro {
  position: sticky;
  top: 125px;
}

.guide-intro h2 {
  margin: 10px 0 0;
  font-size: clamp(2.3rem, 4vw, 4.25rem);
  line-height: 1.02;
  letter-spacing: -0.055em;
  color: var(--ink);
}

.guide-intro p {
  max-width: 420px;
  margin-top: 22px;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.65;
}

.roadmap {
  border-top: 1px solid var(--line);
}

.roadmap-card {
  min-height: 148px;
  padding: 27px 0;
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 22px;
  align-items: center;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
}

.road-number {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(98, 36, 233, 0.25);
  border-radius: 50%;
  color: var(--violet);
  font-size: 0.7rem;
  font-weight: 850;
  transition: all 0.2s ease;
}

.roadmap-card:hover .road-number {
  color: white;
  background: var(--violet);
  transform: rotate(-7deg);
}

.roadmap small {
  color: var(--magenta);
  font-size: 0.64rem;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.roadmap h3 {
  margin: 5px 0;
  font-size: 1.22rem;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.roadmap p {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
}

.roadmap b {
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

.roadmap-card:hover b {
  transform: translateX(4px);
}

@media (max-width: 1120px) {
  .guides {
    grid-template-columns: 1fr;
    gap: 35px;
  }
  .guide-intro {
    position: static;
  }
}

@media (max-width: 760px) {
  .section {
    padding: 75px 20px;
  }
  .roadmap-card {
    grid-template-columns: 55px 1fr auto;
    gap: 12px;
  }
}
</style>

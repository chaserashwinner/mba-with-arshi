<script setup lang="ts">
import { PORTFOLIO_DATA } from '~/data/portfolio';

const personal = PORTFOLIO_DATA.personal;
</script>

<template>
  <section class="about section" id="about">
    <div class="about-card">
      <div class="about-quote">“</div>
      <div class="about-copy">
        <span class="kicker">Meet your counsellor</span>
        <h2>Clear advice for a decision that costs lakhs.</h2>
        <p>
          Arshi Khan has spent more than a decade helping students understand colleges, entrance exams and admission choices. Her content focuses on the questions that brochures often leave unanswered.
        </p>
        <a 
          class="text-link dark-link" 
          :href="personal.youtubeUrl" 
          target="_blank" 
          rel="noreferrer"
        >
          Know more about Arshi <span>↗</span>
        </a>
      </div>
      <div class="about-stat">
        <strong>10+</strong>
        <span>Years in<br />counselling</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding-top: 0;
  background: var(--paper);
}

.section {
  padding: 110px max(5vw, 24px);
}

.about-card {
  max-width: 1340px;
  min-height: 395px;
  margin: 0 auto;
  padding: clamp(36px, 6vw, 80px);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 45px;
  overflow: hidden;
  position: relative;
  color: white;
  border-radius: 26px;
  background: linear-gradient(135deg, #16121e 0%, #291249 70%, #5924b8 100%);
}

.about-card::after {
  content: "ARSHI";
  position: absolute;
  right: -24px;
  bottom: -60px;
  color: rgba(255, 255, 255, 0.05);
  font-size: 12rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.08em;
  pointer-events: none;
}

.about-quote {
  color: var(--acid);
  font-family: Georgia, serif;
  font-size: 8rem;
  line-height: 0.7;
}

.about-copy {
  max-width: 670px;
  position: relative;
  z-index: 2;
}

.about-copy .kicker {
  color: var(--acid);
}

.about-copy h2 {
  margin: 10px 0 0;
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  line-height: 1.02;
  letter-spacing: -0.055em;
  color: white;
}

.about-copy p {
  margin: 25px 0;
  color: #c5bed0;
  font-size: 1rem;
  line-height: 1.75;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 5px;
  border-bottom: 1px solid currentColor;
  font-size: 0.8rem;
  font-weight: 750;
  color: white;
  transition: color 0.2s ease;
}

.text-link:hover {
  color: var(--acid);
}

.about-stat {
  min-width: 170px;
  padding-left: 30px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  z-index: 2;
}

.about-stat strong {
  color: var(--acid);
  font-size: 3.6rem;
  line-height: 0.85;
  letter-spacing: -0.06em;
}

.about-stat span {
  color: #bbb3c6;
  font-size: 0.72rem;
  line-height: 1.35;
}

@media (max-width: 1120px) {
  .about-card {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  .about-stat {
    padding: 22px 0 0;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.18);
  }
}

@media (max-width: 760px) {
  .section {
    padding: 75px 20px;
  }
  .about-quote {
    font-size: 5rem;
  }
}
</style>

<script setup lang="ts">
import { PORTFOLIO_DATA } from '~/data/portfolio';

const personal = PORTFOLIO_DATA.personal;
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer>
    <div class="footer-brand-wrap">
      <a class="brand footer-brand" href="#top" aria-label="MBA With Arshi Home">
        <span class="brand-mark">A</span>
        <span class="brand-copy">
          <strong>{{ personal.brandName }}</strong>
          <small>{{ personal.tagline }}</small>
        </span>
      </a>
      <p>College guidance, exam updates and honest MBA reviews.</p>
    </div>

    <div class="footer-links">
      <a :href="personal.youtubeUrl" target="_blank" rel="noreferrer">YouTube</a>
      <a href="#find-colleges">College Finder</a>
      <a href="#counselling">Counselling</a>
    </div>

    <small>© {{ currentYear }} {{ personal.brandName }}. All rights reserved.</small>
  </footer>
</template>

<style scoped>
footer {
  padding: 48px max(5vw, 24px);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px 40px;
  align-items: center;
  color: white;
  background: var(--ink);
}

.footer-brand-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.brand {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 11px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(145deg, var(--violet), var(--magenta));
  border-radius: 12px 12px 4px 12px;
  font-size: 1.35rem;
  font-weight: 900;
  box-shadow: 0 8px 24px rgba(98, 36, 233, 0.3);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.06;
}

.brand-copy strong {
  font-size: 0.98rem;
  letter-spacing: -0.02em;
  color: white;
}

.brand-copy small {
  margin-top: 4px;
  color: #9a94a5;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

footer p {
  margin: 0;
  color: #9e98a8;
  font-size: 0.8rem;
}

.footer-links {
  grid-row: 1 / 3;
  grid-column: 2;
  display: flex;
  gap: 24px;
  color: #c9c4d0;
  font-size: 0.8rem;
  font-weight: 600;
}

.footer-links a {
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--acid);
}

footer > small {
  grid-column: 1 / -1;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #77717f;
  font-size: 0.68rem;
}

@media (max-width: 760px) {
  footer {
    grid-template-columns: 1fr;
  }
  .footer-links {
    grid-row: auto;
    grid-column: auto;
    flex-wrap: wrap;
  }
}
</style>

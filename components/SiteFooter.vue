<script setup lang="ts">
import { PORTFOLIO_DATA } from '~/data/portfolio';

const personal = PORTFOLIO_DATA.personal;
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand-col">
          <a class="brand" href="#top" aria-label="MBA With Arshi home">
            <span class="brand-mark">A</span>
            <div class="brand-text">
              <strong>{{ personal.brandName }}</strong>
              <small>{{ personal.tagline }}</small>
            </div>
          </a>
          <p class="brand-desc">
            Fact-based MBA college shortlisting, entrance exam strategy, fees & ROI reviews, and 1:1 counselling with Arshi Khan.
          </p>
        </div>

        <div class="footer-links-col">
          <span class="col-title">NAVIGATION</span>
          <nav>
            <a href="#find-colleges">Find Colleges</a>
            <a href="#exams">MBA Exams</a>
            <a href="#guidance">Guidance Roadmap</a>
            <a href="#about">About Arshi Khan</a>
            <a href="#counselling">1:1 Counselling</a>
          </nav>
        </div>

        <div class="footer-contact-col">
          <span class="col-title">CONTACT & SOCIAL</span>
          <p>Email: <a :href="`mailto:${personal.email}`" class="contact-link">{{ personal.email }}</a></p>
          <p>YouTube: <a :href="personal.youtubeUrl" target="_blank" rel="noreferrer" class="contact-link">{{ personal.youtubeChannel }}</a></p>
          <a href="#counselling" class="button button-primary footer-cta">
            Book Guidance Session →
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} {{ personal.brandName }}. All rights reserved. Practical B-School guidance with Arshi Khan.
        </p>
        <a href="#top" class="back-to-top">
          Back to Top ↑
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 80px max(5vw, 24px) 40px;
  background: #040308;
  color: var(--ink-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-container {
  max-width: 1340px;
  margin: 0 auto;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: clamp(30px, 5vw, 60px);
  margin-bottom: 60px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--primary);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 1.1rem;
  font-weight: 900;
}

.brand-text strong {
  display: block;
  font-size: 1rem;
  color: #ffffff;
}

.brand-text small {
  color: var(--ink-dark-muted);
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
}

.brand-desc {
  color: var(--ink-dark-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 400px;
}

.col-title {
  display: block;
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  color: var(--accent-acid);
  margin-bottom: 16px;
}

.footer-links-col nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links-col a {
  color: var(--ink-dark-muted);
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-links-col a:hover {
  color: #ffffff;
}

.footer-contact-col p {
  margin: 0 0 10px;
  color: var(--ink-dark-muted);
  font-size: 0.9rem;
}

.contact-link {
  color: #ffffff;
  font-weight: 600;
}

.contact-link:hover {
  color: var(--primary-bright);
}

.footer-cta {
  margin-top: 16px;
  min-height: 42px;
  font-size: 0.82rem;
}

.footer-bottom {
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.copyright {
  margin: 0;
  color: var(--ink-dark-muted);
  font-size: 0.8rem;
}

.back-to-top {
  color: var(--primary-bright);
  font-size: 0.8rem;
  font-weight: 750;
  transition: color 0.2s ease;
}

.back-to-top:hover {
  color: #ffffff;
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

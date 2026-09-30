<script setup lang="ts">
import { ArrowRightIcon, ArrowUpIcon, EnvelopeIcon } from '@heroicons/vue/20/solid';
import SocialIcon from '~/components/ui/SocialIcon.vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';
import { prefersReducedMotion } from '~/composables/useScrollAnimation';

const personal = PORTFOLIO_DATA.personal;
const currentYear = new Date().getFullYear();

const navLinks = [
  { href: '#find-colleges', label: 'Find Colleges' },
  { href: '#exams', label: 'MBA Exams' },
  { href: '#guidance', label: 'Guidance Roadmap' },
  { href: '#about', label: 'About Arshi Khan' },
  { href: '#counselling', label: '1:1 Counselling' },
];

function backToTop(e: MouseEvent) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  // Move focus back to the top of the document for keyboard users.
  document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true });
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div v-reveal="{ stagger: true }" class="footer-top">
        <div class="footer-brand-col">
          <a class="brand" href="#top" aria-label="MBA With Arshi home">
            <span class="brand-mark" aria-hidden="true">A</span>
            <div class="brand-text">
              <strong>{{ personal.brandName }}</strong>
              <small>{{ personal.tagline }}</small>
            </div>
          </a>
          <p class="brand-desc">
            Fact-based MBA college shortlisting, entrance exam strategy, fees & ROI reviews, and 1:1 counselling with Arshi Khan.
          </p>
          <ul class="social-row" aria-label="Social links">
            <li>
              <a :href="personal.youtubeUrl" target="_blank" rel="noreferrer" class="social-icon" aria-label="YouTube channel (opens in new tab)">
                <SocialIcon name="youtube" />
              </a>
            </li>
            <li>
              <a :href="personal.instagramUrl" target="_blank" rel="noreferrer" class="social-icon" aria-label="Instagram (opens in new tab)">
                <SocialIcon name="instagram" />
              </a>
            </li>
            <li>
              <a :href="`mailto:${personal.email}`" class="social-icon" :aria-label="`Email ${personal.email}`">
                <EnvelopeIcon aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <div class="footer-links-col">
          <span class="col-title" id="footer-nav-title">NAVIGATION</span>
          <nav aria-labelledby="footer-nav-title">
            <a v-for="link in navLinks" :key="link.href" :href="link.href" class="footer-link">
              <span class="link-underline">{{ link.label }}</span>
            </a>
          </nav>
        </div>

        <div class="footer-contact-col">
          <span class="col-title">CONTACT & SOCIAL</span>
          <p>Email: <a :href="`mailto:${personal.email}`" class="contact-link link-underline">{{ personal.email }}</a></p>
          <p>YouTube: <a :href="personal.youtubeUrl" target="_blank" rel="noreferrer" class="contact-link link-underline">{{ personal.youtubeChannel }}</a></p>
          <a href="#counselling" class="button button-primary footer-cta">
            Book Guidance Session
            <ArrowRightIcon class="btn-icon" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} {{ personal.brandName }}. All rights reserved. Practical B-School guidance with Arshi Khan.
        </p>
        <a href="#top" class="back-to-top" @click="backToTop">
          <span>Back to Top</span>
          <span class="back-to-top-icon" aria-hidden="true"><ArrowUpIcon /></span>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  padding: 88px max(5vw, 20px) 36px;
  background: #040308;
  color: var(--ink-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.site-footer::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 50%;
  width: min(600px, 80vw);
  height: 1px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.55), transparent);
}

.footer-container {
  max-width: 1340px;
  margin: 0 auto;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: clamp(36px, 5vw, 60px);
  margin-bottom: 64px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  border-radius: 12px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--primary-bright), var(--primary-hover));
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 1.1rem;
  font-weight: 900;
  transition: transform var(--dur-med) var(--ease-out);
}

.brand:hover .brand-mark {
  transform: rotate(-8deg) scale(1.05);
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
  letter-spacing: 0.08em;
}

.brand-desc {
  color: var(--ink-dark-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 0 22px;
}

.social-row {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 10px;
}

.social-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--ink-dark-muted);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  transition:
    color var(--dur-fast) ease,
    border-color var(--dur-fast) ease,
    background-color var(--dur-fast) ease,
    transform var(--dur-med) var(--ease-out);
}

.social-icon svg {
  width: 17px;
  height: 17px;
}

.social-icon:hover,
.social-icon:focus-visible {
  color: #ffffff;
  border-color: rgba(167, 139, 250, 0.5);
  background: rgba(139, 92, 246, 0.18);
  transform: translateY(-3px);
}

.col-title {
  display: block;
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  color: var(--accent-acid);
  margin-bottom: 18px;
}

.footer-links-col nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.footer-link {
  color: var(--ink-dark-muted);
  font-size: 0.92rem;
  transition: color var(--dur-fast) ease;
}

.footer-link:hover,
.footer-link:focus-visible {
  color: #ffffff;
}

.footer-contact-col p {
  margin: 0 0 10px;
  color: var(--ink-dark-muted);
  font-size: 0.9rem;
  overflow-wrap: anywhere;
}

.contact-link {
  color: #ffffff;
  font-weight: 600;
  transition: color var(--dur-fast) ease;
}

.contact-link:hover {
  color: var(--primary-soft);
}

.footer-cta {
  margin-top: 16px;
  min-height: 44px;
  font-size: 0.82rem;
}

.footer-bottom {
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
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
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink-dark-muted);
  font-size: 0.8rem;
  font-weight: 750;
  transition: color var(--dur-fast) ease;
}

.back-to-top-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--primary-soft);
  overflow: hidden;
  transition: border-color var(--dur-fast) ease, background-color var(--dur-fast) ease;
}

.back-to-top-icon svg {
  width: 16px;
  height: 16px;
  transition: transform var(--dur-med) var(--ease-out);
}

.back-to-top:hover,
.back-to-top:focus-visible {
  color: #ffffff;
}

.back-to-top:hover .back-to-top-icon,
.back-to-top:focus-visible .back-to-top-icon {
  border-color: var(--primary-soft);
  background: rgba(139, 92, 246, 0.16);
}

.back-to-top:hover .back-to-top-icon svg {
  animation: nudge-up 600ms var(--ease-out);
}

@keyframes nudge-up {
  0% { transform: translateY(0); }
  45% { transform: translateY(-140%); }
  46% { transform: translateY(140%); }
  100% { transform: translateY(0); }
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
  .footer-brand-col {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .footer-top {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
}
</style>

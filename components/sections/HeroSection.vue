<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowRightIcon, PlayIcon, EnvelopeIcon } from '@heroicons/vue/20/solid';
import SocialIcon from '~/components/ui/SocialIcon.vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';
import { useScrollAnimation, hasFinePointer, MOTION_MEDIA } from '~/composables/useScrollAnimation';

const personal = PORTFOLIO_DATA.personal;

const heroContainerRef = ref<HTMLElement | null>(null);
const visualRef = ref<HTMLElement | null>(null);
const isReady = ref(false);

const { initGSAP, isReducedMotion } = useScrollAnimation();

let pointerFrame = 0;
let gsapCtx: { revert: () => void } | null = null;

// Very small pointer parallax on the portrait (desktop, fine pointer only).
function onPointerMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    pointerFrame = 0;
    const el = visualRef.value;
    if (!el) return;
    const px = (e.clientX / window.innerWidth - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    el.style.setProperty('--px', px.toFixed(3));
    el.style.setProperty('--py', py.toFixed(3));
  });
}

onMounted(async () => {
  // Kick off the CSS entrance sequence on the next frame (no JS animation lib needed).
  requestAnimationFrame(() => {
    isReady.value = true;
  });

  if (isReducedMotion()) return;

  if (hasFinePointer()) {
    heroContainerRef.value?.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !heroContainerRef.value) return;

  // Gentle scroll-away of the hero content (desktop only).
  gsapCtx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_MEDIA.desktop, () => {
      gsap.to('.hero-content-stage', {
        scrollTrigger: {
          trigger: heroContainerRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
        y: -70,
        opacity: 0.35,
        ease: 'none',
      });
    });
  }, heroContainerRef.value);
});

onBeforeUnmount(() => {
  heroContainerRef.value?.removeEventListener('pointermove', onPointerMove);
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  gsapCtx?.revert();
});
</script>

<template>
  <section
    ref="heroContainerRef"
    class="hero-section"
    :class="{ 'is-ready': isReady }"
    id="top"
    aria-labelledby="hero-heading"
  >
    <!-- Background atmosphere: static gradients only (no blur filters = cheap to paint) -->
    <div class="hero-bg-grid" aria-hidden="true"></div>
    <div class="hero-glow glow-top-left" aria-hidden="true"></div>
    <div class="hero-glow glow-bottom-right" aria-hidden="true"></div>

    <div class="hero-content-stage">
      <div class="hero-grid">
        <!-- Hero Editorial Text Column -->
        <div class="hero-text-col">
          <div class="eyebrow hero-enter" style="--i: 0">
            <span class="line"></span>
            <span>{{ personal.eyebrow }}</span>
          </div>

          <h1 id="hero-heading" class="hero-headline">
            <span v-split-words="{ immediate: true, delay: 140 }" class="headline-line">{{ personal.headline }}</span>
            <span v-split-words="{ immediate: true, delay: 320 }" class="headline-line">
              <em class="serif-italic">{{ personal.headlineItalic }}</em>
            </span>
          </h1>

          <p class="hero-bio hero-enter" style="--i: 4">
            {{ personal.bio }}
          </p>

          <div class="hero-actions">
            <span class="hero-enter" style="--i: 5">
              <a v-magnetic class="button button-primary" :href="personal.primaryCtaLink">
                {{ personal.primaryCtaText }}
                <ArrowRightIcon class="btn-icon" aria-hidden="true" />
              </a>
            </span>
            <span class="hero-enter" style="--i: 6">
              <a
                class="button button-ghost-dark"
                :href="personal.youtubeUrl"
                target="_blank"
                rel="noreferrer"
              >
                <span class="play-dot" aria-hidden="true"><PlayIcon /></span>
                {{ personal.secondaryCtaText }}
              </a>
            </span>
          </div>

          <!-- Proof pills -->
          <div class="hero-trust-bar hero-enter" style="--i: 7">
            <div class="trust-pill">
              <span class="trust-dot" aria-hidden="true"></span>
              <strong>10+ Years</strong> Counselling Experience
            </div>
            <div class="trust-pill">
              <strong>100% Honest</strong> Reviews &amp; Fees
            </div>
          </div>

          <!-- Social links -->
          <ul class="hero-socials hero-enter" style="--i: 8" aria-label="Follow Arshi Khan">
            <li>
              <a :href="personal.youtubeUrl" target="_blank" rel="noreferrer" class="social-chip" aria-label="YouTube channel (opens in new tab)">
                <SocialIcon name="youtube" />
              </a>
            </li>
            <li>
              <a :href="personal.instagramUrl" target="_blank" rel="noreferrer" class="social-chip" aria-label="Instagram (opens in new tab)">
                <SocialIcon name="instagram" />
              </a>
            </li>
            <li>
              <a :href="`mailto:${personal.email}`" class="social-chip" :aria-label="`Email ${personal.email}`">
                <EnvelopeIcon aria-hidden="true" />
              </a>
            </li>
            <li class="socials-caption" aria-hidden="true">{{ personal.youtubeChannel }}</li>
          </ul>

          <!-- Compact counsellor chip (tablet & mobile, where the large portrait is hidden) -->
          <div class="mobile-profile-chip hero-enter" style="--i: 9">
            <picture>
              <source srcset="/mentors/arshi-400.avif" type="image/avif" />
              <source srcset="/mentors/arshi-400.webp" type="image/webp" />
              <img src="/mentors/arshi-400.png" alt="" width="400" height="225" loading="lazy" decoding="async" />
            </picture>
            <div>
              <strong>ARSHI KHAN</strong>
              <small>Senior MBA Counselor</small>
            </div>
            <span class="status-pulse" aria-hidden="true"></span>
          </div>
        </div>

        <!-- Hero visual video container (desktop) -->
        <div ref="visualRef" class="hero-visual-col">
          <div class="clean-visual-card">
            <div class="counselor-portrait-frame">
              <video
                src="/videos/arshi-walking.mp4"
                autoplay
                muted
                loop
                playsinline
                class="counselor-portrait"
              ></video>
              <div class="portrait-overlay-gradient" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Down Guidance Indicator -->
    <a href="#find-mba-story" class="scroll-down-hint hero-enter" style="--i: 10" aria-label="Scroll to discover">
      <span class="mouse-icon" aria-hidden="true">
        <span class="mouse-wheel"></span>
      </span>
      <span aria-hidden="true">SCROLL TO EXPLORE</span>
    </a>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100svh;
  width: 100%;
  padding: calc(var(--header-h) + 56px) max(5vw, 20px) 48px;
  background: var(--bg-dark);
  color: var(--ink-dark);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
}

/* ───── Background atmosphere ───── */
.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%);
  opacity: 0.55;
  pointer-events: none;
  z-index: 1;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 1400ms var(--ease-out);
}

.is-ready .hero-glow {
  opacity: 1;
}

.glow-top-left {
  top: -260px;
  left: -220px;
  width: 760px;
  height: 760px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.26), rgba(124, 58, 237, 0.08) 40%, transparent 68%);
}

.glow-bottom-right {
  bottom: -300px;
  right: -240px;
  width: 820px;
  height: 820px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.16), rgba(219, 46, 207, 0.05) 45%, transparent 68%);
}

.hero-content-stage {
  position: relative;
  z-index: 10;
  max-width: 1340px;
  margin: 0 auto;
  width: 100%;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(40px, 6vw, 80px);
  align-items: center;
}

/* ───── Entrance choreography (CSS only, transform + opacity) ───── */
.hero-enter {
  display: inline-block;
  opacity: 0;
  transform: translate3d(0, 16px, 0);
  transition:
    opacity 700ms var(--ease-out) calc(120ms + var(--i, 0) * 80ms),
    transform 700ms var(--ease-out) calc(120ms + var(--i, 0) * 80ms);
}

div.hero-enter,
p.hero-enter,
ul.hero-enter {
  display: block;
}

.eyebrow.hero-enter {
  display: inline-flex;
}

.hero-trust-bar.hero-enter,
.hero-socials.hero-enter,
.mobile-profile-chip.hero-enter,
.scroll-down-hint.hero-enter {
  display: flex;
}

.is-ready .hero-enter {
  opacity: 1;
  transform: none;
}

.eyebrow .line {
  transform: scaleX(0);
  transition: transform 700ms var(--ease-out) 200ms;
}

.is-ready .eyebrow .line {
  transform: scaleX(1);
}

/* ───── Typography ───── */
.hero-headline {
  margin: 20px 0 24px;
  font-size: clamp(2.6rem, 5.8vw, 5.6rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
  font-weight: 850;
  color: #ffffff;
  text-wrap: balance;
}

.headline-line {
  display: block;
}

.hero-headline .serif-italic {
  font-weight: 500;
  background: linear-gradient(100deg, #a78bfa 0%, #c4b5fd 45%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-right: 0.06em;
}

/* Once split into words, paint the gradient per word instead of on the <em> */
.hero-headline .split-words .serif-italic {
  background: none;
}

.hero-headline .serif-italic :deep(.split-word__inner) {
  -webkit-background-clip: text;
  background-clip: text;
  background-image: linear-gradient(100deg, #a78bfa 0%, #c4b5fd 45%, #8b5cf6 100%);
  color: transparent;
}

.hero-bio {
  max-width: 560px;
  margin: 0 0 34px;
  color: var(--ink-dark-muted);
  font-size: clamp(1.05rem, 1.8vw, 1.22rem);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 36px;
}

.play-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
  transition: background-color var(--dur-fast) ease, transform var(--dur-med) var(--ease-out);
}

.play-dot svg {
  width: 12px;
  height: 12px;
  margin-left: 1px;
}

.button-ghost-dark:hover .play-dot {
  background: #ff0033;
  transform: scale(1.08);
}

/* ───── Trust + social ───── */
.hero-trust-bar {
  flex-wrap: wrap;
  gap: 12px;
}

.trust-pill {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.76rem;
  color: var(--ink-dark-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.trust-pill strong {
  color: #ffffff;
}

.trust-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.hero-socials {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
  align-items: center;
  gap: 10px;
}

.social-chip {
  width: 40px;
  height: 40px;
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

.social-chip svg {
  width: 17px;
  height: 17px;
}

.social-chip:hover,
.social-chip:focus-visible {
  color: #ffffff;
  border-color: rgba(167, 139, 250, 0.5);
  background: rgba(139, 92, 246, 0.16);
  transform: translateY(-3px);
}

.socials-caption {
  margin-left: 6px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.35);
}

/* ───── Portrait visual ───── */
.hero-visual-col {
  --px: 0;
  --py: 0;
}

.clean-visual-card {
  position: relative;
  width: min(440px, 100%);
  margin: 0 auto;
}

.counselor-portrait-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 0.85;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: linear-gradient(135deg, #140b28, #2a1058);
  box-shadow: var(--shadow-dark), 0 0 0 1px rgba(139, 92, 246, 0.08);
  /* clip-path mask reveal on load */
  clip-path: inset(14% 10% 14% 10% round var(--radius-xl));
  transform: translate3d(calc(var(--px) * 6px), calc(var(--py) * 6px), 0);
  transition:
    clip-path 1100ms var(--ease-in-out) 200ms,
    transform 900ms var(--ease-out);
}

.is-ready .counselor-portrait-frame {
  clip-path: inset(0 0 0 0 round var(--radius-xl));
}

.counselor-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: contrast(1.04);
  transform: scale(1.12);
  transition: transform 1600ms var(--ease-out) 200ms;
}

.is-ready .counselor-portrait {
  transform: scale(1.02);
}

.portrait-overlay-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 50%, rgba(7, 5, 13, 0.9) 100%),
    radial-gradient(120% 60% at 50% 0%, rgba(124, 58, 237, 0.18), transparent 60%);
}

.status-pulse {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  flex: none;
}

/* A single, slow "online" pulse — the only looping animation in the hero */
.status-pulse::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-ring 2.4s var(--ease-out) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  80%, 100% { transform: scale(2.6); opacity: 0; }
}

/* ───── Compact profile chip (≤1024px) ───── */
.mobile-profile-chip {
  display: none !important;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  padding: 8px 18px 8px 8px;
  width: fit-content;
  max-width: 100%;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-profile-chip img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 25%;
  background: #000;
}

.mobile-profile-chip strong {
  display: block;
  font-size: 0.8rem;
  color: #ffffff;
  line-height: 1.15;
}

.mobile-profile-chip small {
  font-size: 0.64rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary-soft);
}

/* ───── Scroll hint ───── */
.scroll-down-hint {
  position: relative;
  z-index: 10;
  margin-top: 44px;
  align-self: center;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--ink-dark-muted);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  transition: color var(--dur-fast) ease;
}

.scroll-down-hint:hover {
  color: #ffffff;
}

.mouse-icon {
  width: 20px;
  height: 32px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.mouse-wheel {
  width: 3px;
  height: 6px;
  border-radius: 2px;
  background: var(--primary-bright);
  animation: mouseAnim 1.8s infinite ease-in-out;
}

@keyframes mouseAnim {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero-visual-col {
    display: none;
  }
  .mobile-profile-chip.hero-enter {
    display: flex !important;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding-top: calc(var(--header-h) + 36px);
    min-height: auto;
  }
  .hero-headline {
    font-size: clamp(2.35rem, 11vw, 3.2rem);
  }
  .hero-actions > span,
  .hero-actions .button {
    width: 100%;
  }
  .scroll-down-hint {
    display: none !important;
  }
  .socials-caption {
    display: none;
  }
}

@media (max-height: 760px) and (min-width: 1025px) {
  .scroll-down-hint {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-enter {
    opacity: 1 !important;
    transform: none !important;
  }
  .counselor-portrait-frame {
    clip-path: none !important;
    transform: none !important;
  }
  .counselor-portrait {
    transform: none !important;
  }
  .status-pulse::after,
  .mouse-wheel {
    animation: none !important;
  }
}
</style>

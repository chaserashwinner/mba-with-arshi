<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  tiltStyle?: Record<string, string>;
}>();

const currentState = ref<number>(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Toggle state every 4.5 seconds
  intervalId = setInterval(() => {
    currentState.value = (currentState.value + 1) % 2;
  }, 4500);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="editorial-visual-shell" :style="tiltStyle">
    <!-- Atmospheric Radial Glows & Background Geometry -->
    <div class="bg-glow-radial"></div>
    <div class="bg-arc arc-outer"></div>
    <div class="bg-arc arc-inner"></div>

    <!-- Main Portrait Frame Stage (Arshi Khan Authentic Counselor Portrait) -->
    <div class="portrait-stage-card">
      <div class="portrait-image-wrapper">
        <img 
          src="/mentors/arshi-800.png" 
          alt="Arshi Khan — Senior MBA Counselor" 
          class="portrait-img"
        />
        <div class="portrait-gradient-overlay"></div>
      </div>

      <!-- Counselor Verification Badge -->
      <div class="counsellor-badge">
        <span class="badge-dot"></span>
        <div class="badge-text">
          <strong>ARSHI KHAN</strong>
          <small>Senior MBA Counselor • 10+ Yrs</small>
        </div>
      </div>

      <!-- Brand Stamp Tag -->
      <div class="brand-stamp">
        <span>EXPERT COUNSELLING</span>
        <strong>MBA WITH ARSHI</strong>
      </div>
    </div>

    <!-- Dual-State Morphing Analytics Card -->
    <div class="morph-analytics-card">
      <transition name="state-fade" mode="out-in">
        <!-- State 0: Shortlist & Cutoffs Mode -->
        <div v-if="currentState === 0" class="card-state" key="state-0">
          <div class="state-header">
            <span class="state-icon">📊</span>
            <div>
              <small>PROFILE MATCHING</small>
              <h4>CAT & XAT Cutoff Shortlists</h4>
            </div>
          </div>
          <div class="state-metrics">
            <span class="metric-pill">85%+ Percentile</span>
            <span class="metric-pill highlighted">Top 15 B-Schools</span>
          </div>
        </div>

        <!-- State 1: Fees vs ROI Placement Mode -->
        <div v-else class="card-state" key="state-1">
          <div class="state-header">
            <span class="state-icon">💡</span>
            <div>
              <small>REAL ROI ANALYSIS</small>
              <h4>Fees vs Placement Package</h4>
            </div>
          </div>
          <div class="state-metrics">
            <span class="metric-pill highlighted">3.5x Average ROI</span>
            <span class="metric-pill">Verified Data</span>
          </div>
        </div>
      </transition>
    </div>

    <!-- Floating Info Cards (Preserved from Reference) -->
    <div class="floating-note note-top">
      <span>01</span>
      <p><strong>Shortlist</strong> by your profile</p>
    </div>

    <div class="floating-note note-bottom">
      <span>02</span>
      <p><strong>Compare</strong> fees and ROI</p>
    </div>
  </div>
</template>

<style scoped>
.editorial-visual-shell {
  width: min(620px, 100%);
  min-height: 480px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

/* Background Atmosphere & Arcs */
.bg-glow-radial {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(219, 46, 207, 0.16), rgba(98, 36, 233, 0.08) 55%, transparent 75%);
  z-index: 1;
  pointer-events: none;
}

.bg-arc {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(98, 36, 233, 0.14);
  pointer-events: none;
  z-index: 1;
}

.arc-outer {
  width: 480px;
  height: 480px;
  animation: arcPulse 8s ease-in-out infinite alternate;
}

.arc-inner {
  width: 350px;
  height: 350px;
  border-style: dashed;
  animation: arcRotate 30s linear infinite;
}

@keyframes arcPulse {
  0% { transform: scale(0.97); opacity: 0.7; }
  100% { transform: scale(1.02); opacity: 1; }
}

@keyframes arcRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Main Portrait Frame Card (Dominant Subject) */
.portrait-stage-card {
  width: min(540px, 100%);
  height: 380px;
  position: relative;
  z-index: 2;
  border: 9px solid white;
  border-radius: 28px 28px 10px 28px;
  background: linear-gradient(135deg, #1d0940 0%, #35106f 60%, #5924b8 100%);
  box-shadow: 0 28px 80px rgba(32, 17, 70, 0.22);
  overflow: hidden;
  transform: rotate(1.2deg);
  transition: transform 0.3s ease;
}

.portrait-stage-card:hover {
  transform: rotate(0deg) scale(1.01);
}

.portrait-image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: contrast(1.03) brightness(1.02);
  transition: transform 0.4s ease;
}

.portrait-stage-card:hover .portrait-img {
  transform: scale(1.03);
}

.portrait-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(17, 9, 38, 0.85) 100%);
}

/* Counselor Verification Badge */
.counsellor-badge {
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}

.badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25);
  animation: liveDotPulse 2s infinite;
}

@keyframes liveDotPulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.badge-text {
  display: flex;
  flex-direction: column;
}

.badge-text strong {
  font-size: 0.88rem;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.badge-text small {
  color: var(--violet);
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Brand Stamp */
.brand-stamp {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.brand-stamp span {
  color: var(--acid);
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.brand-stamp strong {
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}

/* Dual-State Morphing Analytics Card */
.morph-analytics-card {
  position: absolute;
  bottom: -20px;
  right: 10px;
  z-index: 4;
  width: 310px;
  padding: 16px 20px;
  border-radius: 18px;
  background: var(--violet-dark);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 16px 40px rgba(32, 17, 70, 0.28);
}

.card-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.state-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.state-icon {
  font-size: 1.4rem;
}

.state-header small {
  color: var(--acid);
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.1em;
}

.state-header h4 {
  margin: 2px 0 0;
  font-size: 0.94rem;
  letter-spacing: -0.01em;
  color: white;
}

.state-metrics {
  display: flex;
  gap: 8px;
}

.metric-pill {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #e2d8f5;
  font-size: 0.68rem;
  font-weight: 750;
}

.metric-pill.highlighted {
  background: var(--acid);
  color: var(--ink);
  font-weight: 850;
}

/* Transitions for morph card states */
.state-fade-enter-active,
.state-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.state-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.state-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Floating Info Cards (Preserved) */
.floating-note {
  width: 195px;
  padding: 13px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  z-index: 5;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 30px rgba(31, 16, 65, 0.13);
  transition: transform 0.3s ease;
}

.floating-note:hover {
  transform: translateY(-3px);
}

.floating-note > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 9px;
  color: white;
  background: var(--violet);
  font-size: 0.67rem;
  font-weight: 900;
}

.floating-note p {
  margin: 0;
  color: var(--muted);
  font-size: 0.72rem;
  line-height: 1.35;
}

.floating-note strong {
  color: var(--ink);
  font-size: 0.78rem;
}

.note-top {
  top: 15px;
  right: -10px;
  animation: floatTop 4s ease-in-out infinite alternate;
}

.note-bottom {
  top: 130px;
  left: -20px;
  animation: floatBottom 4.5s ease-in-out infinite alternate-reverse;
}

@keyframes floatTop {
  0% { transform: translateY(0); }
  100% { transform: translateY(-6px); }
}

@keyframes floatBottom {
  0% { transform: translateY(0); }
  100% { transform: translateY(6px); }
}

/* Accessibility & Mobile Responsive */
@media (prefers-reduced-motion: reduce) {
  .arc-outer, .arc-inner, .note-top, .note-bottom, .portrait-img, .portrait-stage-card {
    animation: none !important;
    transition: none !important;
  }
}

@media (max-width: 1120px) {
  .editorial-visual-shell {
    min-height: 420px;
  }
  .portrait-stage-card {
    height: 340px;
  }
}

@media (max-width: 760px) {
  .editorial-visual-shell {
    min-height: 320px;
  }
  .portrait-stage-card {
    height: 280px;
  }
  .morph-analytics-card {
    width: 260px;
    bottom: -15px;
    right: 0;
    padding: 12px 14px;
  }
  .floating-note {
    display: none;
  }
}
</style>

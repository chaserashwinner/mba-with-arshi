<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';
import { useScrollAnimation } from '~/composables/useScrollAnimation';

const personal = PORTFOLIO_DATA.personal;

const studentName = ref('');
const studentContact = ref('');
const selectedExam = ref('CAT');
const targetPercentile = ref('');
const formSubmitted = ref(false);

const sectionRef = ref<HTMLElement | null>(null);
const headlineRef = ref<HTMLElement | null>(null);

const { initGSAP, isReducedMotion } = useScrollAnimation();

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !sectionRef.value || !headlineRef.value) return;

  gsap.fromTo(
    headlineRef.value,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom-=120',
      },
    }
  );
});

function handleSubmit() {
  if (!studentName.value.trim() || !studentContact.value.trim()) return;
  formSubmitted.value = true;
}
</script>

<template>
  <section ref="sectionRef" class="counselling-cta-section" id="counselling">
    <div class="cta-glow-bg" aria-hidden="true"></div>

    <div class="cta-container">
      <div class="cta-card">
        <!-- Copy Column -->
        <div class="cta-copy-col">
          <div class="eyebrow">
            <span class="line"></span>
            <span>07 — 1:1 COUNSELLING SESSION</span>
          </div>

          <h2 ref="headlineRef">
            Ready to make the <br />
            <em class="serif-italic">right MBA decision?</em>
          </h2>

          <p class="cta-desc">
            Book a direct 1:1 counselling call with Arshi Khan to evaluate your entrance test scores, budget constraints, and realistic college cutoff matches.
          </p>

          <div class="contact-details">
            <div class="detail-item">
              <span class="detail-icon">✉</span>
              <div>
                <small>DIRECT EMAIL</small>
                <strong>{{ personal.email }}</strong>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📺</span>
              <div>
                <small>YOUTUBE REVIEWS</small>
                <strong>{{ personal.youtubeChannel }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="cta-form-col">
          <div class="form-card">
            <form v-if="!formSubmitted" @submit.prevent="handleSubmit" class="guidance-form">
              <h3>Request 1:1 Guidance Call</h3>
              <p class="form-sub">Fill out your profile details for personalized shortlisting advice.</p>

              <div class="form-field">
                <label for="student-name">Full Name</label>
                <input 
                  id="student-name"
                  v-model="studentName"
                  type="text" 
                  placeholder="e.g. Rahul Sharma" 
                  required 
                />
              </div>

              <div class="form-field">
                <label for="student-contact">Phone / Email</label>
                <input 
                  id="student-contact"
                  v-model="studentContact"
                  type="text" 
                  placeholder="Phone or email address" 
                  required 
                />
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label for="exam-target">Target Exam</label>
                  <select id="exam-target" v-model="selectedExam">
                    <option value="CAT">CAT Exam</option>
                    <option value="XAT">XAT Exam</option>
                    <option value="CMAT">CMAT Exam</option>
                    <option value="MAHCET">MAH CET Exam</option>
                    <option value="NMAT">NMAT Exam</option>
                  </select>
                </div>

                <div class="form-field">
                  <label for="score-target">Score / Percentile</label>
                  <input 
                    id="score-target"
                    v-model="targetPercentile"
                    type="text" 
                    placeholder="e.g. 85%" 
                  />
                </div>
              </div>

              <button type="submit" class="button button-primary submit-btn">
                Book 1:1 Guidance Call →
              </button>
            </form>

            <!-- Success State -->
            <div v-else class="form-success-state">
              <span class="success-icon">✓</span>
              <h3>Guidance Request Sent!</h3>
              <p>Thank you, {{ studentName }}. Arshi Khan's counselling team will contact you at {{ studentContact }} shortly with profile shortlisting details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.counselling-cta-section {
  position: relative;
  padding: 110px max(5vw, 24px);
  background: var(--bg-dark);
  color: var(--ink-dark);
  overflow: hidden;
  isolation: isolate;
}

.cta-glow-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 75% 50%, rgba(124, 58, 237, 0.18) 0%, transparent 60%);
  pointer-events: none;
  z-index: 1;
}

.cta-container {
  position: relative;
  z-index: 10;
  max-width: 1340px;
  margin: 0 auto;
}

.cta-card {
  padding: clamp(36px, 6vw, 64px);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(22, 15, 40, 0.95), rgba(46, 16, 101, 0.75));
  border: 1px solid var(--border-dark);
  box-shadow: var(--shadow-dark);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(30px, 5vw, 60px);
  align-items: center;
}

.cta-copy-col h2 {
  margin: 14px 0 20px;
  font-size: clamp(2.4rem, 4.5vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: #ffffff;
}

.cta-desc {
  color: var(--ink-dark-muted);
  font-size: 1.08rem;
  line-height: 1.65;
  margin-bottom: 36px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.detail-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  font-size: 1.1rem;
}

.detail-item small {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--ink-dark-muted);
}

.detail-item strong {
  font-size: 0.94rem;
  color: #ffffff;
}

/* Form Styling */
.form-card {
  padding: clamp(24px, 4vw, 36px);
  border-radius: var(--radius-lg);
  background: rgba(14, 9, 27, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
}

.guidance-form h3 {
  margin: 0 0 6px;
  font-size: 1.35rem;
  font-weight: 850;
  color: #ffffff;
}

.form-sub {
  margin: 0 0 24px;
  color: var(--ink-dark-muted);
  font-size: 0.84rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-field label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--accent-acid);
  text-transform: uppercase;
}

.form-field input,
.form-field select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-field input:focus,
.form-field select:focus {
  border-color: var(--primary-bright);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.form-success-state {
  text-align: center;
  padding: 30px 10px;
}

.success-icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #10b981;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  margin: 0 auto 16px;
}

.form-success-state h3 {
  color: #ffffff;
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.form-success-state p {
  color: var(--ink-dark-muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .cta-card {
    grid-template-columns: 1fr;
  }
}
</style>

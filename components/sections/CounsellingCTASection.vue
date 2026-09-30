<script setup lang="ts">
import { ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/20/solid';
import SocialIcon from '~/components/ui/SocialIcon.vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const personal = PORTFOLIO_DATA.personal;

const studentName = ref('');
const studentContact = ref('');
const selectedExam = ref('CAT');
const targetPercentile = ref('');
const formSubmitted = ref(false);

const errors = reactive({ name: '', contact: '' });
const successRef = ref<HTMLElement | null>(null);

const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

function validate(): boolean {
  errors.name = studentName.value.trim() ? '' : 'Please enter your name.';
  errors.contact = studentContact.value.trim() ? '' : 'Please add a phone number or email.';
  return !errors.name && !errors.contact;
}

function clearError(field: 'name' | 'contact') {
  errors[field] = '';
}

async function handleSubmit() {
  if (!validate()) {
    await nextTick();
    const firstInvalid = document.querySelector<HTMLElement>('.guidance-form [aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }
  formSubmitted.value = true;
  await nextTick();
  successRef.value?.focus();
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(personal.email);
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 2000);
  } catch {
    // Clipboard unavailable (e.g. insecure context) — fall back to the mail client.
    window.location.href = `mailto:${personal.email}`;
  }
}

onBeforeUnmount(() => clearTimeout(copiedTimer));
</script>

<template>
  <section class="counselling-cta-section" id="counselling" aria-labelledby="counselling-heading">
    <div class="cta-glow-bg" aria-hidden="true"></div>

    <div class="cta-container">
      <div v-reveal="'scale'" class="cta-card">
        <!-- Copy Column -->
        <div v-reveal="{ stagger: 90, delay: 150 }" class="cta-copy-col">
          <div class="eyebrow">
            <span class="line"></span>
            <span>07 — 1:1 COUNSELLING SESSION</span>
          </div>

          <h2 id="counselling-heading">
            Ready to make the <br />
            <em class="serif-italic">right MBA decision?</em>
          </h2>

          <p class="cta-desc">
            Book a direct 1:1 counselling call with Arshi Khan to evaluate your entrance test scores, budget constraints, and realistic college cutoff matches.
          </p>

          <ul class="contact-details">
            <li class="detail-item">
              <span class="detail-icon" aria-hidden="true"><EnvelopeIcon /></span>
              <div class="detail-text">
                <small>DIRECT EMAIL</small>
                <a :href="`mailto:${personal.email}`" class="detail-link link-underline">{{ personal.email }}</a>
              </div>
              <button
                type="button"
                class="copy-btn"
                :class="{ 'is-copied': copied }"
                :aria-label="copied ? 'Email copied' : 'Copy email address'"
                @click="copyEmail"
              >
                <Transition name="icon-swap" mode="out-in">
                  <CheckIcon v-if="copied" key="ok" aria-hidden="true" />
                  <DocumentDuplicateIcon v-else key="copy" aria-hidden="true" />
                </Transition>
                <span class="copy-label">{{ copied ? 'Copied' : 'Copy' }}</span>
              </button>
              <span class="sr-only" role="status" aria-live="polite">{{ copied ? 'Email address copied to clipboard' : '' }}</span>
            </li>
            <li class="detail-item">
              <span class="detail-icon detail-icon--yt" aria-hidden="true"><SocialIcon name="youtube" /></span>
              <div class="detail-text">
                <small>YOUTUBE REVIEWS</small>
                <a :href="personal.youtubeUrl" target="_blank" rel="noreferrer" class="detail-link link-arrow">
                  <span class="link-underline">{{ personal.youtubeChannel }}</span>
                  <ArrowUpRightIcon class="btn-icon btn-icon--diag" aria-hidden="true" />
                </a>
              </div>
            </li>
          </ul>
        </div>

        <!-- Form Card -->
        <div v-reveal="{ variant: 'up', delay: 300 }" class="cta-form-col">
          <div class="form-card">
            <Transition name="form-swap" mode="out-in">
              <form v-if="!formSubmitted" key="form" novalidate class="guidance-form" @submit.prevent="handleSubmit">
                <h3>Request 1:1 Guidance Call</h3>
                <p class="form-sub">Fill out your profile details for personalized shortlisting advice.</p>

                <div class="form-field" :class="{ 'has-error': errors.name }">
                  <label for="student-name">Full Name</label>
                  <input
                    id="student-name"
                    v-model="studentName"
                    type="text"
                    name="name"
                    autocomplete="name"
                    placeholder="e.g. Rahul Sharma"
                    required
                    :aria-invalid="errors.name ? 'true' : undefined"
                    :aria-describedby="errors.name ? 'student-name-error' : undefined"
                    @input="clearError('name')"
                  />
                  <Transition name="error">
                    <p v-if="errors.name" id="student-name-error" class="field-error">
                      <ExclamationCircleIcon aria-hidden="true" /> {{ errors.name }}
                    </p>
                  </Transition>
                </div>

                <div class="form-field" :class="{ 'has-error': errors.contact }">
                  <label for="student-contact">Phone / Email</label>
                  <input
                    id="student-contact"
                    v-model="studentContact"
                    type="text"
                    name="contact"
                    autocomplete="on"
                    placeholder="Phone or email address"
                    required
                    :aria-invalid="errors.contact ? 'true' : undefined"
                    :aria-describedby="errors.contact ? 'student-contact-error' : undefined"
                    @input="clearError('contact')"
                  />
                  <Transition name="error">
                    <p v-if="errors.contact" id="student-contact-error" class="field-error">
                      <ExclamationCircleIcon aria-hidden="true" /> {{ errors.contact }}
                    </p>
                  </Transition>
                </div>

                <div class="form-row">
                  <div class="form-field">
                    <label for="exam-target">Target Exam</label>
                    <select id="exam-target" v-model="selectedExam" name="exam">
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
                      name="score"
                      inputmode="decimal"
                      placeholder="e.g. 85%"
                    />
                  </div>
                </div>

                <button v-magnetic="{ strength: 6 }" type="submit" class="button button-primary submit-btn">
                  Book 1:1 Guidance Call
                  <ArrowRightIcon class="btn-icon" aria-hidden="true" />
                </button>
              </form>

              <!-- Success State -->
              <div v-else key="success" ref="successRef" class="form-success-state" tabindex="-1" role="status">
                <span class="success-icon" aria-hidden="true">
                  <svg viewBox="0 0 52 52">
                    <circle class="success-circle" cx="26" cy="26" r="24" />
                    <path class="success-check" d="M15 27l7 7 15-15" />
                  </svg>
                </span>
                <h3>Guidance Request Sent!</h3>
                <p>Thank you, {{ studentName }}. Arshi Khan's counselling team will contact you at {{ studentContact }} shortly with profile shortlisting details.</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.counselling-cta-section {
  position: relative;
  padding: clamp(80px, 11vw, 120px) max(5vw, 20px);
  background: var(--bg-dark);
  color: var(--ink-dark);
  overflow: hidden;
  isolation: isolate;
}

.cta-glow-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(50% 60% at 78% 50%, rgba(124, 58, 237, 0.2) 0%, transparent 70%),
    radial-gradient(40% 50% at 10% 100%, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
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
  position: relative;
  padding: clamp(28px, 6vw, 64px);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(22, 15, 40, 0.96), rgba(46, 16, 101, 0.72));
  border: 1px solid var(--border-dark);
  box-shadow: var(--shadow-dark);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(30px, 5vw, 60px);
  align-items: center;
  overflow: hidden;
}

/* Hairline highlight along the top edge */
.cta-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196, 181, 253, 0.6), transparent);
}

.cta-copy-col h2 {
  text-wrap: balance;
  margin: 14px 0 20px;
  font-size: clamp(2.2rem, 4.5vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: #ffffff;
}

.cta-desc {
  color: var(--ink-dark-muted);
  font-size: 1.06rem;
  line-height: 1.65;
  margin: 0 0 32px;
}

.contact-details {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color var(--dur-med) ease, background-color var(--dur-med) ease;
}

.detail-item:hover {
  border-color: rgba(167, 139, 250, 0.25);
  background: rgba(255, 255, 255, 0.05);
}

.detail-icon {
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.18);
  color: var(--primary-soft);
  display: grid;
  place-items: center;
}

.detail-icon svg {
  width: 18px;
  height: 18px;
}

.detail-icon--yt {
  color: #ff4d6d;
  background: rgba(255, 0, 51, 0.12);
}

.detail-text {
  flex: 1;
  min-width: 0;
}

.detail-text small {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--ink-dark-muted);
}

.detail-link {
  font-size: 0.94rem;
  font-weight: 700;
  color: #ffffff;
  overflow-wrap: anywhere;
}

.copy-btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: var(--ink-dark-muted);
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    color var(--dur-fast) ease,
    border-color var(--dur-fast) ease,
    background-color var(--dur-fast) ease;
}

.copy-btn svg {
  width: 15px;
  height: 15px;
}

.copy-btn:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
}

.copy-btn.is-copied {
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.45);
  background: rgba(16, 185, 129, 0.1);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 150ms ease, transform 150ms var(--ease-out);
}
.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(-20deg);
}

/* Form Styling */
.form-card {
  padding: clamp(22px, 4vw, 36px);
  border-radius: var(--radius-lg);
  background: rgba(14, 9, 27, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.6);
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
  font-size: 0.86rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  min-width: 0;
}

.form-field label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--accent-acid);
  text-transform: uppercase;
  transition: color var(--dur-fast) ease;
}

.form-field input,
.form-field select {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.14);
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 0.92rem;
  outline: none;
  transition:
    border-color var(--dur-fast) ease,
    background-color var(--dur-fast) ease,
    box-shadow var(--dur-fast) ease;
}

.form-field select {
  padding-right: 40px;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23a49bb7'%3E%3Cpath fill-rule='evenodd' d='M5.2 7.2a.75.75 0 0 1 1.06.02L10 11.17l3.74-3.95a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
  cursor: pointer;
}

.form-field select option {
  color: #120e1c;
}

.form-field input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.form-field input:hover,
.form-field select:hover {
  border-color: rgba(255, 255, 255, 0.24);
}

.form-field input:focus-visible,
.form-field select:focus-visible,
.form-field input:focus,
.form-field select:focus {
  border-color: var(--primary-soft);
  background-color: rgba(139, 92, 246, 0.08);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.form-field:focus-within label {
  color: #ffffff;
}

.form-field.has-error input {
  border-color: #f87171;
  box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.15);
}

.field-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 0 0;
  color: #fca5a5;
  font-size: 0.78rem;
  font-weight: 600;
}

.field-error svg {
  width: 14px;
  height: 14px;
  flex: none;
}

.error-enter-active,
.error-leave-active {
  transition: opacity var(--dur-fast) ease, transform var(--dur-fast) var(--ease-out);
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
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

.form-swap-enter-active,
.form-swap-leave-active {
  transition: opacity var(--dur-med) var(--ease-out), transform var(--dur-med) var(--ease-out);
}
.form-swap-enter-from {
  opacity: 0;
  transform: translate3d(0, 12px, 0) scale(0.98);
}
.form-swap-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.form-success-state {
  text-align: center;
  padding: 30px 10px;
  outline: none;
}

.success-icon {
  display: block;
  width: 64px;
  height: 64px;
  margin: 0 auto 18px;
}

.success-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.success-circle {
  stroke: #10b981;
  stroke-width: 2.5;
  fill: rgba(16, 185, 129, 0.12);
  stroke-dasharray: 151;
  stroke-dashoffset: 151;
  animation: draw 700ms var(--ease-out) 150ms forwards;
}

.success-check {
  stroke: #34d399;
  stroke-width: 3.5;
  stroke-dasharray: 34;
  stroke-dashoffset: 34;
  animation: draw 450ms var(--ease-out) 650ms forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.form-success-state h3 {
  color: #ffffff;
  font-size: 1.4rem;
  margin: 0 0 10px;
}

.form-success-state p {
  color: var(--ink-dark-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

@media (max-width: 1024px) {
  .cta-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .copy-label {
    display: none;
  }
  .detail-link {
    font-size: 0.86rem;
  }
  .detail-item {
    gap: 10px;
  }
  .copy-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .success-circle,
  .success-check {
    stroke-dashoffset: 0;
    animation: none;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const personal = PORTFOLIO_DATA.personal;

const studentName = ref('');
const studentEmail = ref('');
const studentExam = ref('cat');
const studentPercentile = ref('');
const showFormModal = ref(false);
const isSubmitted = ref(false);

function handleFormSubmit() {
  if (!studentName.value.trim() || !studentEmail.value.trim()) return;
  isSubmitted.value = true;
  setTimeout(() => {
    isSubmitted.value = false;
    showFormModal.value = false;
    studentName.value = '';
    studentEmail.value = '';
    studentPercentile.value = '';
  }, 2000);
}
</script>

<template>
  <section class="counselling section" id="counselling">
    <div class="counselling-container">
      <div class="cta-copy">
        <span class="kicker">Need a second opinion?</span>
        <h2>Get a shortlist made for your profile.</h2>
        <p>Bring your scores, budget and preferred cities. Leave with a clear next step.</p>
      </div>

      <div class="cta-actions">
        <a class="button button-white" :href="`mailto:${personal.email}`">
          Request counselling <span>→</span>
        </a>
        <button type="button" class="button button-ghost-white" @click="showFormModal = true">
          Book 1:1 Guidance Call ↗
        </button>
      </div>
    </div>

    <!-- Interactive Counselling Request Modal -->
    <div v-if="showFormModal" class="counselling-modal-backdrop" @click.self="showFormModal = false">
      <div class="counselling-modal">
        <button class="modal-close" @click="showFormModal = false">×</button>
        
        <div v-if="!isSubmitted">
          <span class="kicker">1:1 PROFILE COUNSELLING</span>
          <h3>Request Guidance Session</h3>
          <p>Fill out your scores and target preferences for personalized shortlisting advice.</p>
          
          <form @submit.prevent="handleFormSubmit" class="modal-form">
            <label>Your Full Name
              <input type="text" v-model="studentName" placeholder="e.g. Rahul Sharma" required />
            </label>

            <label>Email Address
              <input type="email" v-model="studentEmail" placeholder="rahul@example.com" required />
            </label>

            <label>Target Entrance Exam
              <select v-model="studentExam">
                <option value="cat">CAT</option>
                <option value="xat">XAT</option>
                <option value="cmat">CMAT</option>
                <option value="mahcet">MAH CET</option>
                <option value="nmat">NMAT</option>
              </select>
            </label>

            <label>Score / Expected Percentile
              <input type="text" v-model="studentPercentile" placeholder="e.g. 85 Percentile" />
            </label>

            <button type="submit" class="button button-primary modal-submit">
              Submit Profile for Review →
            </button>
          </form>
        </div>

        <div v-else class="success-modal-state">
          <span class="success-check">✓</span>
          <h3>Guidance Request Sent!</h3>
          <p>Arshi Khan's team will review your entrance exam profile and reach out via email short listing details.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.counselling {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  color: white;
  background: var(--violet);
}

.section {
  padding: 110px max(5vw, 24px);
}

.counselling-container {
  max-width: 1340px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
}

.counselling .kicker {
  color: var(--acid);
}

.counselling h2 {
  max-width: 770px;
  margin: 10px 0 0;
  font-size: clamp(2.3rem, 4vw, 4.25rem);
  line-height: 1.02;
  letter-spacing: -0.055em;
  color: white;
}

.counselling p {
  margin: 18px 0 0;
  color: #ddd2ff;
  font-size: 1.08rem;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: none;
}

.button-white {
  flex: none;
  color: var(--violet);
  background: white;
}

.button-white:hover {
  background: var(--acid);
  color: var(--ink);
}

.button-ghost-white {
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.button-ghost-white:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: white;
}

/* Modal styles */
.counselling-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(17, 16, 25, 0.75);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  padding: 24px;
}

.counselling-modal {
  width: min(500px, 100%);
  background: white;
  color: var(--ink);
  padding: 36px;
  border-radius: 24px;
  position: relative;
  box-shadow: var(--shadow);
}

.modal-close {
  position: absolute;
  top: 18px;
  right: 22px;
  border: 0;
  background: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--muted);
}

.counselling-modal h3 {
  margin: 8px 0 10px;
  font-size: 1.6rem;
  letter-spacing: -0.03em;
}

.counselling-modal p {
  color: var(--muted);
  font-size: 0.85rem;
  margin-bottom: 20px;
}

.modal-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #555060;
  margin-bottom: 14px;
}

.modal-form input,
.modal-form select {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 0.9rem;
  outline: 0;
}

.modal-form input:focus,
.modal-form select:focus {
  border-color: var(--violet);
}

.modal-submit {
  width: 100%;
  margin-top: 10px;
}

.success-modal-state {
  text-align: center;
  padding: 20px 0;
}

.success-check {
  width: 50px;
  height: 50px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--violet);
  color: white;
  font-weight: 900;
  font-size: 1.4rem;
}

@media (max-width: 1120px) {
  .counselling-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .cta-actions {
    width: 100%;
  }
  .button-white, .button-ghost-white {
    width: 100%;
  }
}

@media (max-width: 760px) {
  .section {
    padding: 75px 20px;
  }
}
</style>

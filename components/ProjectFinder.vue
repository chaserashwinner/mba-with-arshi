<script setup lang="ts">
import { ref, computed } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const selectedExam = ref<string>('all');
const selectedBudget = ref<string>('all');
const selectedCity = ref<string>('all');
const targetPercentile = ref<number>(80);

const colleges = PORTFOLIO_DATA.colleges;

const filteredColleges = computed(() => {
  return colleges.filter(c => {
    if (selectedExam.value !== 'all' && c.exam !== selectedExam.value) {
      return false;
    }
    if (selectedBudget.value !== 'all' && c.budgetCategory !== selectedBudget.value) {
      return false;
    }
    if (selectedCity.value !== 'all' && c.city !== selectedCity.value) {
      return false;
    }
    if (targetPercentile.value < c.minPercentile) {
      return false;
    }
    return true;
  });
});

function handleFormSubmit() {
  // Smooth scroll to results
  const el = document.getElementById('college-results');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <section class="finder section" id="find-colleges">
    <div class="section-heading">
      <div>
        <span class="kicker">Start with your profile</span>
        <h2>Find colleges that fit you</h2>
      </div>
      <p>Choose what matters to you. The finder updates instantly and gives you a cleaner starting list.</p>
    </div>

    <div class="finder-shell">
      <form class="finder-form" id="college-form" @submit.prevent="handleFormSubmit">
        <div class="step-label">
          <span>01</span> YOUR DETAILS
        </div>

        <label for="exam-select">Entrance exam
          <select id="exam-select" v-model="selectedExam">
            <option value="all">Any exam</option>
            <option value="cat">CAT</option>
            <option value="xat">XAT</option>
            <option value="cmat">CMAT</option>
            <option value="mahcet">MAH CET</option>
            <option value="nmat">NMAT</option>
          </select>
        </label>

        <label for="percentile-range">Expected percentile
          <div class="range-wrap">
            <input 
              id="percentile-range" 
              type="range" 
              min="50" 
              max="99" 
              v-model.number="targetPercentile" 
            />
            <output id="percentile-value" for="percentile-range">{{ targetPercentile }}</output>
          </div>
        </label>

        <label for="budget-select">Total budget
          <select id="budget-select" v-model="selectedBudget">
            <option value="all">Any budget</option>
            <option value="low">Under ₹10 lakh</option>
            <option value="mid">₹10–20 lakh</option>
            <option value="high">₹20 lakh+</option>
          </select>
        </label>

        <label for="city-select">Preferred city
          <select id="city-select" v-model="selectedCity">
            <option value="all">Open to any city</option>
            <option value="mumbai">Mumbai</option>
            <option value="pune">Pune</option>
            <option value="delhi">Delhi NCR</option>
            <option value="bhopal">Bhopal</option>
            <option value="kolkata">Kolkata</option>
            <option value="goa">Goa</option>
          </select>
        </label>

        <button type="submit" class="button button-dark">
          Show my matches <span>→</span>
        </button>
      </form>

      <div class="finder-results" id="college-results">
        <div class="results-top">
          <div>
            <span class="step-label">
              <span>02</span> QUICK MATCHES
            </span>
            <h3>Your starting shortlist</h3>
          </div>
          <span class="match-count" id="match-count">{{ filteredColleges.length }} matches</span>
        </div>

        <div v-if="filteredColleges.length > 0" class="college-list" id="college-list">
          <div 
            v-for="college in filteredColleges" 
            :key="college.id" 
            class="college-card"
          >
            <div class="college-logo">
              {{ college.logoText }}
            </div>
            <div class="college-info">
              <h4>{{ college.name }}</h4>
              <p>{{ college.feeText }} • {{ college.avgPackage }} • {{ college.cityLabel }}</p>
            </div>
            <span class="college-arrow" aria-hidden="true">↗</span>
          </div>
        </div>

        <div v-else class="empty-state">
          <strong>No colleges match these filters</strong>
          <p>Try adjusting your expected percentile score or expanding your budget and city preferences.</p>
        </div>

        <p class="prototype-note">
          College cards demonstrate the UI. Cutoffs, fees and placements should be connected to verified admission data before launch.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.finder {
  background: white;
}

.section {
  padding: 110px max(5vw, 24px);
}

.section-heading {
  max-width: 1340px;
  margin: 0 auto 45px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 35px;
}

.section-heading h2 {
  margin: 10px 0 0;
  font-size: clamp(2.3rem, 4vw, 4.25rem);
  line-height: 1.02;
  letter-spacing: -0.055em;
  color: var(--ink);
}

.section-heading > p {
  max-width: 430px;
  margin: 0;
  color: var(--muted);
}

.finder-shell {
  max-width: 1340px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 400px 1fr;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(31, 17, 65, 0.08);
}

.finder-form {
  padding: 34px;
  display: flex;
  flex-direction: column;
  gap: 23px;
  color: white;
  background: var(--violet-dark);
}

.step-label {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--magenta);
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.11em;
}

.step-label span {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 0.58rem;
}

.finder-form .step-label {
  color: var(--acid);
}

.finder-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #cbc4da;
  font-size: 0.75rem;
  font-weight: 700;
}

.finder-form select {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  color: white;
  background: #27104e;
  outline: 0;
}

.finder-form select:focus {
  border-color: var(--acid);
}

.range-wrap {
  height: 49px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 13px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: #27104e;
}

.range-wrap input {
  width: 100%;
  accent-color: var(--acid);
}

.range-wrap output {
  width: 38px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  color: var(--ink);
  background: var(--acid);
  font-size: 0.72rem;
  font-weight: 900;
}

.finder-results {
  min-width: 0;
  padding: 34px;
  background: #fbfaff;
}

.results-top {
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.results-top h3 {
  margin: 11px 0 0;
  font-size: 1.65rem;
  letter-spacing: -0.04em;
  color: var(--ink);
}

.match-count {
  padding: 7px 11px;
  border-radius: 999px;
  color: var(--violet);
  background: #eee7ff;
  font-size: 0.68rem;
  font-weight: 850;
}

.college-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.college-card {
  padding: 19px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;
}

.college-card:hover {
  border-color: rgba(98, 36, 233, 0.45);
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(49, 24, 92, 0.08);
}

.college-logo {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: white;
  background: var(--violet);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.03em;
}

.college-card:nth-child(2n) .college-logo {
  background: var(--magenta);
}

.college-info h4 {
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.86rem;
  color: var(--ink);
}

.college-info p {
  margin: 0;
  color: var(--muted);
  font-size: 0.68rem;
}

.college-arrow {
  color: var(--violet);
  font-weight: 900;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 50px 20px;
  text-align: center;
  border: 1px dashed rgba(98, 36, 233, 0.25);
  border-radius: 14px;
  background: white;
}

.empty-state strong {
  display: block;
  margin-bottom: 5px;
  color: var(--ink);
}

.empty-state p {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
}

.prototype-note {
  margin: 18px 0 0;
  color: #8a8493;
  font-size: 0.68rem;
  line-height: 1.5;
}

@media (max-width: 1120px) {
  .finder-shell {
    grid-template-columns: 350px 1fr;
  }
  .college-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .section {
    padding: 75px 20px;
  }
  .section-heading {
    display: block;
    margin-bottom: 30px;
  }
  .section-heading > p {
    margin-top: 18px;
  }
  .finder-shell {
    grid-template-columns: 1fr;
  }
  .finder-form, .finder-results {
    padding: 25px 20px;
  }
}
</style>

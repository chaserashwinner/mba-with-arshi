<script setup lang="ts">
import { ref, computed } from 'vue';
import { PORTFOLIO_DATA, type CollegeOption } from '~/data/portfolio';

const colleges = PORTFOLIO_DATA.colleges;

const selectedExam = ref<string>('all');
const selectedBudget = ref<string>('all');
const selectedCity = ref<string>('all');
const targetPercentile = ref<number>(80);

const filteredColleges = computed<CollegeOption[]>(() => {
  return colleges.filter((c) => {
    if (selectedExam.value !== 'all' && c.exam !== selectedExam.value) return false;
    if (selectedBudget.value !== 'all' && c.budgetCategory !== selectedBudget.value) return false;
    if (selectedCity.value !== 'all' && c.city !== selectedCity.value) return false;
    if (targetPercentile.value < c.minPercentile) return false;
    return true;
  });
});

function handleReset() {
  selectedExam.value = 'all';
  selectedBudget.value = 'all';
  selectedCity.value = 'all';
  targetPercentile.value = 80;
}
</script>

<template>
  <section class="college-finder-section" id="find-colleges">
    <div class="finder-container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="eyebrow">
          <span class="line"></span>
          <span>03 — PROFILE DISCOVERY TOOL</span>
        </div>
        <h2>Find colleges that fit you.</h2>
        <p class="section-desc">
          Filter verified MBA colleges by entrance exam, percentile cutoff, total tuition fees, and campus city.
        </p>
      </div>

      <!-- Main Interactive Shell -->
      <div class="finder-shell">
        <!-- Filter Controls Sidebar / Top bar -->
        <aside class="finder-controls-panel">
          <div class="panel-header">
            <span class="panel-step"><span>01</span> PROFILE FILTERS</span>
            <h3>Set your criteria</h3>
          </div>

          <div class="filter-field">
            <label for="exam-select">Entrance exam</label>
            <select id="exam-select" v-model="selectedExam">
              <option value="all">All Entrance Exams</option>
              <option value="cat">CAT Exam</option>
              <option value="xat">XAT Exam</option>
              <option value="cmat">CMAT Exam</option>
              <option value="mahcet">MAH CET Exam</option>
              <option value="nmat">NMAT Exam</option>
            </select>
          </div>

          <div class="filter-field">
            <div class="range-header">
              <label for="percentile-range">Expected percentile</label>
              <span class="range-badge">{{ targetPercentile }}%</span>
            </div>
            <input 
              id="percentile-range" 
              type="range" 
              min="50" 
              max="99" 
              v-model.number="targetPercentile" 
              class="range-slider"
            />
          </div>

          <div class="filter-field">
            <label for="budget-select">Total tuition budget</label>
            <select id="budget-select" v-model="selectedBudget">
              <option value="all">Any Tuition Budget</option>
              <option value="low">Under ₹10 Lakhs</option>
              <option value="mid">₹10 Lakhs – ₹20 Lakhs</option>
              <option value="high">₹20 Lakhs+</option>
            </select>
          </div>

          <div class="filter-field">
            <label for="city-select">Preferred city</label>
            <select id="city-select" v-model="selectedCity">
              <option value="all">All Cities</option>
              <option value="mumbai">Mumbai</option>
              <option value="pune">Pune</option>
              <option value="delhi">Delhi NCR</option>
              <option value="bhopal">Bhopal</option>
              <option value="kolkata">Kolkata</option>
              <option value="goa">Goa</option>
            </select>
          </div>

          <button type="button" class="button button-secondary reset-btn" @click="handleReset">
            Reset Filters
          </button>
        </aside>

        <!-- Results Display Grid -->
        <main class="finder-results-panel">
          <div class="results-header">
            <div>
              <span class="panel-step"><span>02</span> MATCHING COLLEGES</span>
              <h3>Your shortlist</h3>
            </div>
            <span class="match-badge">{{ filteredColleges.length }} Options Found</span>
          </div>

          <!-- Cards Grid -->
          <div v-if="filteredColleges.length > 0" class="colleges-grid">
            <article 
              v-for="college in filteredColleges" 
              :key="college.id" 
              class="college-card"
            >
              <div class="card-head">
                <div class="logo-avatar">{{ college.logoText }}</div>
                <div class="college-title-block">
                  <span class="badge-tag">{{ college.badge }}</span>
                  <h4>{{ college.name }}</h4>
                </div>
              </div>

              <div class="card-metrics">
                <div class="metric-item">
                  <small>CUTOFF RANGE</small>
                  <strong>{{ college.minPercentile }}% – {{ college.maxPercentile }}%</strong>
                </div>
                <div class="metric-item">
                  <small>TOTAL FEE</small>
                  <strong>{{ college.feeText }}</strong>
                </div>
                <div class="metric-item highlight">
                  <small>AVG PACKAGE</small>
                  <strong>{{ college.avgPackage }}</strong>
                </div>
                <div class="metric-item">
                  <small>LOCATION</small>
                  <strong>📍 {{ college.cityLabel }}</strong>
                </div>
              </div>

              <div class="card-footer">
                <a href="#counselling" class="card-cta-btn">
                  Check Eligibility & Counsel ↗
                </a>
              </div>
            </article>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <span class="empty-icon">🔍</span>
            <h4>No colleges match your active criteria</h4>
            <p>Try lowering your expected percentile or selecting 'All Exams' / 'Any Budget'.</p>
            <button class="button button-primary" @click="handleReset">
              Reset Filters
            </button>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<style scoped>
.college-finder-section {
  padding: 100px max(5vw, 24px);
  background: var(--surface-light);
  color: var(--ink-light);
}

.finder-container {
  max-width: 1340px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 45px;
}

.section-header h2 {
  margin: 12px 0 0;
  font-size: clamp(2.3rem, 4vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 850;
}

.section-desc {
  max-width: 580px;
  color: var(--ink-light-muted);
  font-size: 1.05rem;
  line-height: 1.6;
  margin-top: 10px;
}

/* Finder Shell Layout */
.finder-shell {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 32px;
  align-items: start;
}

/* Sidebar Controls */
.finder-controls-panel {
  padding: 30px;
  border-radius: var(--radius-xl);
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.panel-header h3 {
  margin: 6px 0 0;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.panel-step {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  color: var(--primary);
}

.panel-step span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--primary-light);
  display: grid;
  place-items: center;
  font-size: 0.6rem;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-field label {
  font-size: 0.76rem;
  font-weight: 750;
  color: var(--ink-light-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.filter-field select {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--surface-light);
  color: var(--ink-light);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.filter-field select:focus {
  border-color: var(--primary);
}

.range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.range-badge {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 850;
}

.range-slider {
  width: 100%;
  accent-color: var(--primary);
  height: 6px;
  border-radius: 3px;
  background: var(--border-light);
  cursor: pointer;
}

.reset-btn {
  width: 100%;
  min-height: 44px;
  font-size: 0.82rem;
}

/* Results Grid */
.finder-results-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.results-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.results-header h3 {
  margin: 6px 0 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.match-badge {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.74rem;
  font-weight: 850;
}

.colleges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 22px;
}

.college-card {
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.college-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-bright);
  box-shadow: var(--shadow-md);
}

.card-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.logo-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary-light);
  color: var(--primary);
  display: grid;
  place-items: center;
  font-size: 0.78rem;
  font-weight: 900;
  flex-shrink: 0;
}

.college-title-block h4 {
  margin: 4px 0 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--ink-light);
  line-height: 1.3;
}

.badge-tag {
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  color: var(--primary);
  text-transform: uppercase;
}

.card-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--bg-light);
  border: 1px solid var(--border-light);
}

.metric-item small {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--ink-light-muted);
}

.metric-item strong {
  display: block;
  font-size: 0.86rem;
  color: var(--ink-light);
  margin-top: 2px;
}

.metric-item.highlight strong {
  color: var(--primary);
}

.card-footer {
  margin-top: auto;
}

.card-cta-btn {
  display: block;
  text-align: center;
  padding: 10px;
  border-radius: var(--radius-md);
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.82rem;
  font-weight: 750;
  transition: all 0.2s ease;
}

.card-cta-btn:hover {
  background: var(--primary);
  color: #ffffff;
}

.empty-state {
  padding: 60px 24px;
  text-align: center;
  border-radius: var(--radius-xl);
  background: var(--bg-light);
  border: 1px dashed var(--border-light);
}

.empty-icon {
  font-size: 2.2rem;
  display: block;
  margin-bottom: 12px;
}

.empty-state h4 {
  margin: 0 0 8px;
  font-size: 1.2rem;
}

.empty-state p {
  color: var(--ink-light-muted);
  font-size: 0.9rem;
  margin-bottom: 20px;
}

@media (max-width: 1024px) {
  .finder-shell {
    grid-template-columns: 1fr;
  }
}
</style>

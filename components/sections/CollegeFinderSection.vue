<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowUpRightIcon, MapPinIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/vue/20/solid';
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

const percentileFill = computed(() => `${((targetPercentile.value - 50) / (99 - 50)) * 100}%`);

function handleReset() {
  selectedExam.value = 'all';
  selectedBudget.value = 'all';
  selectedCity.value = 'all';
  targetPercentile.value = 80;
}
</script>

<template>
  <section class="college-finder-section" id="find-colleges" aria-labelledby="finder-heading">
    <div class="finder-container">
      <!-- Section Header -->
      <div v-reveal="{ stagger: true }" class="section-header">
        <div class="eyebrow">
          <span class="line"></span>
          <span>03 — PROFILE DISCOVERY TOOL</span>
        </div>
        <h2 id="finder-heading">Find colleges that <em class="serif-italic">fit you.</em></h2>
        <p class="section-desc">
          Filter verified MBA colleges by entrance exam, percentile cutoff, total tuition fees, and campus city.
        </p>
      </div>

      <!-- Main Interactive Shell -->
      <div v-reveal="{ variant: 'up', delay: 100 }" class="finder-shell">
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
              :style="{ '--fill': percentileFill }"
              :aria-valuetext="`${targetPercentile} percentile`"
            />
            <div class="range-scale" aria-hidden="true"><span>50</span><span>99</span></div>
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
            <ArrowPathIcon class="btn-icon btn-icon--static reset-icon" aria-hidden="true" />
            Reset Filters
          </button>
        </aside>

        <!-- Results Display Grid -->
        <div class="finder-results-panel">
          <div class="results-header">
            <div>
              <span class="panel-step"><span>02</span> MATCHING COLLEGES</span>
              <h3>Your shortlist</h3>
            </div>
            <span class="match-badge" role="status" aria-live="polite">
              <Transition name="count" mode="out-in">
                <span :key="filteredColleges.length">{{ filteredColleges.length }}</span>
              </Transition>
              Options Found
            </span>
          </div>

          <!-- Cards Grid (FLIP-animated as filters change) -->
          <TransitionGroup
            v-if="filteredColleges.length > 0"
            tag="div"
            name="college"
            class="colleges-grid"
          >
            <article
              v-for="(college, i) in filteredColleges"
              :key="college.id"
              class="college-card"
              :style="{ '--i': i }"
            >
              <div class="card-head">
                <div class="logo-avatar" aria-hidden="true">{{ college.logoText }}</div>
                <div class="college-title-block">
                  <span class="badge-tag">{{ college.badge }}</span>
                  <h4>{{ college.name }}</h4>
                </div>
              </div>

              <dl class="card-metrics">
                <div class="metric-item">
                  <dt>CUTOFF RANGE</dt>
                  <dd>{{ college.minPercentile }}% – {{ college.maxPercentile }}%</dd>
                </div>
                <div class="metric-item">
                  <dt>TOTAL FEE</dt>
                  <dd>{{ college.feeText }}</dd>
                </div>
                <div class="metric-item highlight">
                  <dt>AVG PACKAGE</dt>
                  <dd>{{ college.avgPackage }}</dd>
                </div>
                <div class="metric-item">
                  <dt>LOCATION</dt>
                  <dd class="location"><MapPinIcon aria-hidden="true" /> {{ college.cityLabel }}</dd>
                </div>
              </dl>

              <div class="card-footer">
                <a href="#counselling" class="card-cta-btn">
                  Check Eligibility &amp; Counsel
                  <ArrowUpRightIcon class="btn-icon btn-icon--diag" aria-hidden="true" />
                </a>
              </div>
            </article>
          </TransitionGroup>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <span class="empty-icon" aria-hidden="true"><MagnifyingGlassIcon /></span>
            <h4>No colleges match your active criteria</h4>
            <p>Try lowering your expected percentile or selecting 'All Exams' / 'Any Budget'.</p>
            <button class="button button-primary" @click="handleReset">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.college-finder-section {
  padding: clamp(80px, 11vw, 120px) max(5vw, 20px);
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
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 850;
  text-wrap: balance;
}

.section-desc {
  max-width: 580px;
  color: var(--ink-light-muted);
  font-size: 1.05rem;
  line-height: 1.6;
  margin-top: 14px;
}

/* Finder Shell Layout */
.finder-shell {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}

/* Sidebar Controls */
.finder-controls-panel {
  position: sticky;
  top: calc(var(--header-h) + 20px);
  padding: 28px;
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
  background: #ede9fe;
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
  font-size: 0.74rem;
  font-weight: 750;
  color: var(--ink-light-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.filter-field select {
  width: 100%;
  height: 48px;
  padding: 0 40px 0 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(18, 14, 28, 0.12);
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%235e576d'%3E%3Cpath fill-rule='evenodd' d='M5.2 7.2a.75.75 0 0 1 1.06.02L10 11.17l3.74-3.95a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z' clip-rule='evenodd'/%3E%3C/svg%3E")
      no-repeat right 12px center / 18px,
    var(--surface-light);
  -webkit-appearance: none;
  appearance: none;
  color: var(--ink-light);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
}

.filter-field select:hover {
  border-color: rgba(124, 58, 237, 0.35);
}

.filter-field select:focus-visible {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.15);
}

.range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.range-badge {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: #ffffff;
  font-size: 0.74rem;
  font-weight: 850;
  font-variant-numeric: tabular-nums;
}

/* Custom range: filled track + large thumb (44px hit area on touch) */
.range-slider {
  --fill: 60%;
  width: 100%;
  height: 28px;
  margin: 0;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.range-slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--primary) var(--fill), rgba(18, 14, 28, 0.1) var(--fill));
}

.range-slider::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(18, 14, 28, 0.1);
}

.range-slider::-moz-range-progress {
  height: 6px;
  border-radius: 3px;
  background: var(--primary);
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  margin-top: -8px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--primary);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) ease;
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--primary);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.range-slider:hover::-webkit-slider-thumb,
.range-slider:active::-webkit-slider-thumb {
  transform: scale(1.15);
}

.range-slider:focus-visible {
  outline: none;
}

.range-slider:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.22);
}

.range-scale {
  display: flex;
  justify-content: space-between;
  font-size: 0.66rem;
  font-weight: 700;
  color: var(--ink-light-muted);
  margin-top: -4px;
}

.reset-btn {
  width: 100%;
  min-height: 46px;
  font-size: 0.82rem;
}

.reset-icon {
  transition: transform 500ms var(--ease-out);
}

.reset-btn:hover .reset-icon {
  transform: rotate(-180deg);
}

/* Results Grid */
.finder-results-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.results-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.results-header h3 {
  margin: 6px 0 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.match-badge {
  display: inline-flex;
  gap: 5px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: #ede9fe;
  color: var(--primary-hover);
  font-size: 0.74rem;
  font-weight: 850;
  font-variant-numeric: tabular-nums;
}

.count-enter-active,
.count-leave-active {
  display: inline-block;
  transition: opacity 160ms ease, transform 160ms var(--ease-out);
}
.count-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.count-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.colleges-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 20px;
}

.college-card {
  position: relative;
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 18px;
  isolation: isolate;
  transition:
    transform var(--dur-med) var(--ease-out),
    border-color var(--dur-med) ease,
    box-shadow var(--dur-med) var(--ease-out);
}

/* Gradient hairline that fades in on hover */
.college-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: radial-gradient(120% 80% at 100% 0%, rgba(139, 92, 246, 0.08), transparent 60%);
  opacity: 0;
  transition: opacity var(--dur-med) ease;
}

@media (hover: hover) and (pointer: fine) {
  .college-card:hover {
    transform: translate3d(0, -6px, 0);
    border-color: rgba(139, 92, 246, 0.45);
    box-shadow: 0 22px 44px -20px rgba(76, 29, 149, 0.35);
  }
  .college-card:hover::before {
    opacity: 1;
  }
  .college-card:hover .logo-avatar {
    background: var(--primary);
    color: #ffffff;
    transform: rotate(-6deg);
  }
}

/* List transitions (enter staggered, FLIP move) */
.college-enter-active {
  transition:
    opacity 420ms var(--ease-out) calc(var(--i, 0) * 40ms),
    transform 420ms var(--ease-out) calc(var(--i, 0) * 40ms);
}
.college-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.college-enter-from {
  opacity: 0;
  transform: translate3d(0, 16px, 0) scale(0.98);
}
.college-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
.college-move {
  transition: transform 480ms var(--ease-out);
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
  background: #ede9fe;
  color: var(--primary);
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 900;
  flex-shrink: 0;
  transition:
    background-color var(--dur-med) ease,
    color var(--dur-med) ease,
    transform var(--dur-med) var(--ease-out);
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
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--bg-light);
  border: 1px solid var(--border-light);
}

.metric-item dt {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--ink-light-muted);
}

.metric-item dd {
  margin: 2px 0 0;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--ink-light);
}

.metric-item dd.location {
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-item dd.location svg {
  width: 14px;
  height: 14px;
  color: var(--primary);
  flex: none;
}

.metric-item.highlight dd {
  color: var(--primary);
}

.card-footer {
  margin-top: auto;
}

.card-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 10px;
  border-radius: var(--radius-md);
  background: #f3f0ff;
  color: var(--primary-hover);
  font-size: 0.82rem;
  font-weight: 750;
  transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease;
}

.card-cta-btn:hover,
.card-cta-btn:focus-visible {
  background: var(--primary);
  color: #ffffff;
}

.card-cta-btn:hover .btn-icon,
.card-cta-btn:focus-visible .btn-icon {
  transform: translate(3px, -3px);
}

.empty-state {
  padding: 60px 24px;
  text-align: center;
  border-radius: var(--radius-xl);
  background: var(--bg-light);
  border: 1px dashed rgba(18, 14, 28, 0.16);
}

.empty-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #ede9fe;
  color: var(--primary);
}

.empty-icon svg {
  width: 24px;
  height: 24px;
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
  .finder-controls-panel {
    position: static;
  }
}

@media (max-width: 640px) {
  .finder-controls-panel {
    padding: 22px;
  }
  .college-card {
    padding: 20px;
  }
}
</style>

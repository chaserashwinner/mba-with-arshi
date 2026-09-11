<script setup lang="ts">
import { PORTFOLIO_DATA } from '~/data/portfolio';

const categories = PORTFOLIO_DATA.skills;
</script>

<template>
  <section class="skills-section section" id="skills">
    <div class="section-heading">
      <div>
        <span class="kicker">Core Expertise</span>
        <h2>Skills & Tech Ecosystem</h2>
      </div>
      <p>Organized by core domain. Clean presentation of frameworks, languages, systems, and developer tools.</p>
    </div>

    <div class="skills-grid">
      <div 
        v-for="cat in categories" 
        :key="cat.title" 
        class="skill-category-card"
      >
        <div class="category-header">
          <span class="category-icon">✦</span>
          <h3>{{ cat.title }}</h3>
        </div>
        <div class="skills-chips">
          <div 
            v-for="skill in cat.skills" 
            :key="skill.name" 
            class="skill-item"
          >
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-tag" :class="skill.tag.toLowerCase()">{{ skill.tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
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

.skills-grid {
  max-width: 1340px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.skill-category-card {
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: #fbfaff;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.skill-category-card:hover {
  transform: translateY(-4px);
  border-color: rgba(98, 36, 233, 0.35);
  box-shadow: 0 16px 40px rgba(49, 24, 92, 0.06);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.category-icon {
  color: var(--violet);
  font-size: 1.1rem;
}

.category-header h3 {
  margin: 0;
  font-size: 1.22rem;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.skills-chips {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-item {
  padding: 10px 14px;
  border: 1px solid rgba(17, 16, 25, 0.08);
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.skill-name {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--ink);
}

.skill-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skill-tag.expert {
  background: #eee7ff;
  color: var(--violet);
}

.skill-tag.advanced {
  background: #e4f7ff;
  color: #0066aa;
}

.skill-tag.intermediate {
  background: #f4f4f5;
  color: #555566;
}

@media (max-width: 1120px) {
  .skills-grid {
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
}
</style>

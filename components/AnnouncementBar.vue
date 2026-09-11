<template>
  <div class="announcement">
    <span>Admissions 2026</span>
    <p>College shortlisting support is now open</p>
    <a href="#counselling">
      Book a guidance call <span aria-hidden="true">↗</span>
    </a>
  </div>
</template>

<style scoped>
.announcement {
  min-height: 38px;
  padding: 7px 5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: white;
  background: var(--ink);
  font-size: 0.82rem;
  z-index: 40;
  position: relative;
}

.announcement span:first-child {
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--acid);
  color: var(--ink);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
}

.announcement p {
  margin: 0;
  color: #d7d3e0;
}

.announcement a {
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
  color: white;
  transition: color 0.2s ease;
}

.announcement a:hover {
  color: var(--acid);
}

@media (max-width: 760px) {
  .announcement {
    justify-content: space-between;
    padding-inline: 16px;
  }
  .announcement p {
    display: none;
  }
}
</style>

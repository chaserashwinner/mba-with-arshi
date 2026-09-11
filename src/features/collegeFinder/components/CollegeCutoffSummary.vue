<script setup>
const props = defineProps({
  summary: {
    type: Object,
    default: null,
  },
});

const EMPTY_CELL = "\u2014";

const CATEGORY_ORDER = ["OPEN", "EWS", "OBC", "SC", "ST"];

const SUMMARY_METADATA_KEYS = new Set([
  "_id",
  "createdAt",
  "lastSyncedAt",
  "lastUpdatedAt",
  "updatedAt",
  "id",
  "__v",
]);

const numberFormatter = new Intl.NumberFormat("en-IN");

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeToken = (value = "") =>
  String(value)
    .toUpperCase()
    .replace(/[._,/()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeCategory = (value = "") => {
  const tokens = normalizeToken(value).split(" ").filter(Boolean);

  if (tokens.includes("EWS")) return "EWS";
  if (tokens.includes("OBC") || tokens.includes("BC")) return "OBC";
  if (tokens.includes("SC")) return "SC";
  if (tokens.includes("ST")) return "ST";
  if (
    tokens.includes("OPEN") ||
    tokens.includes("GENERAL") ||
    tokens.includes("GEN") ||
    tokens.includes("UR") ||
    tokens.includes("URL")
  ) {
    return "OPEN";
  }

  return "";
};

const isYearKey = (value) => /^(19|20)\d{2}$/.test(String(value || ""));

const hasYearBuckets = (quotaSummary) =>
  isPlainObject(quotaSummary) &&
  Object.keys(quotaSummary).some((key) => isYearKey(key) && isPlainObject(quotaSummary?.[key]));

const getYearSummary = (quotaSummary, year) => {
  if (!isPlainObject(quotaSummary)) return null;

  if (isPlainObject(quotaSummary?.[year])) {
    return quotaSummary?.[year];
  }

  if (!hasYearBuckets(quotaSummary) && year === "2025") {
    return quotaSummary;
  }

  return null;
};

const getCategoryCutoff = (yearSummary, category) => {
  if (!isPlainObject(yearSummary)) return null;

  if (yearSummary?.[category] !== undefined) return yearSummary?.[category];

  const matchingKey = Object.keys(yearSummary || {}).find(
    (key) => normalizeCategory(key) === category || key === category,
  );

  return matchingKey ? yearSummary?.[matchingKey] : null;
};

const getPositiveNumber = (...values) => {
  for (const value of values) {
    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return null;
};

const formatRankValue = (cutoff) => {
  if (!cutoff) return EMPTY_CELL;

  if (!isPlainObject(cutoff)) {
    const closing = getPositiveNumber(cutoff);
    return closing ? numberFormatter.format(closing) : EMPTY_CELL;
  }

  const closing = getPositiveNumber(
    cutoff?.closingRank,
    cutoff?.closing_rank,
    cutoff?.closing,
  );

  return closing ? numberFormatter.format(closing) : EMPTY_CELL;
};

const titleCase = (value = "") => {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const authorityLabel = (key) => {
  const labels = {
    allIndia: "All India",
    all_india: "All India",
    allIndiaQuota: "All India",
    aiq: "All India",
    state: "State",
    stateQuota: "State",
    state_quota: "State",
    deemed: "Deemed",
    management: "Management",
  };
  return labels[key] || titleCase(key);
};

const getCategoriesForAuthority = (authoritySummary) => {
  const categories = new Set();
  if (hasYearBuckets(authoritySummary)) {
    Object.values(authoritySummary).forEach((yearSummary) => {
      if (isPlainObject(yearSummary)) {
        Object.keys(yearSummary).forEach((cat) => {
          const norm = normalizeCategory(cat) || cat;
          categories.add(norm);
        });
      }
    });
  } else {
    Object.keys(authoritySummary).forEach((cat) => {
      const norm = normalizeCategory(cat) || cat;
      categories.add(norm);
    });
  }
  return Array.from(categories);
};

const sortCategories = (cats) => {
  return [...cats].sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a);
    const idxB = CATEGORY_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });
};

const tables = computed(() => {
  if (!isPlainObject(props.summary)) return [];

  const result = [];

  const authorityKeys = Object.keys(props.summary).filter((key) => {
    return !SUMMARY_METADATA_KEYS.has(key) && isPlainObject(props.summary[key]);
  });

  const authOrder = ["allIndia", "all_india", "allIndiaQuota", "aiq", "state", "stateQuota", "state_quota"];
  authorityKeys.sort((a, b) => {
    const idxA = authOrder.indexOf(a);
    const idxB = authOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  for (const authKey of authorityKeys) {
    const authSummary = props.summary[authKey];

    let years = [];
    if (hasYearBuckets(authSummary)) {
      years = Object.keys(authSummary).filter(isYearKey);
    } else {
      years = ["2025"];
    }

    years.sort((a, b) => b.localeCompare(a));

    const rawCategories = getCategoriesForAuthority(authSummary);
    if (rawCategories.length === 0) continue;

    const sortedCategories = sortCategories(rawCategories);

    const columns = sortedCategories.map((catKey) => {
      const labels = {
        OPEN: "General",
        EWS: "EWS",
        OBC: "OBC",
        SC: "SC",
        ST: "ST",
      };
      return {
        key: catKey,
        label: labels[catKey] || titleCase(catKey),
      };
    });

    const rows = years.map((year) => {
      const yearSummary = getYearSummary(authSummary, year);
      const cells = columns.map((col) => {
        const value = formatRankValue(getCategoryCutoff(yearSummary, col.key));
        return {
          key: col.key,
          value,
        };
      });
      return {
        year,
        cells,
      };
    });

    result.push({
      authorityKey: authKey,
      label: authorityLabel(authKey),
      columns,
      rows,
    });
  }

  return result;
});
</script>

<template>
  <div class="space-y-6">
    <div v-for="table in tables" :key="table.authorityKey" class="space-y-3">
      <h3 class="text-base font-black text-[var(--color-text-muted)]">
        {{ table.label }}
      </h3>

      <div class="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[42rem] border-collapse text-left text-sm" :aria-label="`${table.label} cutoff summary`">
            <thead>
              <tr class="border-b border-[var(--color-border)]">
                <th class="w-24 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                  Year
                </th>
                <th
                  v-for="col in table.columns"
                  :key="col.key"
                  class="px-4 py-3 text-sm font-black text-[var(--color-text)]"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-border)]">
              <tr v-for="row in table.rows" :key="row.year">
                <th class="px-4 py-3 text-sm font-black text-[var(--color-text)]" scope="row">
                  {{ row.year }}
                </th>
                <td
                  v-for="cell in row.cells"
                  :key="`${row.year}-${cell.key}`"
                  class="px-4 py-3 text-sm font-black text-[var(--color-text-muted)]"
                >
                  {{ cell.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ClipboardDocumentListIcon,
  GlobeAltIcon,
  HomeModernIcon,
  LanguageIcon,
} from "@heroicons/vue/24/solid";
import { MEDICAL_COUNSELLOR_PROFILE_ANALYSIS_URL } from "@/constants/counsellor";
import { formatFeeRange, getCoursesLabel, getRankingLabel } from "../utils/formatters";
import { useCounsellorQueryStore } from "@/stores/useCounsellorQueryStore";
import { MEDICAL_COURSE_ID } from "@/utils/courseMeta";

const props = defineProps({
  college: {
    type: Object,
    required: true,
  },
});

const { tr } = useAppI18n();
const counsellorQueryStore = useCounsellorQueryStore();
const authStore = useAuthStore();

const trackEvent = (name, params) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  } else {
    console.debug(`[Analytics Event Debug] ${name}:`, params);
  }
};

const handleTalkToCounsellor = () => {
  trackEvent("talk_to_counsellor_clicked", {
    entity_id: props.college?.id || props.college?._id || "",
    entity_name: props.college?.name || "",
    entity_type: "university",
    course: "medical",
    source: "Talk To Counsellor",
  });

  const metadata = {
    entityId: props.college?.id || props.college?._id || "",
    entityName: props.college?.name || "",
    entityType: "university",
    courseId: MEDICAL_COURSE_ID,
    courseName: "medical",
    source: "medicine_abroad",
    country: props.college?.country || "",
  };

  if (authStore.loggedIn) {
    trackEvent("query_modal_opened", {
      entity_id: metadata.entityId,
      entity_name: metadata.entityName,
      entity_type: metadata.entityType,
      course: metadata.courseName,
      source: metadata.source,
    });
    counsellorQueryStore.open(metadata);
  } else {
    counsellorQueryStore.setPendingAction(true);
    counsellorQueryStore.metadata = metadata;
    authStore.handleForm(true);
  }
};

const hostelLabel = computed(() => {
  if (props.college.hostel?.available === true) {
    return tr("medicineAbroad.filters.yes", "Yes");
  }

  if (props.college.hostel?.available === false) {
    return tr("medicineAbroad.filters.no", "No");
  }

  return "N/A";
});

const quickFacts = computed(() =>
  [
    {
      label: tr("medicineAbroad.detail.coursesOffered", "Courses offered"),
      value: getCoursesLabel(props.college),
    },
    {
      label: tr("medicineAbroad.detail.country", "Country"),
      value: props.college.country || "N/A",
    },
    {
      label: tr("medicineAbroad.detail.medium", "Medium"),
      value: props.college.medium || "N/A",
    },
    {
      label: tr("medicineAbroad.detail.duration", "Duration"),
      value: props.college.duration || "N/A",
    },
    {
      label: tr("medicineAbroad.detail.fees", "Fees"),
      value: formatFeeRange(props.college.fees),
    },
    {
      label: tr("medicineAbroad.detail.ranking", "Ranking"),
      value: getRankingLabel(props.college),
    },
    {
      label: tr("medicineAbroad.detail.hostel", "Hostel"),
      value: hostelLabel.value,
    },
  ].filter((fact) => fact.value),
);

const readinessItems = computed(() =>
  [
    props.college.hostel?.available
      ? {
          icon: HomeModernIcon,
          label: tr("medicineAbroad.detail.hostelSupport", "Hostel support"),
        }
      : null,
    props.college.medium
      ? {
          icon: LanguageIcon,
          label: props.college.medium,
        }
      : null,
    props.college.recognition?.length
      ? {
          icon: GlobeAltIcon,
          label: props.college.recognition.slice(0, 2).join(", "),
        }
      : null,
  ].filter(Boolean),
);
</script>

<template>
  <aside class="space-y-4">
    <div class="surface-panel rounded-2xl p-5">
      <div class="flex items-center gap-3">
        <div class="grid h-11 w-11 place-items-center rounded-2xl text-white" style="background-image: var(--gradient-primary);">
          <ClipboardDocumentListIcon class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-black text-[var(--color-text)]">
            {{ tr("medicineAbroad.detail.quickFacts", "Quick facts") }}
          </h2>
          <p class="text-xs font-bold text-[var(--color-text-soft)]">
            {{ [college.city, college.country].filter(Boolean).join(", ") }}
          </p>
        </div>
      </div>

      <div class="mt-5 divide-y divide-[var(--color-border)]">
        <div
          v-for="fact in quickFacts"
          :key="fact.label"
          class="flex justify-between gap-4 py-3 text-sm"
        >
          <span class="font-bold text-[var(--color-text-soft)]">{{ fact.label }}</span>
          <span class="text-right font-black text-[var(--color-text)]">{{ fact.value }}</span>
        </div>
      </div>
    </div>

    <div class="surface-panel rounded-2xl p-5">
      <h3 class="text-lg font-black text-[var(--color-text)]">
        {{ tr("medicineAbroad.detail.studentReadiness", "Student readiness") }}
      </h3>
      <div class="mt-4 space-y-3 text-sm font-bold text-[var(--color-text-muted)]">
        <p
          v-for="item in readinessItems"
          :key="item.label"
          class="flex items-center gap-2"
        >
          <component :is="item.icon" class="h-4 w-4 text-[var(--color-primary)]" />
          {{ item.label }}
        </p>
        <p v-if="!readinessItems.length" class="text-sm font-bold text-[var(--color-text-muted)]">
          N/A
        </p>
      </div>
    </div>

    <button
      class="sk-button-primary w-full"
      @click.prevent="handleTalkToCounsellor"
    >
      {{ tr("home.finalCta.talkToCounsellor", "Talk to Counsellor") }}
    </button>
  </aside>
</template>

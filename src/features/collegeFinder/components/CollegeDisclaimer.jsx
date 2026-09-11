import { defineComponent, h } from "vue";
import {
  EnvelopeIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/solid";

const baseClass =
  "rounded-2xl border border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] p-4 shadow-[0_20px_44px_-34px_var(--color-shadow)] sm:p-5";

export default defineComponent({
  name: "CollegeDisclaimer",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: "Disclaimer",
    },
    description: {
      type: String,
      default:
        "StudentKhabri keeps this information synced from publicly available sources and counselling data. If you find any information inaccurate or outdated, please report it to us.",
    },
    actionLabel: {
      type: String,
      default: "Report Issue",
    },
    actionHref: {
      type: String,
      default: "mailto:support@studentkhabri.com",
    },
  },
  setup(props, { attrs }) {
    return () => {
      const sectionAttrs = { ...attrs };
      const extraClass = sectionAttrs.class;
      delete sectionAttrs.class;

      return h(
        "section",
        {
          ...sectionAttrs,
          class: [baseClass, extraClass],
          "aria-label":
            sectionAttrs["aria-label"] || "College information disclaimer",
        },
        [
          h(
            "div",
            {
              class:
                "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
            },
            [
              h("div", { class: "flex min-w-0 gap-3" }, [
                h(
                  "span",
                  {
                    class:
                      "grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[var(--color-warning-border)] bg-[var(--color-surface)] text-[var(--color-warning)]",
                    "aria-hidden": "true",
                  },
                  [h(InformationCircleIcon, { class: "h-5 w-5" })],
                ),
                h(
                  "p",
                  {
                    class:
                      "text-sm font-semibold leading-6 text-[var(--color-text-muted)]",
                  },
                  [
                    h(
                      "span",
                      { class: "font-black text-[var(--color-text)]" },
                      `${props.label}:`,
                    ),
                    " ",
                    props.description,
                  ],
                ),
              ]),
              h(
                "a",
                {
                  href: props.actionHref,
                  class:
                    "sk-button-secondary w-full shrink-0 justify-center px-4 py-2.5 text-xs sm:w-auto",
                },
                [
                  h(EnvelopeIcon, { class: "h-4 w-4" }),
                  props.actionLabel,
                ],
              ),
            ],
          ),
        ],
      );
    };
  },
});

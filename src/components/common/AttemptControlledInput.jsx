import { computed, defineComponent, h } from "vue";

const normalizePreviousInputs = inputs =>
  Array.isArray(inputs)
    ? inputs
        .map(value => Number(value))
        .filter(value => Number.isFinite(value))
    : [];

export default defineComponent({
  name: "AttemptControlledInput",
  props: {
    attempts: {
      type: Object,
      default: () => ({}),
    },
    inputConfig: {
      type: Object,
      default: () => ({ type: "rank" }),
    },
    previousInputs: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: "",
    },
    onChange: {
      type: Function,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: "",
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const isExhausted = computed(() => props.attempts?.isExhausted === true);
    const inputType = computed(() =>
      props.inputConfig?.type === "score" ? "score" : "rank",
    );
    const label = computed(() => (inputType.value === "score" ? "Score" : "Rank"));
    const options = computed(() => normalizePreviousInputs(props.previousInputs));
    const placeholder = computed(() =>
      isExhausted.value
        ? `Select Previous ${label.value}`
        : `Enter ${label.value}`,
    );

    const emitValue = rawValue => {
      const numericValue = Number(rawValue);
      const nextValue =
        rawValue === "" ? "" : Number.isFinite(numericValue) ? numericValue : "";

      emit("update:value", nextValue);

      if (typeof props.onChange === "function") {
        props.onChange(nextValue);
      }
    };

    return () =>
      h(
        "div",
        {
          class: [
            "attempt-controlled-input",
            "w-full",
            "flex",
            "flex-col",
            props.className,
          ],
        },
        [
          h("label", { class: "text-sm font-medium mb-1" }, label.value),
          isExhausted.value
            ? h(
                "select",
                {
                  class: "primary-select",
                  value: props.value ?? "",
                  required: true,
                  disabled: props.disabled || options.value.length === 0,
                  onChange: event => emitValue(event.target.value),
                },
                [
                  h(
                    "option",
                    {
                      value: "",
                      disabled: true,
                    },
                    placeholder.value,
                  ),
                  ...options.value.map(previousValue =>
                    h(
                      "option",
                      {
                        key: previousValue,
                        value: previousValue,
                      },
                      String(previousValue),
                    ),
                  ),
                ],
              )
            : h("input", {
                type: "number",
                class: "input-app px-2 py-2",
                value: props.value ?? "",
                placeholder: placeholder.value,
                required: true,
                disabled: props.disabled,
                onInput: event => emitValue(event.target.value),
              }),
        ],
      );
  },
});

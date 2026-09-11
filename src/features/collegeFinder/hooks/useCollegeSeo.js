import { useHead } from "#app";
import { toValue } from "vue";

export const useCollegeSeo = ({ title, description, image, url }) => {
  useHead(() => ({
    title: toValue(title),
    meta: [
      {
        name: "description",
        content: toValue(description),
      },
      {
        property: "og:title",
        content: toValue(title),
      },
      {
        property: "og:description",
        content: toValue(description),
      },
      ...(toValue(image)
        ? [
            {
              property: "og:image",
              content: toValue(image),
            },
          ]
        : []),
    ],
    link: toValue(url)
      ? [
          {
            key: "canonical",
            rel: "canonical",
            href: toValue(url),
          },
        ]
      : [],
  }));
};

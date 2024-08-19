import type { NuxtApp } from "#app";

export const usePages = createNuxtGlobalState(
  (nuxtApp: NuxtApp = useNuxtApp()) => {
    return useFims("/pages", {
      query: {
        page: 0,
        filter: "",
        size: 99999999,
      },
    });
  },
);

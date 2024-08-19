export const usePages = createNuxtGlobalState(() => {
  return useFims("/pages", {
    query: {
      page: 0,
      filter: "",
      size: 99999999,
    },
  });
});

import { createNuxtGlobalState, ref } from "#imports";

export const useTestState = createNuxtGlobalState(function () {
  const count = ref(0);
  const increment = () => count.value++;
  return { count, increment };
});

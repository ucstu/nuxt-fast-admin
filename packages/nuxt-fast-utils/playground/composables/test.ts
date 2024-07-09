export const useTestState = createNuxtGlobalState(() => {
  const count = ref(0);
  const increment = () => count.value++;
  return { count, increment };
});

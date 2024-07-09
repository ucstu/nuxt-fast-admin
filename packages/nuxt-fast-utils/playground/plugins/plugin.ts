import { useTestState } from "~/composables/test";

export default defineNuxtPlugin({
  setup(nuxtApp) {
    useTestState();
  },
});

import { defineNuxtPlugin } from "#app";
import { useTestState } from "../composables/test";

export default defineNuxtPlugin({
  setup() {
    useTestState();
  },
});

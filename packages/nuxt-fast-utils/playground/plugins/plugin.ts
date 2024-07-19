import { defineNuxtPlugin } from "#app";
import { useTestState } from "../composables/test";

export default defineNuxtPlugin({
  setup() {
    const states = useTestState();
    console.log("states", states);
  },
});

<template>
  <slot v-bind="props" :src="src" style="border: none">
    <iframe v-bind="props" :src="src" style="border: none" />
  </slot>
</template>

<script lang="ts" setup>
import { computed, useRoute } from "#imports";

defineOptions({
  name: "FaPagesIframe",
});

type Booleanish = boolean | "true" | "false";
type Numberish = number | string;
type HTMLAttributeReferrerPolicy =
  | ""
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

/* eslint-disable vue/require-default-prop */
const props = withDefaults(
  defineProps<{
    allow?: string;
    allowfullscreen?: Booleanish;
    allowtransparency?: Booleanish;
    /** @deprecated */
    frameborder?: Numberish;
    height?: Numberish;
    /** @deprecated */
    marginheight?: Numberish;
    /** @deprecated */
    marginwidth?: Numberish;
    name?: string;
    referrerpolicy?: HTMLAttributeReferrerPolicy;
    sandbox?: string;
    /** @deprecated */
    scrolling?: string;
    seamless?: Booleanish;
    src?: string;
    srcdoc?: string;
    width?: Numberish;
  }>(),
  {
    sandbox:
      "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation",
    width: "100%",
    height: "100%",
    frameborder: 0,
  },
);
/* eslint-enable vue/require-default-prop */

const route = useRoute();
const src = computed(() => {
  return props.src ?? [route.query.url].flat()[0]?.toString();
});
</script>

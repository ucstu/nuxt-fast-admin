import withNuxt from "./.playground/.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "vue/valid-attribute-name": "off",
    "vue/multi-word-component-names": "off",
  },
});

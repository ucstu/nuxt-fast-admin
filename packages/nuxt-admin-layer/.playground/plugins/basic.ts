export default defineNuxtPlugin({
  enforce: "pre",
  async setup() {
    const adminConfig = useModuleConfig("fastAdmin");
    adminConfig.value.pages.auth.form.username = undefined;
  },
});

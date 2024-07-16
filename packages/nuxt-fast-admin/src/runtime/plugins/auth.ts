import { defineNuxtPlugin } from "#app";
import { useAuth } from "#imports";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const { signOut } = useAuth();
    nuxtApp.hook(
      "fast-admin:layout-default-header-dropdown-select",
      async (index, option) => {
        if (option.key === "logout") {
          await signOut({ navigate: true });
        }
      }
    );
  },
});

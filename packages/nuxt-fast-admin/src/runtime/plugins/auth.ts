import { defineNuxtPlugin } from "#app";
import { authPage, useAuth } from "#imports";
import { authPageRef } from "../utils";

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
    authPageRef.value = authPage;
  },
});

import { defineNuxtPlugin, updateAppConfig } from "#app";
import { $auth, auth, useAuth } from "#imports";
import { syncRef } from "@ucstu/nuxt-fast-utils/exports";
import { _$auth, _auth, _token } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const { token, signOut } = useAuth();

    updateAppConfig({
      fastAdmin: {
        layouts: {
          default: {
            header: {
              dropdown: {
                options: [
                  {
                    label: "退出登录",
                    key: "logout",
                    icon: "material-symbols:logout",
                  },
                ],
              },
            },
          },
        },
      },
    });

    nuxtApp.hook(
      "fast-admin:layout-default-header-dropdown-select",
      async (index, option) => {
        if (option.key === "logout") {
          await signOut({ navigate: true });
        }
      },
    );

    syncRef(token, _token, { direction: "ltr" });
    _$auth.value = $auth;
    _auth.value = auth;
  },
});

import { defineNuxtPlugin, updateAppConfig } from "#app";
import { $auth, auth, useAuth } from "#imports";
import { _$auth, _auth } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const { signOut } = useAuth();

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

    _$auth.value = $auth;
    _auth.value = auth;
  },
});

import { defineNuxtPlugin, updateAppConfig } from "#app";
import { $auth, auth, useAuth, useModuleConfig } from "#imports";
import { configKey } from "../config";
import { _$auth, _auth } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(nuxtApp) {
    const { token, signOut } = useAuth();
    const adminConfig = useModuleConfig(configKey);

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

    nuxtApp.hook("fast-fetch:request", (api, options) => {
      const { name, type } = adminConfig.value.fetch.token;

      if (!token.value?.value) return;

      if (options.type === "legacy") {
        const { request } = options;
        if (Array.isArray(request.headers)) {
          request.headers.push([name, `${type} ${token.value.value}`]);
        } else if (request.headers instanceof Headers) {
          request.headers.set(name, `${type} ${token.value.value}`);
        } else {
          request.headers ??= {};
          request.headers[name] = `${type} ${token.value.value}`;
        }
      } else {
        const { request } = options;
        request.headers.set(name, `${type} ${token.value.value}`);
      }
    });

    _$auth.value = $auth;
    _auth.value = auth;
  },
});

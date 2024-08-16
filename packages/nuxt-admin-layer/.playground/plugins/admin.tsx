import { NSelect } from "#components";

export default defineNuxtPlugin({
  enforce: "pre",
  dependsOn: ["crud"],
  async setup() {
    const nuxtApp = useNuxtApp();
    const { refresh: refreshPages } = await usePages();
    const { user, status, changeRole } = useAuth();
    const adminConfig = useModuleConfig("fastAdmin");

    adminConfig.value.layouts.default.header.dropdown.options.push({
      icon: "mdi-account-switch",
      key: "switch-role",
      label: "切换角色",
    });

    nuxtApp.hook(
      "fast-admin:layout-default-header-dropdown-select",
      async (value, option) => {
        if (value === "switch-role") {
          const modal = $modal.create({
            title: "切换角色",
            preset: "card",
            style: {
              width: "400px",
            },
            content() {
              return (
                <NSelect
                  value={status.value.role}
                  options={[
                    {
                      label: "所有角色",
                      value: "*",
                    },
                  ].concat(
                    ...(user.value?.roles?.map((role) => ({
                      label: role.name,
                      value: role.code,
                    })) ?? [])
                  )}
                  onChange={(role) => {
                    changeRole(role);
                    modal.destroy();
                  }}
                />
              );
            },
          });
        }
      }
    );

    if (import.meta.dev) {
      adminConfig.value.layouts.default.header.dropdown.options.push({
        icon: "mdi:registered-trademark",
        key: "register-page",
        label: "注册页面",
      });
      nuxtApp.hook(
        "fast-admin:layout-default-header-dropdown-select",
        async (value, option) => {
          if (value === "register-page") {
            const options = useCrudOptions().value(nuxtApp.$fims)?.entries();
            for (const [key, option] of options ?? []) {
              await nuxtApp.$fims("/pages", {
                method: "POST",
                body: {
                  name: `${option.description}管理`,
                  path: `/crud/fims/${key}`,
                },
              });
            }
            await refreshPages();
          }
        }
      );
    }
  },
});

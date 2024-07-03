import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  enforce: "pre",
  hooks: {
    "fast-auth:sign-in": (form, result) => {
      result.value = {
        token: `token-${form.username}`,
        user: {
          roles: [form.username],
          permissions: ["*"],
        },
      };
    },
    "fast-auth:get-user": (token, result) => {
      result.value = {
        roles: [token?.replace("token-", "")].filter(Boolean),
        permissions: ["*"],
      };
    },
    "fast-auth:get-roles": (user, result) => {
      result.value = user?.roles || [];
    },
    "fast-auth:get-permissions": (user, result) => {
      result.value = user?.permissions || [];
    },
  },
});

import { defineAppConfig } from "#imports";

export default defineAppConfig({
  fastAuth: {
    authHooks: {
      signIn() {
        return {
          token: "token",
          refreshToken: "refreshToken",
        };
      },
      getUser() {
        return {
          id: 1,
          username: "admin",
        };
      },
      getPermissions() {
        return ["admin"];
      },
    },
  },
});

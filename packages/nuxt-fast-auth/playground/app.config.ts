import { defineAppConfig } from "#imports";

export default defineAppConfig({
  fastAuth: {
    page: {
      auth: {
        per: true,
      },
    },
  },
});

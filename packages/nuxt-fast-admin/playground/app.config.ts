import { defineAppConfig } from "#imports";

export default defineAppConfig({
  fastAdmin: {
    layouts: {
      default: {
        menu: {
          accordion: true,
        },
      },
    },
  },
  fastNav: {
    menus: [
      {
        name: "for",
        title: "for",
      },
      {
        name: "bar",
        title: "bar",
      },
    ] as const,
  },
});

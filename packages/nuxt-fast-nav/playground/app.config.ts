import { defineAppConfig } from "#imports";

export default defineAppConfig({
  fastNav: {
    menus: [
      {
        name: "for",
        title: "for",
        children: [
          {
            name: "test",
          },
        ],
      },
      {
        name: "bar",
        title: "bar",
        children: [
          {
            name: "test",
          },
        ],
      },
    ],
  },
});

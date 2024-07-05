import { defineAppConfig } from "#imports";

export default defineAppConfig({
  fastNav: {
    menus: [
      {
        key: "for",
        title: "for",
        children: [
          {
            key: "test",
          },
        ],
      },
      {
        key: "bar",
        title: "bar",
        children: [
          {
            key: "test",
          },
        ],
      },
    ],
  },
});

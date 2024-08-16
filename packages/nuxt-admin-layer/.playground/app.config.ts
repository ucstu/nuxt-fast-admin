export default defineAppConfig({
  fastAdmin: {
    logo: "/favicon.ico",
    name: "FIMS 柔性智造系统",
    layouts: {
      default: {
        header: {
          fullscreen: true,
        },
        menu: {
          collapsed: false,
        },
      },
    },
    pages: {
      auth: {
        forget: false,
        register: false,
        picture: "/images/pages/auth/picture.png",
      },
    },
    fetch: {
      status: "status",
      message: "detail",
      error: {
        handler: "notify",
      },
    },
    error: {
      handler: "notify",
    },
  },
});

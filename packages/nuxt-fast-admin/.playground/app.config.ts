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
          email: "foo@bar.com",
        };
      },
      getPermissions(user) {
        return user ? ["admin"] : [];
      },
    },
  },
  fastCrud: {
    fsSetupOptions: {
      commonOptions() {
        return {
          request: {
            transformRes({ res }) {
              return {
                currentPage: 1,
                pageSize: 10,
                records: res as Array<any>,
                total: res.length,
              };
            },
          },
        };
      },
    },
  },
  fastNav: {
    menus: [
      {
        key: "for",
        title: "for",
      },
      {
        key: "bar",
        title: "bar",
      },
    ],
  },
});

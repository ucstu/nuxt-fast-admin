import type { FsAuthMeta, FsAuthPage } from "@ucstu/nuxt-fast-auth/types";
import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { LoadingBarApiInjection } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
import type { ModalApiInjection } from "naive-ui/lib/modal/src/ModalProvider";
import type { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";
import type { UnknownRecord } from "type-fest";
import type { ErrorLevel, FetchConfig } from "./types/base";
import type { FsAdminConfig } from "./types/config";

const IGNORE = ["auth"];

export default defineAppConfig({
  fastAdmin: {
    name: "Fast admin",
    logo: "/favicon.ico",
    app: {
      boundary: false,
      naiveConfig: {},
      head: true,
    },
    layouts: {
      default: {
        menu: { width: 272, collapsed: false, collapsedWidth: 56 },
        header: {
          show: true,
          reload: false,
          collapsed: true,
          breadcrumb: true,
          fullscreen: false,
          theme: false,
          dropdown: {
            show: true,
            avatar: "/images/layouts/default/header/avatar.svg",
            options: [
              {
                label: "退出登录",
                key: "logout",
                icon: "material-symbols:logout",
              },
            ],
            hooks: {
              async select(key) {
                const { signOut } = useAuth();
                if (key === "logout") {
                  await signOut({
                    navigate: true,
                  });
                }
              },
            },
          },
        },
        tabbar: { show: true, refresh: true, fullscreen: true, actions: true },
      },
    },
    pages: {
      auth: {
        forget: true,
        register: true,
        remember: true,
        picture: "/images/pages/auth/picture.png",
        background: "/images/pages/auth/background.png",
        hooks: {},
      },
    },
    hooks: {},
    fetch: {
      status: "code",
      message: "msg",
      token: {
        name: "Authorization",
        type: "Bearer",
      },
    },
    error: {
      handler: "message",
      level: "error",
      interval: 300,
      duration: 3000,
      propagate: true,
    },
  },
  fastNav: {
    hooks: {
      getPage(page) {
        const authConfig = useFuConfig("fastAuth");

        if (IGNORE.includes(page.name?.toString() ?? "undefined")) {
          return;
        }

        const raw = (page.auth ?? authConfig.value!.pages!.authMeta) as
          | FsAuthPage
          | FsAuthMeta;
        const auth: FsAuthMeta = isFsAuthPage(raw) ? raw.auth : raw;

        return {
          ...page,
          menu: {
            ...page.menu,
            show: page.menu.show && authDirect(auth),
          },
        };
      },
    },
  },
});

declare global {
  /* eslint-disable no-var */
  var $dialog: DialogApiInjection;
  var $loadingBar: LoadingBarApiInjection;
  var $message: MessageApiInjection;
  var $modal: ModalApiInjection;
  var $notification: NotificationApiInjection;
  /* eslint-enable no-var */
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastAdmin?: FsAdminConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastAdmin?: FsAdminConfig;
  }
}

declare module "ofetch" {
  interface FetchOptions {
    config?: FetchConfig;
  }
}

declare module "#app" {
  interface NuxtError {
    /**
     * 错误数据
     */
    data?: UnknownRecord & {
      /**
       * 错误等级
       * @default error
       */
      level?: ErrorLevel;
      /**
       * 错误详情
       */
      detail?: string;
    };
  }
}

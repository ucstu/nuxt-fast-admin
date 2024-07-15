import type { Nuxt } from "@nuxt/schema";
import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { LoadingBarApiInjection } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
import type { ModalApiInjection } from "naive-ui/lib/modal/src/ModalProvider";
import type { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";
import type {
  FetchOptions as _FetchOptions,
  ErrorLevel,
  ModuleConfig,
  ModuleConfigDefaults,
  ModuleOptions,
  ModuleOptionsDefaults,
} from "./types";

export const name = "@ucstu/nuxt-fast-admin";
export const version = "1.1.8";
export const configKey = "fastAdmin";

export const defaults: ModuleOptionsDefaults = {
  modules: [],
  features: {
    layouts: {
      full: true,
      default: true,
    },
    pages: {
      auth: true,
    },
  },
};

export const configs: ModuleConfigDefaults = {
  name: "Fast admin",
  logo: "/favicon.ico",
  app: {
    boundary: false,
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
          avatar: new URL(
            "./assets/images/pages/auth/avatar.png",
            import.meta.url
          ).href,
          options: [
            {
              label: "退出登录",
              key: "logout",
              icon: "material-symbols:logout",
            },
          ],
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
      picture: new URL(
        "./assets/images/pages/auth/picture.png",
        import.meta.url
      ).href,
      background: new URL(
        "./assets/images/pages/auth/background.png",
        import.meta.url
      ).href,
    },
  },
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
};

export function initModule(_options: ModuleOptions, nuxt: Nuxt) {
  const options = _options as ModuleOptionsDefaults;

  nuxt.options.runtimeConfig.public[configKey] = options as any;
  nuxt.options.appConfig[configKey] = configs;

  return options;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    [configKey]?: ModuleConfig;
  }
}

declare global {
  /* eslint-disable no-var */
  var $dialog: DialogApiInjection;
  var $loadingBar: LoadingBarApiInjection;
  var $message: MessageApiInjection;
  var $modal: ModalApiInjection;
  var $notification: NotificationApiInjection;
  /* eslint-enable no-var */
}
declare module "ofetch" {
  interface FetchOptions {
    config?: _FetchOptions;
  }
}

declare module "#app" {
  interface NuxtError {
    /**
     * 错误数据
     */
    data?: {
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

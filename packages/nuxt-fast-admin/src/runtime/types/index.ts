import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { LoadingBarApiInjection } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
import type { ModalApiInjection } from "naive-ui/lib/modal/src/ModalProvider";
import type { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";
import type { FetchOptions as _FetchOptions, ErrorLevel } from "./base";
import type { ModuleConfig, ModuleConfigDefaults } from "./config";
import type { ModulePublicRuntimeConfig, ModuleRuntimeHooks } from "./module";

export type * from "./base";
export type * from "./config";
export type * from "./module";

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module "#app" {
  interface RuntimeNuxtHooks extends ModuleRuntimeHooks {}
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

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
  interface CustomAppConfig {
    fastAdmin?: ModuleConfig;
  }
}

declare module "@ucstu/nuxt-fast-utils/types" {
  interface ModuleConfigs {
    fastAdmin: ModuleConfigDefaults;
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
    options?: _FetchOptions;
  }
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

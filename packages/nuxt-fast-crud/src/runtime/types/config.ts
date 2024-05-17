import type { FsSetupOptions } from "@fast-crud/fast-crud";
import type { UiSetupOptions } from "@fast-crud/ui-naive";

export interface FsCrudConfig {
  /**
   * FS配置
   */
  fsSetupOptions?: FsSetupOptions;
  /**
   * UI配置
   */
  uiSetupOptions?: UiSetupOptions;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    fastCrud?: FsCrudConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    fastCrud?: FsCrudConfig;
  }
}

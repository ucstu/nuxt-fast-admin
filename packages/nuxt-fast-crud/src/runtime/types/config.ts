import type { FsSetupOptions } from "@fast-crud/fast-crud";
import type { UiSetupOptions as AntdvUiSetupOptions } from "@fast-crud/ui-antdv";
import type { UiSetupOptions as Antdv4UiSetupOptions } from "@fast-crud/ui-antdv4";
import type { UiSetupOptions as ElementUiSetupOptions } from "@fast-crud/ui-element";
import type { UiSetupOptions as NaiveUiSetupOptions } from "@fast-crud/ui-naive";

export interface ModuleConfig {
  /**
   * FS配置
   * @description 动态修改无效
   */
  fsSetupOptions?: FsSetupOptions;
  /**
   * UI配置
   * @description 动态修改无效
   */
  uiSetupOptions?:
    | NaiveUiSetupOptions
    | AntdvUiSetupOptions
    | Antdv4UiSetupOptions
    | ElementUiSetupOptions;
}

export type ModuleConfigDefaults = Required<ModuleConfig>;

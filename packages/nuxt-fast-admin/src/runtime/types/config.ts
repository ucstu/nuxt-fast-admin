import type {
  Get,
  OmitDeep,
  RequiredDeep,
} from "@ucstu/nuxt-fast-utils/exports";
import type {
  AppOptions,
  ErrorOptions,
  FetchOptions,
  LayoutDefaultOptions,
  PageAuthOptions,
} from "./base";

export interface ModuleConfig {
  /**
   * 应用名称
   * @default "Fast admin"
   */
  name?: string;
  /**
   * 应用图标
   * @default base64
   */
  logo?: string;
  /**
   * 应用配置
   */
  app?: AppOptions;
  /**
   * 布局配置
   */
  layouts?: {
    /**
     * 默认布局
     */
    default?: LayoutDefaultOptions;
  };
  /**
   * 页面配置
   */
  pages?: {
    /**
     * 鉴权页面
     */
    auth?: PageAuthOptions;
  };
  /**
   * 请求配置
   */
  fetch?: FetchOptions;
  /**
   * 错误配置
   */
  error?: ErrorOptions;
}

export type ModuleConfigDefaults = RequiredDeep<
  OmitDeep<
    ModuleConfig,
    "layouts.default.header.dropdown.options" | "pages.auth.form"
  >
> & {
  layouts: {
    default: {
      header: {
        dropdown: {
          options: Exclude<
            Get<ModuleConfig, "layouts.default.header.dropdown.options">,
            undefined
          >;
        };
      };
    };
  };
  pages: {
    auth: {
      form: Exclude<Get<ModuleConfig, "pages.auth.form">, undefined>;
    };
  };
};

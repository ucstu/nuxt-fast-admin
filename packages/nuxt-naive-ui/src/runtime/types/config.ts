import type { GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import type { LiteralUnion } from "type-fest";

export interface NaiveUiConfig {
  /**
   * 默认主题
   * @default "auto"
   */
  defaultTheme?: LiteralUnion<"auto" | "dark" | "light", string>;
  /**
   * 自定义主题
   */
  customThemes?: Record<
    Exclude<string, "dark" | "light">,
    Omit<GlobalTheme, "name">
  >;
  /**
   * 主题配置
   */
  themesOverrides?: Partial<
    Record<
      LiteralUnion<"shared" | "dark" | "light", string>,
      GlobalThemeOverrides
    >
  >;
}

declare module "@nuxt/schema" {
  interface CustomAppConfig {
    naiveUi?: NaiveUiConfig;
  }
}

declare module "nuxt/schema" {
  interface CustomAppConfig {
    naiveUi?: NaiveUiConfig;
  }
}

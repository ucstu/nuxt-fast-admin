import type { LiteralUnion } from "@ucstu/nuxt-fast-utils/types";
import type { GlobalTheme, GlobalThemeOverrides } from "naive-ui";

export interface NaiveUiConfig {
  /**
   * 默认主题
   * @default "auto"
   */
  defaultTheme?: LiteralUnion<"auto" | "dark" | "light", string>;
  /**
   * 自定义主题
   */
  customThemes?: Partial<
    Record<Exclude<string, "dark" | "light">, Omit<GlobalTheme, "name">>
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

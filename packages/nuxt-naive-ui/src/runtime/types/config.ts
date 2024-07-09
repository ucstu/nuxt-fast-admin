import type { LiteralUnion } from "@ucstu/nuxt-fast-utils/exports";
import type { GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import type { ThemeKey } from "./base";

export interface ModuleConfig {
  /**
   * 默认主题
   * @default "auto"
   */
  defaultTheme?: ThemeKey;
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

export type ModuleConfigDefaults = Required<ModuleConfig>;

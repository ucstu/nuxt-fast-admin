import type {
  BasicColorMode,
  LiteralUnion,
} from "@ucstu/nuxt-fast-utils/exports";

export type NaiveUiThemeKey = LiteralUnion<"auto" | BasicColorMode, string>;

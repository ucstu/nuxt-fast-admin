import type {
  BasicColorMode,
  LiteralUnion,
} from "@ucstu/nuxt-fast-utils/exports";

export type ThemeKey = LiteralUnion<"auto" | BasicColorMode, string>;

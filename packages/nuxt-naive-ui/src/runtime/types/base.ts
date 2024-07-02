import type { BasicColorMode } from "@ucstu/nuxt-fast-utils/exports";
import type { LiteralUnion } from "@ucstu/nuxt-fast-utils/types";

export type ThemeKey = LiteralUnion<"auto" | BasicColorMode, string>;

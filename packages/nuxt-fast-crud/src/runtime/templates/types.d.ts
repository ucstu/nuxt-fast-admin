// @ts-expect-error
import type { _FsCrudOptions } from "./nuxt-fast-crud/options";
declare module "<%= options.self %>" {
  interface FsCrudOptions extends _FsCrudOptions {}
}

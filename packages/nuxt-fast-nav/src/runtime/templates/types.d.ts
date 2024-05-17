// @ts-expect-error
import type { FsNavConfig } from "./nuxt-fast-nav/config";
// @ts-expect-error
import type { FsNavMenuKey } from "./nuxt-fast-nav/menu-key";

// @ts-expect-error
import type { FsNavPage } from "<%= options.self %>";

declare module "<%= options.self %>" {
  interface FsNavConfigOption extends FsNavConfig {}
  interface FsNavMenuKeyOption extends FsNavMenuKey {}
}
declare module "<%= options.page %>" {
  interface PageMeta extends FsNavPage {}
}

// @ts-expect-error
import type { _FsAuthOptions } from "./nuxt-fast-auth/options";

// @ts-expect-error
import type { FsAuthMeta, FsAuthPage } from "<%= options.self %>";
declare module "<%= options.self %>" {
  interface FsAuthOptions extends _FsAuthOptions {}
}
declare module "<%= options.page %>" {
  interface PageMeta {
    /**
     * 页面鉴权配置
     */
    auth?: FsAuthPage | FsAuthMeta;
  }
}

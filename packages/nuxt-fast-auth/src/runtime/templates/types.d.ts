// @ts-expect-error
import type { FsAuthConfig } from "./nuxt-fast-auth/config";

// @ts-expect-error
import type { FsAuthMeta, FsAuthPage } from "<%= options.self %>";

declare module "<%= options.self %>" {
  interface FsAuthConfigOption extends FsAuthConfig {}
}

declare module "<%= options.page %>" {
  interface PageMeta {
    /**
     * 页面鉴权配置
     */
    auth?: FsAuthPage | FsAuthMeta;
  }
}

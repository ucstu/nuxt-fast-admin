import { useRequestEvent } from "#imports";
import type { CookieSerializeOptions } from "cookie-es";
import { CookieStorage } from "cookie-storage";
import type { CookieOptions } from "cookie-storage/lib/cookie-options";
import defu from "defu";
import { deleteCookie, getCookie, setCookie } from "h3";
import { tryUseNuxtAppBack } from "../composables";

export class H3CookieStorage extends CookieStorage {
  override setItem(
    key: string,
    data: string,
    options?: (CookieOptions & CookieSerializeOptions) | undefined
  ): void {
    const event = useRequestEvent(tryUseNuxtAppBack());
    if (event) {
      return setCookie(
        event,
        encodeURIComponent(key),
        encodeURIComponent(data),
        // @ts-expect-error
        defu(options, this._defaultOptions)
      );
    }
    super.setItem(key, data, options);
  }

  override getItem(key: string): string | null {
    const event = useRequestEvent(tryUseNuxtAppBack());
    if (event) {
      return getCookie(event, encodeURIComponent(key)) ?? null;
    }
    return super.getItem(key);
  }

  override removeItem(
    key: string,
    cookieOptions?: (CookieOptions & CookieSerializeOptions) | undefined
  ): void {
    const event = useRequestEvent(tryUseNuxtAppBack());
    if (event) {
      return deleteCookie(
        event,
        encodeURIComponent(key),
        // @ts-expect-error
        defu(cookieOptions, this._defaultOptions)
      );
    }
    super.removeItem(key, cookieOptions);
  }
}

export const cookieStorage = new H3CookieStorage({
  expires: new Date("9999-12-31T23:59:59.000Z"),
});

export const sessionCookieStorage = new H3CookieStorage();

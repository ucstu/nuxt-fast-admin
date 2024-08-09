import type { NuxtApp } from "#app";
import { shallowRef, useRequestEvent } from "#imports";
import type { CookieSerializeOptions } from "cookie-es";
import { CookieStorage } from "cookie-storage";
import type { CookieOptions } from "cookie-storage/lib/cookie-options";
import defu from "defu";
import { deleteCookie, getCookie, setCookie } from "h3";

export const nuxtApp = shallowRef<NuxtApp>();

export class H3CookieStorage extends CookieStorage {
  override setItem(
    key: string,
    data: string,
    options?: (CookieOptions & CookieSerializeOptions) | undefined,
  ): void {
    const event = useRequestEvent(nuxtApp.value);
    if (event) {
      return setCookie(
        event,
        encodeURIComponent(key),
        encodeURIComponent(data),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        defu(options, this._defaultOptions),
      );
    }
    super.setItem(key, data, options);
  }

  override getItem(key: string): string | null {
    const event = useRequestEvent(nuxtApp.value);
    if (event) {
      const value = getCookie(event, encodeURIComponent(key));
      return value === undefined || value === null
        ? null
        : decodeURIComponent(value);
    }
    const value = super.getItem(key);
    return value === null ? null : decodeURIComponent(value);
  }

  override removeItem(
    key: string,
    cookieOptions?: (CookieOptions & CookieSerializeOptions) | undefined,
  ): void {
    const event = useRequestEvent(nuxtApp.value);
    if (event) {
      return deleteCookie(
        event,
        encodeURIComponent(key),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        defu(cookieOptions, this._defaultOptions),
      );
    }
    super.removeItem(key, cookieOptions);
  }
}

export const cookieStorage = new H3CookieStorage({
  expires: new Date("9999-12-31T23:59:59.000Z"),
});

export const sessionCookieStorage = new H3CookieStorage();

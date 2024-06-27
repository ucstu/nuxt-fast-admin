import { CookieStorage } from "cookie-storage";

export const cookieStorage = new CookieStorage({
  expires: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000),
});

export const sessionCookieStorage = new CookieStorage();

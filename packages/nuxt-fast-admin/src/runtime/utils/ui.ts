import { useAppConfig, useNuxtAppBack } from "#imports";
import FastCrud from "@fast-crud/fast-crud";
import defu from "defu";
import type { FsCrudConfigDefaults } from "../types";

export function installFsatCrud() {
  const nuxtApp = useNuxtAppBack();
  const config = useAppConfig().fastCrud as FsCrudConfigDefaults;
  if (typeof nuxtApp.$i18n === "object" && nuxtApp.$i18n !== null) {
    let hasZh = false;
    let hasEn = false;
    const i18n = nuxtApp.$i18n as any;
    if ("availableLocales" in i18n && Array.isArray(i18n.availableLocales)) {
      for (const locale of i18n.availableLocales) {
        if (locale.startsWith("zh")) {
          hasZh = true;
        }
        if (locale.startsWith("en")) {
          hasEn = true;
        }
      }
    }
    if (
      "mergeLocaleMessage" in i18n &&
      typeof i18n.mergeLocaleMessage === "function"
    ) {
      if (!hasZh) {
        i18n.mergeLocaleMessage("zh", {
          fs: {},
        });
      }
      if (!hasEn) {
        i18n.mergeLocaleMessage("en", {
          fs: {},
        });
      }
    }
  }

  nuxtApp.vueApp.use(
    FastCrud,
    defu(
      {
        i18n: nuxtApp.$i18n,
      },
      config.fsSetupOptions
    )
  );
}

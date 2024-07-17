import { computed, createNuxtGlobalState, ref } from "#imports";
import { extendRef, type LiteralUnion } from "@ucstu/nuxt-fast-utils/exports";
import camelCase from "camelcase";
import * as locales from "naive-ui";

const LANGS = [
  "zhCN",
  "zhTW",
  "enUS",
  "ruRU",
  "ukUA",
  "jaJP",
  "koKR",
  "idID",
  "deDE",
  "nbNO",
  "nlNL",
  "frFR",
  "esAR",
  "itIT",
  "skSK",
  "csCZ",
  "enGB",
  "plPL",
  "ptBR",
  "thTH",
  "arDZ",
  "trTR",
  "eo",
  "viVN",
  "faIR",
  "svSE",
  "etEE",
] as const;

type Lang = LiteralUnion<(typeof LANGS)[number], string>;
export const useNaiveUiI18n = createNuxtGlobalState(function (
  lang: Lang = "enUS",
) {
  const _lang = ref<Lang>(lang);

  const result = computed(() => {
    return {
      locale: locales[
        camelCase(_lang.value, {
          preserveConsecutiveUppercase: true,
        }) as keyof typeof locales
      ] as typeof locales.enUS,
      dateLocale: locales[
        camelCase(`date-${_lang.value}`, {
          preserveConsecutiveUppercase: true,
        }) as keyof typeof locales
      ] as typeof locales.dateEnUS,
    };
  });

  return extendRef(result, {
    lang: _lang,
  });
});

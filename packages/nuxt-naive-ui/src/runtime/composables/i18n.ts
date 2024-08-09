import { createNuxtGlobalState, ref } from "#imports";
import {
  computedEager,
  extendRef,
  type CamelCase,
} from "@ucstu/nuxt-fast-utils/exports";
import camelCase from "camelcase";
import * as locales from "naive-ui";

type Lang =
  | "zhCN"
  | "zhTW"
  | "enUS"
  | "ruRU"
  | "ukUA"
  | "jaJP"
  | "koKR"
  | "idID"
  | "deDE"
  | "nbNO"
  | "nlNL"
  | "frFR"
  | "esAR"
  | "itIT"
  | "skSK"
  | "csCZ"
  | "enGB"
  | "plPL"
  | "ptBR"
  | "thTH"
  | "arDZ"
  | "trTR"
  | "eo"
  | "viVN"
  | "faIR"
  | "svSE"
  | "etEE";

export const useNaiveUiI18n = createNuxtGlobalState(function (
  lang: Lang = "enUS",
) {
  const _lang = ref<Lang>(lang);

  const result = computedEager(() => {
    return {
      locale: locales[_lang.value],
      dateLocale:
        locales[
          camelCase(`date-${_lang.value}`, {
            preserveConsecutiveUppercase: true,
          }) as CamelCase<`date-${Lang}`>
        ],
    };
  });

  return extendRef(result, {
    lang: _lang,
  });
});

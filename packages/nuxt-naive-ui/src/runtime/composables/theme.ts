import type { NuxtApp } from "#app";
import {
  $useRuntimeConfig,
  computed,
  createNuxtGlobalState,
  useModuleConfig,
  useNuxtApp,
  useNuxtReady,
  useNuxtStorage,
} from "#imports";
import { extendRef } from "@ucstu/nuxt-fast-utils/exports";
import {
  darkTheme,
  lightTheme,
  useOsTheme,
  type GlobalTheme,
  type GlobalThemeOverrides,
} from "naive-ui";
import { configKey } from "../config";
import type { NaiveUiThemeKey } from "../types";

function getTheme(
  theme: NaiveUiThemeKey | null,
  themes?: Partial<Record<NaiveUiThemeKey, GlobalTheme>>,
) {
  if (!theme) return;
  switch (theme) {
    case "dark":
      return darkTheme;
    case "light":
      return lightTheme;
    default:
      return themes?.[theme];
  }
}

function getThemeOverrides(
  theme: NaiveUiThemeKey | null,
  themesOverrides?: Partial<Record<NaiveUiThemeKey, GlobalThemeOverrides>>,
) {
  if (!theme) return;
  return themesOverrides?.[theme];
}

export const useNaiveUiTheme = createNuxtGlobalState(function (
  theme?: NaiveUiThemeKey,
  nuxtApp: NuxtApp = useNuxtApp(),
) {
  const naiveUiConfig = useModuleConfig(configKey, nuxtApp);
  const fastUtilsConfig = $useRuntimeConfig(nuxtApp).public.fastUtils;

  const store = useNuxtStorage<NaiveUiThemeKey>(
    "naive-ui:theme",
    () => theme ?? naiveUiConfig.value.defaultTheme,
    undefined,
    { nuxtApp },
  );
  const system = useOsTheme();

  const isReady = useNuxtReady();

  const real = computed(() =>
    store.value === "auto"
      ? fastUtilsConfig.ssr
        ? isReady.value
          ? system.value
          : "light"
        : system.value
      : store.value,
  );

  return extendRef(
    computed(() => ({
      theme: getTheme(
        real.value,
        Object.fromEntries(
          Object.entries(naiveUiConfig.value.customThemes).map(
            ([key, value]) => [
              key,
              {
                ...value,
                name: key,
              },
            ],
          ),
        ),
      ),
      themeOverrides: getThemeOverrides(
        real.value,
        naiveUiConfig.value.themesOverrides,
      ),
    })),
    {
      system,
      store,
      real,
    },
  );
});

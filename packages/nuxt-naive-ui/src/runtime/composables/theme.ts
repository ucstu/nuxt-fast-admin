import {
  computed,
  getNuxtConfig,
  useNuxtConfig,
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
  themes?: Partial<Record<NaiveUiThemeKey, GlobalTheme>>
) {
  if (!theme) return
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
  themesOverrides?: Partial<Record<NaiveUiThemeKey, GlobalThemeOverrides>>
) {
  if (!theme) return
  return themesOverrides?.[theme];
}

export function useNaiveUiTheme(theme?: NaiveUiThemeKey) {
  const config = useNuxtConfig(configKey);
  const runtimeConfig = getNuxtConfig("fastUtils", { type: "public" });
  const store = useNuxtStorage<NaiveUiThemeKey>(
    "naive-ui:theme",
    () => config.value.defaultTheme
  );
  const system = useOsTheme();
  const isReady = useNuxtReady();

  if (theme) store.value = theme;

  const real = computed(() =>
    store.value === "auto"
      ? runtimeConfig.ssr
        ? isReady.value
          ? system.value
          : "light"
        : system.value
      : store.value
  );

  return extendRef(
    computed(() => ({
      theme: getTheme(
        real.value,
        Object.fromEntries(
          Object.entries(config.value.customThemes).map(([key, value]) => [
            key,
            {
              ...value,
              name: key,
            },
          ])
        )
      ),
      themeOverrides: getThemeOverrides(
        real.value,
        config.value.themesOverrides
      ),
    })),
    {
      system,
      store,
      real,
    }
  );
}

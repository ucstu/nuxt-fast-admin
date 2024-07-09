import {
  computed,
  useNuxtConfig,
  useNuxtReady,
  useNuxtStorage,
  useRuntimeConfig,
} from "#imports";
import { extendRef, useColorMode } from "@ucstu/nuxt-fast-utils/exports";
import {
  darkTheme,
  lightTheme,
  type GlobalTheme,
  type GlobalThemeOverrides,
} from "naive-ui";
import { configKey } from "../../config";
import type { ThemeKey } from "../types";

function getTheme(
  theme: ThemeKey,
  themes?: Partial<Record<ThemeKey, GlobalTheme>>
) {
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
  theme: ThemeKey,
  themesOverrides?: Partial<Record<ThemeKey, GlobalThemeOverrides>>
) {
  return themesOverrides?.[theme];
}

export function useNaiveUiTheme(theme?: ThemeKey) {
  const config = useNuxtConfig(configKey);
  const runtimeConfig = useRuntimeConfig().public.fastUtils;
  const { store, system } = useColorMode({
    storageRef: useNuxtStorage(
      "naive-ui:theme",
      () => config.value.defaultTheme
    ),
  });
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

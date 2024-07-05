import {
  computed,
  toRef,
  useAppConfig,
  useRuntimeConfig,
  useStorage,
  type Ref
} from "#imports";
import { extendRef, useColorMode } from "@ucstu/nuxt-fast-utils/exports";
import {
  darkTheme,
  lightTheme,
  type GlobalTheme,
  type GlobalThemeOverrides,
} from "naive-ui";
import { configKey, type ModuleConfigDefaults, type ThemeKey } from "../types";

function getTheme(
  theme: ThemeKey,
  themes?: Partial<Record<ThemeKey, GlobalTheme>>
) {
  switch (theme) {
    case "auto":
      return undefined;
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
  if (theme === "auto") return undefined;
  return themesOverrides?.[theme];
}

function useTheme(theme?: ThemeKey) {
  const config = toRef(useAppConfig(), "naiveUi") as Ref<ModuleConfigDefaults>;
  const colorMode = useColorMode({
    storageRef: useStorage("naive-ui:theme", () => config.value.defaultTheme),
  });
  if (theme) colorMode.value = theme;
  return colorMode;
}

export function useNaiveUiTheme(theme?: ThemeKey) {
  const config = toRef(useAppConfig(), configKey) as Ref<ModuleConfigDefaults>;
  const runtimeConfig = useRuntimeConfig().public.fastUtils;
  const { store, system } = useTheme(theme);
  const isReady = useNuxtReady();

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

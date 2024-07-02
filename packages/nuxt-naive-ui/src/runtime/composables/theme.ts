import {
  computed,
  toRef,
  useAppConfig,
  useRuntimeConfig,
  useStorage,
} from "#imports";
import { useColorMode, useMounted } from "@ucstu/nuxt-fast-utils/exports";
import {
  darkTheme,
  lightTheme,
  type GlobalTheme,
  type GlobalThemeOverrides,
} from "naive-ui";
import type { ThemeKey } from "../types";

export function useNaiveUiTheme(theme?: ThemeKey) {
  const config = toRef(useAppConfig(), "naiveUi");
  const colorMode = useColorMode({
    storageRef: useStorage(
      "naive-ui-theme",
      () => config.value.defaultTheme ?? "auto"
    ),
  });
  if (theme) colorMode.value = theme;
  return colorMode;
}

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

export function useNaiveUiThemeConfig() {
  const isMounted = useMounted();
  const config = toRef(useAppConfig(), "naiveUi");
  const runtimeConfig = useRuntimeConfig().public.fastUtils;
  const { store, system } = useNaiveUiTheme();

  const theme = computed(() =>
    store.value === "auto"
      ? runtimeConfig.ssr
        ? isMounted.value
          ? system.value
          : "light"
        : system.value
      : store.value
  );

  const customThemes = computed(
    () =>
      Object.fromEntries(
        Object.entries(config.value.customThemes ?? {}).map(([key, value]) => [
          key,
          {
            ...value,
            name: key,
          },
        ])
      ) as Record<string, GlobalTheme>
  );
  const themesOverrides = computed(() => config.value.themesOverrides);

  return computed(() => ({
    theme: getTheme(theme.value, customThemes.value),
    themeOverrides: getThemeOverrides(theme.value, themesOverrides.value),
  }));
}

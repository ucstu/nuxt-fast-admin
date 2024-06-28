import { refAppConfig, useFuStorage, useRuntimeConfig } from "#imports";
import {
  computedEager,
  useColorMode,
  useMounted,
} from "@ucstu/nuxt-fast-utils/exports";
import {
  darkTheme,
  lightTheme,
  type GlobalTheme,
  type GlobalThemeOverrides,
} from "naive-ui";

export function useNaiveUiTheme(theme?: string) {
  const config = refAppConfig("naiveUi");
  const colorMode = useColorMode({
    storageRef: useFuStorage(
      "naive-ui-theme",
      () => config.value.defaultTheme ?? "auto"
    ),
  });
  if (theme) colorMode.value = theme;
  return colorMode;
}

function getTheme(
  theme: string,
  themes?: Partial<Record<string, GlobalTheme>>
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
  theme: string,
  themesOverrides?: Partial<Record<string, GlobalThemeOverrides>>
) {
  if (theme === "auto") return undefined;
  return themesOverrides?.[theme];
}

export function useNaiveUiThemeConfig() {
  const isMounted = useMounted();
  const config = refAppConfig("naiveUi");
  const runtimeConfig = useRuntimeConfig().public.fastUtils;
  const { store, system } = useNaiveUiTheme();

  const theme = computedEager(() =>
    store.value === "auto"
      ? runtimeConfig.ssr
        ? isMounted.value
          ? system.value
          : "light"
        : system.value
      : store.value
  );

  const customThemes = computedEager(
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
  const themesOverrides = computedEager(() => config.value.themesOverrides);

  return computedEager(() => ({
    theme: getTheme(theme.value, customThemes.value),
    themeOverrides: getThemeOverrides(theme.value, themesOverrides.value),
  }));
}

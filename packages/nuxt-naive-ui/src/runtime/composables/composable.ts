import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  useRuntimeConfig,
  watch,
  type ComputedRef,
  type Ref,
} from "#imports";
import {
  darkTheme,
  lightTheme,
  useOsTheme,
  type GlobalTheme,
  type GlobalThemeOverrides,
} from "naive-ui";
import { useCookieSync, useStorageSync } from "../utils/reactivity";
import { useAppConfigRef } from "./config";

const useTheme = (): Ref<string> => {
  const config = useAppConfigRef("naiveUi").value!;
  const runtimeConfig = useRuntimeConfig();
  return (
    runtimeConfig.public.naiveUi.ssr
      ? useCookieSync<string>("naive-ui-theme", {
          defaultValue: () => config.defaultTheme!,
          cookieOptions: computed(() => ({
            expires: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000),
          })),
        })
      : useStorageSync<string>("naive-ui-theme", {
          storage: "localStorage",
          defaultValue: () => config.defaultTheme!,
        })
  ) as Ref<string>;
};

function getTheme(
  theme: string,
  themes?: Record<string, Omit<GlobalTheme, "name">>,
): GlobalTheme | undefined {
  switch (theme) {
    case "auto":
      return undefined;
    case "dark":
      return darkTheme;
    case "light":
      return lightTheme;
    default:
      return themes?.[theme] ? { name: theme, ...themes[theme] } : undefined;
  }
}

function getThemeOverrides(
  theme: string,
  themesOverrides?: Partial<Record<string, GlobalThemeOverrides>>,
): GlobalThemeOverrides | undefined {
  if (theme === "auto") return undefined;
  return themesOverrides?.[theme];
}

type UseNiaveUiThemeRet = {
  theme: ComputedRef<GlobalTheme | undefined>;
  current: Ref<string>;
  themeOverrides: ComputedRef<GlobalThemeOverrides | undefined>;
};
export function useNiaveUiTheme(theme?: string): UseNiaveUiThemeRet {
  const osTheme = useOsTheme();
  const currentTheme = useTheme();
  const config = useAppConfigRef("naiveUi");
  const runtimeConfig = useRuntimeConfig();

  if (theme) {
    currentTheme.value = theme;
  }

  const realTheme = ref<string>(
    currentTheme.value === "auto" || currentTheme.value == "auto"
      ? "light"
      : currentTheme.value,
  );

  if (runtimeConfig.public.naiveUi.ssr) {
    onMounted(() => {
      const unWatch = watch(
        [currentTheme, osTheme],
        ([currentTheme, osTheme]) => {
          realTheme.value =
            currentTheme === "auto" ? osTheme ?? currentTheme : currentTheme;
        },
        { immediate: true },
      );
      onUnmounted(unWatch);
    });
  } else {
    const unWatch = watch(
      [currentTheme, osTheme],
      ([currentTheme, osTheme]) => {
        realTheme.value =
          currentTheme === "auto" ? osTheme ?? currentTheme : currentTheme;
      },
      { immediate: true },
    );
    onUnmounted(unWatch);
  }

  return {
    theme: computed(() =>
      getTheme(realTheme.value, config.value!.customThemes ?? {}),
    ),
    current: currentTheme,
    themeOverrides: computed(() =>
      getThemeOverrides(realTheme.value, config.value!.themesOverrides ?? {}),
    ),
  };
}

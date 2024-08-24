import { nextTick, ref, useModuleConfig } from "#imports";
import {
  createInjectionState,
  useFullscreen,
  useMediaQuery,
  watchImmediate,
} from "@ucstu/nuxt-fast-utils/exports";
import { configKey } from "../config";

const [useProvideDefaultLayoutStore, useDefaultLayoutStore] =
  createInjectionState(() => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const content = ref<HTMLElement | null>(null);
    const pageFullscreen = useFullscreen(content);
    const applicationFullscreen = useFullscreen();
    const showPage = ref(true);
    async function refreshPage() {
      showPage.value = false;
      await nextTick(() => {
        showPage.value = true;
      });
    }

    const menuConfig = useModuleConfig(configKey, "layouts.default.menu");
    watchImmediate(isMobile, (isMobile) => {
      menuConfig.value.collapsed = isMobile;
    });

    return {
      content,
      pageFullscreen,
      applicationFullscreen,
      isMobile,
      showPage,
      refreshPage,
    };
  });

export { useDefaultLayoutStore, useProvideDefaultLayoutStore };

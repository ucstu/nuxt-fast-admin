import { nextTick, ref } from "#imports";
import {
  createInjectionState,
  useFullscreen,
} from "@ucstu/nuxt-fast-utils/exports";

const [useProvideDefaultLayoutStore, useDefaultLayoutStore] =
  createInjectionState(() => {
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

    return {
      content,
      pageFullscreen,
      applicationFullscreen,
      showPage,
      refreshPage,
    };
  });

export { useDefaultLayoutStore, useProvideDefaultLayoutStore };

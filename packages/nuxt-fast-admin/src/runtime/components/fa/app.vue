<template>
  <n-config-provider class="fast-admin-app" v-bind="config">
    <n-global-style />
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-message-provider>
          <n-modal-provider>
            <n-notification-provider>
              <register-global-feedback />
              <define-template>
                <slot>
                  <nuxt-layout>
                    <nuxt-error-boundary v-if="adminConfig.app.boundary">
                      <nuxt-page />
                      <template #error="{ error, clearError }">
                        <fa-error
                          :error="error.value"
                          @clear-error="handleClearError($event, clearError)"
                        />
                      </template>
                    </nuxt-error-boundary>
                    <nuxt-page v-else />
                  </nuxt-layout>
                </slot>
              </define-template>
              <fs-ui-context
                v-if="runtimeConfig.public.fastAdmin.modules.includes('crud')"
              >
                <reuse-template />
              </fs-ui-context>
              <reuse-template v-else />
            </n-notification-provider>
          </n-modal-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="tsx">
import {
  computed,
  defineComponent,
  navigateTo,
  useAppConfig,
  useHead,
  useLoadingIndicator,
  useNaiveUiI18n,
  useNaiveUiTheme,
  useNavPages,
  useNuxtApp,
  useRuntimeConfig,
  watch
} from "#imports";
import type { RouteLocationRaw } from "#vue-router";
import { FsUiContext } from "@fast-crud/ui-naive";
import { createReusableTemplate } from "@ucstu/nuxt-fast-utils/exports";
import {
  useDialog,
  useLoadingBar,
  useMessage,
  useModal,
  useNotification,
  type ConfigProviderProps,
} from "@ucstu/nuxt-naive-ui/exports";
import defu from "defu";
import type { ModuleConfigDefaults } from "../../types";
import { getAppHeadTitle } from "../../utils";

const props = defineProps<ConfigProviderProps>();

const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const adminConfig = computed(() => appConfig.fastAdmin as ModuleConfigDefaults);

const i18nConfig = useNaiveUiI18n("zh-CN");
const themeConfig = useNaiveUiTheme();
const config = computed(
  () => defu(props, themeConfig, i18nConfig) as ConfigProviderProps
);

const pages = useNavPages();
const nuxtApp = useNuxtApp();

useHead({ title: () => getAppHeadTitle(pages.current, nuxtApp) });

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const RegisterGlobalFeedback = defineComponent({
  setup() {
    globalThis.$dialog = useDialog();
    globalThis.$loadingBar = useLoadingBar();
    globalThis.$message = useMessage();
    globalThis.$modal = useModal();
    globalThis.$notification = useNotification();

    const { isLoading } = useLoadingIndicator();

    watch(
      () => isLoading.value,
      (value) => {
        if (value) {
          globalThis.$loadingBar.start();
        } else {
          globalThis.$loadingBar.finish();
        }
      },
      { immediate: true }
    );

    return () => null;
  },
});

function handleClearError(
  optionsAndError: { redirect?: RouteLocationRaw } & Error,
  clearError: (optionsAndError: { redirect?: RouteLocationRaw } & Error) => void
) {
  clearError(optionsAndError);
  if (optionsAndError.redirect) {
    navigateTo(optionsAndError.redirect);
  }
}
</script>

<style>
html,
body,
#__nuxt,
.fast-admin-app {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>

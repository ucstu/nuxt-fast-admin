<template>
  <n-config-provider
    class="fast-admin-app"
    v-bind="config"
    inline-theme-disabled
  >
    <n-dialog-provider v-bind="dialog">
      <n-loading-bar-provider v-bind="loadingBar">
        <n-message-provider v-bind="message">
          <n-modal-provider v-bind="modal">
            <n-notification-provider v-bind="notification">
              <register-global-feedback />
              <fs-ui-context>
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
              </fs-ui-context>
            </n-notification-provider>
          </n-modal-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="tsx">
import {
  defineComponent,
  navigateTo,
  useHead,
  useLoadingIndicator,
  useModuleConfig,
  useNaiveUiI18n,
  useNaiveUiTheme,
  useNavHistories,
  watch
} from "#imports";
import type { RouteLocationRaw } from "#vue-router";
import { FsUiContext } from "@fast-crud/ui-naive";
import {
  computedEager
} from "@ucstu/nuxt-fast-utils/exports";
import {
  useDialog,
  useLoadingBar,
  useMessage,
  useModal,
  useNotification,
  type ConfigProviderProps,
  type DialogProviderProps,
  type LoadingBarProviderProps,
  type MessageProviderProps,
  type ModalProviderProps,
  type NotificationProviderProps,
} from "@ucstu/nuxt-naive-ui/exports";
import defu from "defu";
import { configKey } from "../../config";

defineOptions({
  name: "FaApp",
});

const props = defineProps<{
  config?: ConfigProviderProps;
  dialog?: DialogProviderProps;
  loadingBar?: LoadingBarProviderProps;
  message?: MessageProviderProps;
  modal?: ModalProviderProps;
  notification?: NotificationProviderProps;
  title?: string;
}>();

const adminConfig = useModuleConfig(configKey);

const i18nConfig = useNaiveUiI18n("zh-CN");
const themeConfig = useNaiveUiTheme();

const config = computedEager(
  () =>
    defu(
      props.config,
      themeConfig.value,
      i18nConfig.value
    ) as ConfigProviderProps
);

const histories = useNavHistories();
useHead({
  title: () =>
    props.title || histories.current?.title
      ? `${histories.current?.title} - ${adminConfig.value.name}`
      : adminConfig.value.name,
});

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

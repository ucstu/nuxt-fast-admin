<template>
  <n-config-provider class="fa-app" v-bind="appConfig!.naiveConfig">
    <n-global-style />
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-message-provider>
          <n-modal-provider>
            <n-notification-provider>
              <register-feedback-global />
              <fs-ui-context>
                <nuxt-layout>
                  <nuxt-error-boundary v-if="appConfig!.boundary">
                    <nuxt-page />
                    <template #error="{ error, clearError }">
                      <fa-pages-error
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
import type { RouteLocationRaw } from "#vue-router";
import { FsUiContext } from "@fast-crud/ui-naive";
import defu from "defu";
import type { FunctionalComponent } from "vue";

const { isLoading } = useLoadingIndicator();
const appConfig = useFuConfig("fastAdmin.app");
const RegisterFeedbackGlobal: FunctionalComponent = () => {
  globalThis.$dialog = useDialog();
  globalThis.$loadingBar = useLoadingBar();
  globalThis.$message = useMessage();
  globalThis.$modal = useModal();
  globalThis.$notification = useNotification();
  watch(
    () => isLoading.value,
    (value) => {
      if (value) {
        globalThis.$loadingBar.start();
      } else {
        globalThis.$loadingBar.finish();
      }
    },
    { immediate: true },
  );
};

function handleClearError(
  optionsAndError: { redirect?: RouteLocationRaw } & Error,
  clearError: (
    optionsAndError: { redirect?: RouteLocationRaw } & Error,
  ) => void,
) {
  clearError(optionsAndError);
  if (optionsAndError.redirect) {
    navigateTo(optionsAndError.redirect);
  }
}

const naiveUiThemeConfig = useNaiveUiThemeConfig();
watch(
  naiveUiThemeConfig,
  (naiveUiThemeConfig) => {
    appConfig.value!.naiveConfig = defu(
      naiveUiThemeConfig,
      appConfig.value!.naiveConfig,
    );
  },
  { immediate: true },
);
</script>

<style>
html,
body,
#__nuxt,
.fa-app {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>

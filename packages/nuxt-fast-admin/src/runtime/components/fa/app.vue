<template>
  <n-config-provider
    class="fast-admin-app"
    v-bind="defu(themeConfig, i18nConfig)"
  >
    <n-global-style />
    <fs-ui-context>
      <nuxt-layout>
        <nuxt-error-boundary v-if="config.app.boundary">
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
  </n-config-provider>
</template>

<script setup lang="tsx">
import {
  computed,
  navigateTo,
  useAppConfig,
  useNaiveUiI18n,
  useNaiveUiTheme,
} from "#imports";
import type { RouteLocationRaw } from "#vue-router";
import { FsUiContext } from "@fast-crud/ui-naive";
import { createReusableTemplate } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { configKey } from "../../config";
import type { ModuleConfigDefaults } from "../../types";

const appConfig = useAppConfig();
const config = computed(() => appConfig[configKey] as ModuleConfigDefaults);

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

function handleClearError(
  optionsAndError: { redirect?: RouteLocationRaw } & Error,
  clearError: (optionsAndError: { redirect?: RouteLocationRaw } & Error) => void
) {
  clearError(optionsAndError);
  if (optionsAndError.redirect) {
    navigateTo(optionsAndError.redirect);
  }
}

const i18nConfig = useNaiveUiI18n("zh-CN");
const themeConfig = useNaiveUiTheme();
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

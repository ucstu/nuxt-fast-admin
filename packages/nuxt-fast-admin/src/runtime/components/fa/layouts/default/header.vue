<template>
  <n-space
    class="fast-admin-layout-default-header"
    justify="space-between"
    align="center"
  >
    <n-space align="center" item-style="display: flex; align-items: center">
      <slot name="prefix-start" />
      <n-button
        v-if="headerConfig!.collapsed"
        text
        @click="menuConfig!.collapsed = !menuConfig!.collapsed"
      >
        <template #icon>
          <fa-icon
            :name="
              !menuConfig!.collapsed
                ? 'material-symbols:format-indent-decrease-rounded'
                : 'material-symbols:format-indent-increase-rounded'
            "
          />
        </template>
      </n-button>
      <n-button v-if="headerConfig!.reload" text @click="reloadNuxtApp()">
        <template #icon>
          <fa-icon name="material-symbols:refresh" />
        </template>
      </n-button>
      <slot name="prefix-end" />
      <n-h3
        v-if="isMobile"
        style="margin: 0"
        @click="menuConfig!.collapsed = !menuConfig!.collapsed"
      >
        {{ adminConfig.name }}
      </n-h3>
      <n-breadcrumb v-else-if="headerConfig!.breadcrumb">
        <template v-for="menu in breadcrumbs">
          <n-breadcrumb-item v-if="menu" :key="menu.key" :clickable="false">
            <n-popover trigger="hover" class="!p-0">
              <template #trigger>
                <n-flex align="center" style="cursor: pointer">
                  <v-node :node="menu.icon" />
                  <!-- @vue-expect-error -->
                  <v-node :node="menu.label" />
                </n-flex>
              </template>
              <n-menu
                :value="getToPath(route)"
                :options="menu.children"
                :root-indent="16"
                accordion
              />
            </n-popover>
          </n-breadcrumb-item>
        </template>
        <n-breadcrumb-item v-if="current" :clickable="false">
          <n-flex align="center">
            <fa-icon :name="current.menu?.icon || current.icon" />
            <nuxt-link :to="current.to">
              {{ current.menu?.title || current.title }}
            </nuxt-link>
          </n-flex>
        </n-breadcrumb-item>
      </n-breadcrumb>
    </n-space>
    <n-space align="center">
      <slot name="suffix-start" />
      <n-button
        v-if="headerConfig!.fullscreen"
        text
        @click="applicationFullscreen.toggle"
      >
        <template #icon>
          <fa-icon
            :name="
              applicationFullscreen.isFullscreen.value
                ? 'material-symbols:close-fullscreen'
                : 'material-symbols:open-in-full'
            "
          />
        </template>
      </n-button>
      <n-button v-if="headerConfig!.theme" text @click="changeTheme">
        <template #icon>
          <fa-icon :name="ICON_MAP[naiveUiTheme]" />
        </template>
      </n-button>
      <slot name="suffix-end" />
      <n-dropdown
        v-if="headerConfig!.dropdown!.show"
        :options="dropdownOptions"
        @select="dropdownSelect"
      >
        <n-avatar
          style="cursor: pointer"
          round
          size="medium"
          :src="headerConfig!.dropdown!.avatar"
        />
      </n-dropdown>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { FaIcon } from "#components";
import {
  getAdminMenu,
  getToPath,
  h,
  reloadNuxtApp,
  toRef,
  toRefDeep,
  useModuleConfig,
  useNaiveUiTheme,
  useNavMenus,
  useNavPages,
  useNuxtApp,
  useRoute,
} from "#imports";
import { computedEager } from "@ucstu/nuxt-fast-utils/exports";
import type { DropdownOption } from "@ucstu/nuxt-naive-ui/exports";
import { useDefaultLayoutStore } from "../../../../composables/store";
import { configKey } from "../../../../config";

defineOptions({
  name: "FaLayoutesDefaultHeader",
});

const ICON_MAP: Record<string, string> = {
  auto: "material-symbols:nightlight-badge",
  light: "material-symbols:light-mode",
  dark: "material-symbols:dark-mode",
};

const route = useRoute();
const pages = useNavPages();
const menus = useNavMenus();
const adminConfig = useModuleConfig(configKey);
const menuConfig = useModuleConfig(configKey, "layouts.default.menu");
const headerConfig = useModuleConfig(configKey, "layouts.default.header");
const { applicationFullscreen, isMobile } = useDefaultLayoutStore()!;

const current = toRefDeep(pages, "current");

const breadcrumbs = computedEager(() => {
  return menus.current.map((parent) => {
    return getAdminMenu(parent);
  });
});

const themeConfig = useNaiveUiTheme();
const naiveUiTheme = toRef(themeConfig, "store");
function changeTheme() {
  const index = Object.keys(ICON_MAP).indexOf(themeConfig.store);
  themeConfig.store = Object.keys(ICON_MAP)[(index + 1) % 3];
}

const dropdownOptions = computedEager(() => {
  return headerConfig.value!.dropdown!.options!.map((option) => {
    return {
      ...option,
      icon:
        typeof option.icon === "string"
          ? () => h(FaIcon, { name: option.icon as string })
          : option.icon,
    };
  });
});

const nuxtApp = useNuxtApp();
async function dropdownSelect(value: string | number, option: DropdownOption) {
  await nuxtApp.callHook(
    "fast-admin:layout-default-header-dropdown-select",
    value,
    option,
  );
}
</script>

<style>
.fast-admin-layout-default-header {
  height: 3rem;
  padding: 0 1rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}
</style>

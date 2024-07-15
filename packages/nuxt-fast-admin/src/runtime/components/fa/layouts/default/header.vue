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
      <n-breadcrumb v-if="headerConfig!.breadcrumb">
        <template v-for="menu in breadcrumbs">
          <n-breadcrumb-item v-if="menu" :key="menu.key" :clickable="false">
            <n-popover trigger="hover" class="!p-0">
              <template #trigger>
                <n-flex align="center" style="cursor: pointer">
                  <v-node :node="menu.icon" />
                  <v-node :node="menu.label as string" />
                </n-flex>
              </template>
              <n-menu
                :value="currentPage?.name"
                :options="menu.children"
                :root-indent="16"
                accordion
              />
            </n-popover>
          </n-breadcrumb-item>
        </template>
        <n-breadcrumb-item v-if="currentPage" :clickable="false">
          <n-flex align="center">
            <fa-icon :name="currentPage.menu.icon" />
            <nuxt-link :to="currentPage.path">
              {{ currentPage.menu.title }}
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
        @select="headerConfig!.dropdown!.hooks!.select"
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
import { reloadNuxtApp, useNavHistories, useNuxtConfig } from "#imports";
import { FaIcon } from "#components";
import { useDefaultLayoutStore } from "./index.vue";

const ICON_MAP: Record<string, string> = {
  auto: "material-symbols:nightlight-badge",
  light: "material-symbols:light-mode",
  dark: "material-symbols:dark-mode",
};

const histories = useNavHistories();
const menuConfig = useNuxtConfig("fastAdmin.layouts.default.menu");
const headerConfig = useNuxtConfig("fastAdmin.layouts.default.header");
const { applicationFullscreen } = useDefaultLayoutStore()!;
const parents = histories.menus;

const breadcrumbs = computed(() => {
  return parents.value.map((parent) => {
    return useMenuOptions(parent).value;
  });
});

const { store: naiveUiTheme } = useNaiveUiTheme();
function changeTheme() {
  const index = Object.keys(ICON_MAP).indexOf(naiveUiTheme.value);
  naiveUiTheme.value = Object.keys(ICON_MAP)[(index + 1) % 3];
}

const dropdownOptions = computed(() => {
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
</script>

<style>
.fast-admin-layout-default-header {
  height: 3rem;
  padding: 0 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}
</style>

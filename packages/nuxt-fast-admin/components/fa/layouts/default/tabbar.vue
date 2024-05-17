<template>
  <n-tabs
    :value="currentPage?.name"
    :closable="closeable"
    animated
    type="card"
    size="small"
    class="fast-admin-layout-default-tabbar"
    @close="closeTab"
    @update:value="openTab"
  >
    <n-tab
      v-for="history in histories"
      :key="history.name?.toString()"
      :name="history.name?.toString() || 'undefined'"
    >
      <n-flex align="center">
        <fa-icon :name="history.tab.icon" />
        <span>{{ history.tab.title }}</span>
      </n-flex>
    </n-tab>
    <template #prefix>
      <n-space item-style="display: flex; align-items: center">
        <slot name="prefix-start" />
        <n-button
          v-if="tabbarConfig!.refresh"
          text
          :loading="!showPage"
          @click="refreshPage"
        >
          <template #icon>
            <fa-icon name="material-symbols:refresh" />
          </template>
        </n-button>
        <slot name="prefix-end" />
      </n-space>
    </template>
    <template #suffix>
      <n-space item-style="display: flex; align-items: center">
        <slot name="suffix-start" />
        <n-button
          v-if="tabbarConfig!.fullscreen"
          text
          @click="pageFullscreen.toggle"
        >
          <template #icon>
            <fa-icon
              :name="
                pageFullscreen.isFullscreen.value
                  ? 'material-symbols:fullscreen-exit'
                  : 'material-symbols:fullscreen'
              "
            />
          </template>
        </n-button>
        <n-dropdown
          v-if="tabbarConfig!.actions"
          trigger="hover"
          :options="options"
          @select="handleSelect"
        >
          <fa-icon size="18" name="material-symbols:more-horiz" />
        </n-dropdown>
        <slot name="suffix-end" />
      </n-space>
    </template>
  </n-tabs>
</template>

<script setup lang="ts">
import type { NTabs } from "#components";
import { computedEager } from "@vueuse/core";
import type { DropdownOption } from "naive-ui";
import { useDefaultLayoutStore } from "./index.vue";

const tabbarConfig = useAppConfigRef("fastAdmin.layouts.default.tabbar");

const { showPage, refreshPage, pageFullscreen } = useDefaultLayoutStore()!;
const { histories, currentPage, closePage, closeAllPages, closeOtherPages } =
  useNav();

function closeTab(name: string | undefined) {
  const page = histories.value.find((history) => history.name === name);
  if (!page) return;
  closePage(page);
}

function openTab(name: string) {
  navigateTo({ name });
}

const closeable = computedEager(
  () => histories.value.length > 1 || currentPage.value?.name === "/",
);

const options: DropdownOption[] = [
  { label: "关闭当前标签页", key: "close" },
  { label: "关闭全部标签页", key: "close-all" },
  { label: "关闭其他标签页", key: "close-other" },
];

async function handleSelect(value: string) {
  switch (value) {
    case "close":
      await closePage();
      break;
    case "close-all":
      await closeAllPages();
      break;
    case "close-other":
      await closeOtherPages();
      break;
  }
}
</script>

<style>
.fast-admin-layout-default-tabbar {
  height: 39px;
}

.fast-admin-layout-default-tabbar .n-tabs-nav {
  height: 100%;
}

.fast-admin-layout-default-tabbar .n-tabs-nav__prefix {
  padding-left: 16px;
}

.fast-admin-layout-default-tabbar .n-tabs-nav__suffix {
  padding-right: 16px;
}
</style>

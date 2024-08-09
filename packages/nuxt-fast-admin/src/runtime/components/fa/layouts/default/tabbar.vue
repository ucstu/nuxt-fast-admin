<template>
  <n-tabs
    animated
    type="card"
    size="small"
    :value="getToPath(route)"
    :closable="closeable"
    class="fast-admin-layout-default-tabbar"
    @close="closeTab"
    @update:value="openTab"
  >
    <n-tab
      v-for="history in histories"
      :key="getToPath(history.to)"
      :name="getToPath(history.to)!"
    >
      <n-flex align="center">
        <fa-icon :name="history.tab?.icon || history.icon" />
        <span>{{ history.tab?.title || history.title }}</span>
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
import {
  getToPath,
  navigateTo,
  toEqual,
  useModuleConfig,
  useNavHistories,
  useRoute,
} from "#imports";
import { computedEager } from "@ucstu/nuxt-fast-utils/exports";
import type { DropdownOption } from "naive-ui";
import { useDefaultLayoutStore } from "../../../../composables/store";
import { configKey } from "../../../../config";

defineOptions({
  name: "FaLayoutesDefaultTabbar",
});

const route = useRoute();
const histories = useNavHistories();
const { close, closeAll, closeOthers } = histories;
const { showPage, refreshPage, pageFullscreen } = useDefaultLayoutStore()!;
const tabbarConfig = useModuleConfig(configKey, "layouts.default.tabbar");
const navConfig = useModuleConfig("fastNav");

async function closeTab(fullPath: string) {
  await close(fullPath);
}

async function openTab(fullPath: string) {
  await navigateTo(fullPath);
}

const closeable = computedEager(
  () =>
    histories.value.length > 1 ||
    !toEqual(navConfig.value.home, histories.value[0]?.to),
);

const options: DropdownOption[] = [
  { label: "关闭当前标签页", key: "close" },
  { label: "关闭全部标签页", key: "close-all" },
  { label: "关闭其他标签页", key: "close-other" },
];

async function handleSelect(value: string) {
  switch (value) {
    case "close":
      await close();
      break;
    case "close-all":
      await closeAll();
      break;
    case "close-other":
      await closeOthers();
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

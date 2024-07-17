<template>
  <n-tabs
    animated
    type="card"
    size="small"
    :value="current"
    :closable="closeable"
    class="fast-admin-layout-default-tabbar"
    @close="closeTab"
    @update:value="openTab"
  >
    <n-tab v-for="(history, index) in histories" :key="index" :name="index">
      <n-flex align="center">
        <fa-icon :name="history.meta.tab.icon || history.meta.icon" />
        <span>{{ history.meta.tab.title || history.meta.title }}</span>
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
  computed,
  navigateTo,
  toEqual,
  useAppConfig,
  useNavHistories,
} from "#imports";
import type { DropdownOption } from "naive-ui";
import type { ModuleConfigDefaults } from "../../../../types";
import { useDefaultLayoutStore } from "./index.vue";

const appConfig = useAppConfig();
const tabbarConfig = computed(
  () => (appConfig.fastAdmin as ModuleConfigDefaults).layouts.default.tabbar,
);

const histories = useNavHistories();
const { close, closeAll, closeOthers } = histories;
const { showPage, refreshPage, pageFullscreen } = useDefaultLayoutStore()!;

const current = computed(() =>
  histories.value.findIndex((item) => item === histories.current),
);

function closeTab(index: number) {
  close(histories.value[index]);
}

async function openTab(index: number) {
  await navigateTo(histories.value[index]?.to);
}

const closeable = computed(
  () =>
    histories.value.length > 1 ||
    !toEqual(histories.value[0]?.to, histories.current?.to),
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

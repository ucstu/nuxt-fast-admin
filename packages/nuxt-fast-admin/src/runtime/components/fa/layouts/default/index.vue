<template>
  <n-layout class="fast-admin-layout-default" content-style="display: flex; flex-direction: column">
    <n-layout-header>
      <slot name="header" />
    </n-layout-header>
    <n-layout-content style="flex: 1">
      <n-layout class="fast-admin-layout-default-content" :has-sider="current?.menu?.has !== false">
        <n-layout-sider
          v-if="current?.menu?.has !== false"
          ref="sider"
          v-model:collapsed="layoutConfig!.menu!.collapsed"
          :collapsed-width="isMobile ? 0 : layoutConfig!.menu!.collapsedWidth"
          :width="isMobile ? 0 : layoutConfig!.menu!.width"
          collapse-mode="width"
          bordered
        >
          <slot name="sider">
            <fa-layouts-default-menu />
            <div
              v-if="!layoutConfig!.menu!.collapsed"
              ref="resizer"
              class="fast-admin-layout-default-resizer"
              :style="{
                left: siderRealTimeWidth - 4 + 'px',
              }"
            />
          </slot>
        </n-layout-sider>
        <n-layout
          style="height: 100%"
          content-style="display: flex; flex-direction: column"
        >
          <n-layout-header
            v-if="layoutConfig!.header!.show || layoutConfig!.tabbar!.show"
          >
            <slot
              v-if="current?.head?.has !== false && layoutConfig!.header!.show"
              name="content-header"
            >
              <fa-layouts-default-header />
            </slot>
            <slot
              v-if="current?.tab?.has !== false && layoutConfig!.tabbar!.show"
              name="content-tabber"
            >
              <fa-layouts-default-tabbar />
            </slot>
          </n-layout-header>
          <n-layout-content
            v-if="showPage"
            ref="content"
            content-style="position: relative;"
            bordered
            embedded
          >
            <suspense>
              <slot />
            </suspense>
            <n-back-top />
          </n-layout-content>
          <n-layout-footer>
            <slot name="content-footer" />
          </n-layout-footer>
        </n-layout>
      </n-layout>
    </n-layout-content>
    <n-layout-footer>
      <slot name="footer" />
    </n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import type { NLayoutSider } from "#components";
import { ref, useModuleConfig, useNavPages } from "#imports";
import {
  computedEager,
  useDraggable,
  useElementSize,
} from "@ucstu/nuxt-fast-utils/exports";
import { useProvideDefaultLayoutStore } from "../../../../composables/store";
import { configKey } from "../../../../config";

const { content, showPage, isMobile } = useProvideDefaultLayoutStore();
const layoutConfig = useModuleConfig(configKey, "layouts.default");

defineOptions({
  name: "FaLayoutesDefault",
});

// #region 菜单栏
const resizer = ref<HTMLElement>();
const sider = ref<InstanceType<typeof NLayoutSider>>();
const { width: siderRealTimeWidth } = useElementSize(sider);
let handler: number;
useDraggable(resizer, {
  onMove(position) {
    cancelAnimationFrame(handler);
    handler = requestAnimationFrame(() => {
      if (position.x <= 200) {
        return false;
      }
      if (position.x >= 400) {
        return false;
      }
      layoutConfig.value!.menu!.width = position.x;
    });
  },
});
// #endregion

const pages = useNavPages();
const current = computedEager(() => pages.current);
</script>

<style>
.fast-admin-layout-default {
  height: 100%;
}

.fast-admin-layout-default-content {
  height: 100%;
}

.fast-admin-layout-default-resizer {
  bottom: 0 !important;
  cursor: col-resize;
  left: -4px;
  position: absolute;
  top: 0 !important;
  width: 4px;
}
</style>

<template>
  <n-layout has-sider class="fast-admin-layout-default">
    <n-layout-sider
      ref="sider"
      v-model:collapsed="layoutConfig!.menu!.collapsed"
      :collapsed-width="layoutConfig!.menu!.collapsedWidth"
      :width="layoutConfig!.menu!.width"
      collapse-mode="width"
      bordered
    >
      <slot name="menu">
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
    <n-layout content-style="display: flex; flex-direction: column">
      <n-layout-header
        v-if="layoutConfig!.header!.show || layoutConfig!.tabbar!.show"
      >
        <slot v-if="layoutConfig!.header!.show" name="header">
          <fa-layouts-default-header />
        </slot>
        <slot v-if="layoutConfig!.tabbar!.show" name="tabber">
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
        <slot />
        <n-back-top />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import type { NLayoutSider } from "#components";
import {
    createInjectionState,
    useDraggable,
    useElementSize,
    useFullscreen,
} from "@vueuse/core";

const [useProvideDefaultLayoutStore, useDefaultLayoutStore] =
  createInjectionState(() => {
    const content = ref<HTMLElement | null>(null);
    const pageFullscreen = useFullscreen(content);
    const applicationFullscreen = useFullscreen();
    const showPage = ref(true);
    async function refreshPage() {
      showPage.value = false;
      await nextTick(() => {
        showPage.value = true;
      });
    }

    return {
      content,
      pageFullscreen,
      applicationFullscreen,
      showPage,
      refreshPage,
    };
  });

export { useDefaultLayoutStore };
</script>

<script setup lang="ts">
const { content, showPage } = useProvideDefaultLayoutStore();
const layoutConfig = refAppConfig("fastAdmin.layouts.default");

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
</script>

<style>
.fast-admin-layout-default {
  height: 100%;
}

.fast-admin-layout-default-resizer {
  position: absolute;
  top: 0 !important;
  bottom: 0 !important;
  left: -4px;
  width: 4px;
  cursor: col-resize;
}
</style>

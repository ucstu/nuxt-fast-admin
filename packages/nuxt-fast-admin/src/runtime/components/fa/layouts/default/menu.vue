<template>
  <div class="fast-admin-layout-default-menu">
    <slot name="start">
      <div
        class="fast-admin-layout-default-menu-start"
        :style="menuConfig!.collapsed ? 'justify-content: center' : ''"
      >
        <img
          class="fast-admin-layout-default-menu-start-logo"
          :style="!menuConfig!.collapsed ? 'margin-left: 16px' : ''"
          :src="adminConfig.logo"
          alt="logo"
        >
        <h2
          v-show="!menuConfig!.collapsed"
          class="fast-admin-layout-default-menu-start-name"
        >
          {{ adminConfig.name }}
        </h2>
      </div>
    </slot>
    <slot
      :value="getToPath(current?.to)"
      :collapsed="menuConfig!.collapsed"
      :options="options"
    >
      <n-menu
        class="fast-admin-layout-default-menu-content"
        :value="getToPath(current?.to)"
        :collapsed="menuConfig!.collapsed"
        :options="options?.children"
        :root-indent="16"
        accordion
      />
    </slot>
    <slot name="end" />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  useAdminGlobalMenuOptions,
  useAppConfig,
  useNavPages,
} from "#imports";
import type { ModuleConfigDefaults } from "../../../../types";
import { getToPath } from "../../../../utils";

const appConfig = useAppConfig();
const adminConfig = computed(() => appConfig.fastAdmin as ModuleConfigDefaults);
const menuConfig = computed(
  () => (appConfig.fastAdmin as ModuleConfigDefaults).layouts.default.menu
);

const pages = useNavPages();
const current = computed(() => pages.current);
const options = useAdminGlobalMenuOptions();
</script>

<style>
.fast-admin-layout-default-menu {
  height: 100%;
}

.fast-admin-layout-default-menu-start {
  display: flex;
  align-items: center;
  height: 3.75rem;
}

.fast-admin-layout-default-menu-start-logo {
  width: 2.5rem;
}

.fast-admin-layout-default-menu-start-name {
  flex: 1;
  text-align: center;
  text-overflow: ellipsis;
}

.fast-admin-layout-default-menu-content.n-menu--collapsed
  .n-menu-item-content__icon {
  width: 100% !important;
}
</style>

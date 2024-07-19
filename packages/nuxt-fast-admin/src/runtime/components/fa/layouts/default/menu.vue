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
      :value="getToPath($route)"
      :collapsed="menuConfig!.collapsed"
      :options="options"
    >
      <n-menu
        class="fast-admin-layout-default-menu-content"
        :value="getToPath($route)"
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
import { getToPath, useAdminMenuGlobal, useModuleConfig } from "#imports";
import { configKey } from "../../../../config";

const options = useAdminMenuGlobal();
const adminConfig = useModuleConfig(configKey);
const menuConfig = useModuleConfig(configKey, "layouts.default.menu");
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

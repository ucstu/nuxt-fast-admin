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
        ref="menuInstRef"
        v-model:value="value"
        class="fast-admin-layout-default-menu-content"
        :collapsed="menuConfig.collapsed"
        :options="options?.children"
        :root-indent="16"
        :accordion="menuConfig.accordion"
      />
    </slot>
    <slot name="end" />
  </div>
</template>

<script setup lang="ts">
import type { NMenu } from "#components";
import {
  getToPath,
  ref,
  useAdminMenuGlobal,
  useModuleConfig,
  useRouter,
} from "#imports";
import { watchImmediate } from "@ucstu/nuxt-fast-utils/exports";
import type { MenuInst } from "@ucstu/nuxt-naive-ui/exports";
import { configKey } from "../../../../config";

defineOptions({
  name: "FaLayoutesDefaultMenu",
});

const router = useRouter();
const value = ref<string>("");
const options = useAdminMenuGlobal();
const adminConfig = useModuleConfig(configKey);
const menuConfig = useModuleConfig(configKey, "layouts.default.menu");

const menuInstRef = ref<MenuInst | null>(null);
watchImmediate(
  () => router.currentRoute.value,
  (route) => {
    value.value = getToPath(route) ?? value.value;
    menuInstRef.value?.showOption(value.value);
  },
);
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

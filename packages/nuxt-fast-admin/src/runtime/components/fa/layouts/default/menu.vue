<template>
  <define-template>
    <n-flex vertical style="height: 100%; gap: 3px">
      <slot name="start">
        <n-flex
          justify="center"
          align="center"
          class="fast-admin-layout-default-menu-header"
          :style="menuConfig!.collapsed ? 'justify-content: center' : ''"
        >
          <n-avatar color="#0000" size="large" :src="adminConfig.logo" />
          <n-h3
            v-show="!menuConfig!.collapsed"
            style="margin: 0"
            @click="
              isMobile
                ? (menuConfig!.collapsed = !menuConfig!.collapsed)
                : undefined
            "
          >
            {{ adminConfig.name }}
          </n-h3>
        </n-flex>
      </slot>
      <slot
        :value="value"
        :collapsed="menuConfig!.collapsed"
        :options="options"
      >
        <n-scrollbar>
          <n-menu
            ref="menuInstRef"
            v-model:value="value"
            :collapsed="menuConfig.collapsed"
            :options="options?.children"
            :root-indent="16"
            :accordion="menuConfig.accordion"
          />
        </n-scrollbar>
      </slot>
      <slot name="end" />
    </n-flex>
  </define-template>
  <n-drawer
    v-if="isMobile"
    :show="!menuConfig!.collapsed"
    placement="left"
    @mask-click="menuConfig!.collapsed = true"
  >
    <reuse-template />
  </n-drawer>
  <reuse-template v-else />
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
import {
  createReusableTemplate,
  watchImmediate,
} from "@ucstu/nuxt-fast-utils/exports";
import type { MenuInst } from "@ucstu/nuxt-naive-ui/exports";
import { useDefaultLayoutStore } from "../../../../composables/store";
import { configKey } from "../../../../config";

defineOptions({
  name: "FaLayoutesDefaultMenu",
});

const { currentRoute } = useRouter();
const value = ref<string>("");
const options = useAdminMenuGlobal();
const { isMobile } = useDefaultLayoutStore()!;
const adminConfig = useModuleConfig(configKey);
const menuConfig = useModuleConfig(configKey, "layouts.default.menu");

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const menuInstRef = ref<MenuInst | null>(null);
watchImmediate(currentRoute, (route) => {
  value.value = getToPath(route) ?? value.value;
  menuInstRef.value?.showOption(value.value);
});
</script>

<style>
.fast-admin-layout-default-menu-header {
  height: 3rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
</style>

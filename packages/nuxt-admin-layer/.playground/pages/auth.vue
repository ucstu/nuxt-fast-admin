<template>
  <fa-pages-auth>
    <template #form-header="{ _name }">
      <div class="fast-admin-page-auth-box-form-header">
        <h1>{{ _name }}</h1>
      </div>
    </template>
    <template #="{ authType, model }">
      <n-form-item label="用户名" path="username">
        <n-select
          v-model:value="model.username"
          tag
          filterable
          :loading="status === 'pending'"
          :options="codeOptions"
          placeholder="请选择用户名"
          @scroll="loadMore"
        />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input
          v-model:value="model.password"
          type="password"
          placeholder="请输入密码"
        />
      </n-form-item>
      <n-form-item v-if="authType === 'signUp'" label="重复密码" path="repeat">
        <n-input
          v-model:value="model.repeat"
          type="password"
          placeholder="请重复密码"
        />
      </n-form-item>
    </template>
    <template #image="{ picture }">
      <div
        v-if="picture"
        class="fast-admin-page-auth-box-img flex content-center"
      >
        <img
          class="absolute left-4 top-4"
          :src="config.logo"
          alt="logo"
          width="40px"
        >
        <img :src="picture" alt="pic" class="w-full" >
        <span class="absolute left-2 bottom-1"> 版本号: 3.0.1 </span>
      </div>
    </template>
  </fa-pages-auth>
</template>

<script setup lang="ts">
import type { SelectOption } from "naive-ui";

definePageMeta({
  layout: "full",
  auth: false,
  menu: {
    show: false,
  },
  tab: {
    show: false,
  },
});

const config = useModuleConfig("fastAdmin");

const page = ref<number>(0);
const { data, status, execute } = await useFims("/auth/users", {
  query: {
    filter: "",
    page,
  },
});

const codeOptions = ref<SelectOption[]>(dataToOptions(data.value));
function dataToOptions(_data: typeof data.value): Array<SelectOption> {
  return (
    _data?.content?.map((item) => ({
      value: item.username,
      label: item.nickName,
    })) || []
  );
}
async function loadMore() {
  page.value++;
  await execute();
  codeOptions.value = codeOptions.value.concat(dataToOptions(data.value));
}
</script>

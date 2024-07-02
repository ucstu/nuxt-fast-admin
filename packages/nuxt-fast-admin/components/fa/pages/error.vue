<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="fast-admin-page-error">
    <n-result
      ref="resultRef"
      :status="status && (`${status}` as unknown as undefined)"
      :title="code ? (message ? `(${code}) ${message}` : `(${code})`) : message"
      :description="description !== message ? description : undefined"
      style="width: 100%"
      :size="size"
    >
      <slot
        :icon="IconMap[code]"
        :code="code"
        :stack="stack"
        :status="status"
        :message="message"
        :detiail="detiail"
        :description="description"
      >
        <div v-if="detiail !== description">
          <div v-if="isHTML(detiail)" style="padding: 0 20px 10px 20px">
            <n-collapse-transition
              :show="showStack"
              class="fast-admin-page-error-stack"
            >
              <n-scrollbar x-scrollable y-scrollable style="max-height: 35vh">
                <div v-html="detiail" />
              </n-scrollbar>
            </n-collapse-transition>
          </div>
          <p v-else class="fast-admin-page-error-detail">{{ detiail }}</p>
        </div>
        <div style="padding: 0 20px">
          <n-collapse-transition
            :show="showStack"
            class="fast-admin-page-error-stack"
          >
            <n-scrollbar x-scrollable y-scrollable style="max-height: 35vh">
              <n-log v-if="!isHTML(stack || '')" :log="stack" />
              <div v-else v-html="stack" />
            </n-scrollbar>
          </n-collapse-transition>
        </div>
      </slot>
      <template #icon>
        <slot name="icon" :code="code" :status="status">
          <fa-icon
            v-if="IconMap[code]"
            size="var(--n-icon-size)"
            :name="IconMap[code]!"
          />
          <n-icon v-else size="var(--n-icon-size)" color="var(--n-icon-color)">
            <info-icon v-if="status === 'info'" />
            <success-icon v-else-if="status === 'success'" />
            <warning-icon v-else-if="status === 'warning'" />
            <error-icon v-else-if="status === 'error'" />
          </n-icon>
        </slot>
      </template>
      <template #footer>
        <slot
          name="footer"
          :icon="IconMap[code]"
          :code="code"
          :stack="stack"
          :status="status"
          :message="message"
          :detiail="detiail"
          :description="description"
        >
          <n-flex justify="center" class="gap-20px">
            <template v-if="status === 401">
              <n-button @click="goAuth"> 前往认证 </n-button>
            </template>
            <template v-else-if="status === 403 || status === 404">
              <n-button @click="goHome"> 返回首页 </n-button>
              <n-button @click="goBack"> 返回上一页 </n-button>
            </template>
            <template v-else>
              <n-button @click="known"> 知道了 </n-button>
            </template>
            <n-button v-if="stack" @click="toggleShowStack()">
              {{ showStack ? "隐藏" : "显示" }}调用栈
            </n-button>
          </n-flex>
        </slot>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts"></script>

<script setup lang="ts">
import type { NuxtError } from "#app";
import { computedEager } from "@vueuse/core";
import defu from "defu";
import type { NResult } from "naive-ui";
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "naive-ui/es/_internal/icons/index";
import { FetchError } from "ofetch";
import type { ErrorLevel } from "../../../types/base";
function isHTML(str: string | undefined) {
  if (!str) return false;
  return /<\/?[a-z][\s\S]*>/i.test(str);
}

const CAN_PPROCESS_STATUS = [
  401,
  403,
  404,
  418,
  500,
  "info",
  "success",
  "warning",
  "error",
] as const;
type CanProcessStatus = (typeof CAN_PPROCESS_STATUS)[number] | ErrorLevel;

const props = withDefaults(
  defineProps<{
    /**
     * 状态
     */
    // eslint-disable-next-line vue/require-default-prop
    status?: CanProcessStatus;
    /**
     * 错误信息
     */
    error: NuxtError | Error;
    /**
     * 大小
     */
    size?: "medium" | "small" | "large" | "huge";
  }>(),
  {
    size: "medium",
  },
);

const emit = defineEmits<{
  /**
   * 清除错误
   * @description 点击我知道了按钮时触发
   */
  clearError: [optionsAndError: { redirect?: string } & Error];
}>();

const router = useRouter();
const adminConfig = refAppConfig("fastAdmin");
const authConfig = refAppConfig("fastAuth");

function isFetchError(error: Error | undefined | null): error is FetchError {
  return error instanceof FetchError;
}

const options = computedEager(() =>
  defu(
    isFetchError(props.error) ? adminConfig.value.fetch!.error : {},
    adminConfig.value.error,
  ),
);
const error = computed(() =>
  isNuxtError(props.error)
    ? props.error.statusCode === 500
      ? props.error.cause &&
        (props.error.cause as NuxtError)?.statusCode !== 500
        ? (props.error.cause as NuxtError)
        : props.error
      : props.error
    : props.error,
);
const code = computed(() => {
  return (typeof props.status === "number" ? props.status : undefined) ||
    isFetchError(error.value)
    ? Number.parseInt(
        (error.value as FetchError).response?._data[
          adminConfig.value.fetch!.status!
        ],
      ) ||
        (error.value as FetchError).statusCode ||
        0
    : (error.value as NuxtError).statusCode || 0;
});
const stack = computed(() => error.value.stack || props.error.stack);
const status = computed<CanProcessStatus>(() => {
  return (
    props.status ||
    (error.value as NuxtError).data?.level ||
    (CAN_PPROCESS_STATUS.includes(code.value as CanProcessStatus)
      ? (code.value as CanProcessStatus)
      : (options.value.level as CanProcessStatus))
  );
});

const IconMap: Partial<Record<number, string>> = {
  401: "twemoji:face-with-monocle",
  403: "twemoji:raised-back-of-hand",
  404: "twemoji:thinking-face",
  418: "twemoji:teacup-without-handle",
  500: "twemoji:face-with-crossed-out-eyes",
};
const MessageMap: Partial<Record<number, string>> = {
  401: "没有认证",
  403: "禁止访问",
  404: "资源不存在",
  418: "服务器忙",
  500: "服务器错误",
};
const message = computed(() => {
  return (
    MessageMap[code.value] ||
    (error.value instanceof TypeError &&
    error.value.message === "Failed to fetch"
      ? "连接失败"
      : error.value instanceof DOMException &&
          error.value.message === "signal is aborted without reason"
        ? "请求取消"
        : (error.value as NuxtError).statusMessage ||
          (error.value as NuxtError).message)
  );
});

const DescriptionMap: Partial<Record<number, string>> = {
  401: "您未进行认证（登录）操作",
  403: "您没有权限查看页面/进行操作",
  404: "访问的页面不存在/请求异常",
  418: "服务器繁忙，请稍后再试",
  500: "服务器内部发生了错误",
};
const description = computed(() => {
  return (
    DescriptionMap[code.value] ||
    (error.value instanceof TypeError &&
    error.value.message === "Failed to fetch"
      ? "连接服务器失败，请更换网络连接或稍后再试"
      : error.value instanceof DOMException &&
          error.value.message === "signal is aborted without reason"
        ? "请求已取消，可能因为连续发起了重复请求"
        : ((error.value as FetchError).response?._data[
            adminConfig.value.fetch.message
          ] as string) ||
          (error.value as NuxtError).message ||
          (error.value as NuxtError).statusMessage)
  );
});

const detiail = computed(() => {
  return (
    (error.value as NuxtError).data?.detail ||
    (error.value as NuxtError).message ||
    (error.value as NuxtError).statusMessage
  );
});

function goAuth() {
  emit(
    "clearError",
    defu(error.value, { redirect: authConfig.value.pages!.signIn }),
  );
}
function goHome() {
  emit(
    "clearError",
    defu(error.value, { redirect: authConfig.value.pages!.home }),
  );
}
function goBack() {
  emit(
    "clearError",
    defu(error.value, {
      redirect:
        (router.options.history.state.back as string) ||
        authConfig.value.pages!.home,
    }),
  );
}
function known() {
  emit("clearError", props.error);
}

const showStack = ref(import.meta.dev && Boolean(stack.value));
function toggleShowStack() {
  showStack.value = !showStack.value;
}
</script>

<style>
.fast-admin-page-error {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fast-admin-page-error-detail {
  white-space: pre-warp;
  text-align: center;
}

.fast-admin-page-error-stack {
  margin: 0 auto;
  max-width: 1280px;
  border-radius: 0.5rem;
  background-color: rgb(0 0 0 / 1);
  padding: 20px;
  color: rgb(255 255 255 / 1);
  box-sizing: border-box;
}
</style>

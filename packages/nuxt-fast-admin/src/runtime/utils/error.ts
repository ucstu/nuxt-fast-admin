import type { NuxtError } from "#app";
import { isNuxtError, showError, useModuleConfig } from "#imports";
import defu from "defu";
import { FetchError } from "ofetch";
import { configKey } from "../config";
import type { ErrorOptions } from "../types";

export function isFetchError(
  error: Error | undefined | null,
): error is FetchError {
  return error instanceof FetchError;
}

const MessageMap: Partial<Record<number, string>> = {
  401: "没有认证",
  403: "禁止访问",
  404: "资源不存在",
  418: "服务器忙",
  500: "服务器错误",
};
const DescriptionMap: Partial<Record<number, string>> = {
  401: "您未进行认证（登录）操作",
  403: "您没有权限查看页面/进行操作",
  404: "访问的页面不存在/请求异常",
  418: "服务器繁忙，请稍后再试",
  500: "服务器内部发生了错误",
};

const errorMap = new Set<number>();
export function handleError(
  error: NuxtError | Error | string | undefined | null,
  config: ErrorOptions = {},
) {
  const adminConfig = useModuleConfig(configKey);
  const _error: NuxtError | Error | undefined | null =
    typeof error === "string" ? new Error(error) : error;
  const { handler, level, duration, interval, propagate } = defu(
    config,
    _error && isNuxtError(_error) ? { level: _error.data?.level } : {},
    isFetchError(_error) ? adminConfig.value.fetch.error : {},
    adminConfig.value.error,
  );
  if (!_error) return propagate ? false : true;
  const realError = isNuxtError(_error)
    ? _error.statusCode === 500
      ? _error.cause && (_error.cause as NuxtError)?.statusCode !== 500
        ? (_error.cause as NuxtError)
        : _error
      : _error
    : _error;
  const code = isFetchError(realError)
    ? Number.parseInt(
        (realError as FetchError).response?._data[
          adminConfig.value.fetch.status
        ],
      ) ||
      (realError as FetchError).statusCode ||
      0
    : (realError as NuxtError).statusCode || 0;
  const message =
    MessageMap[code] ||
    (realError instanceof TypeError && realError.message === "Failed to fetch"
      ? "连接失败"
      : realError instanceof DOMException &&
          realError.message === "signal is aborted without reason"
        ? "请求取消"
        : (realError as NuxtError).statusMessage ||
          (realError as NuxtError).message);
  const description =
    DescriptionMap[code] ||
    (realError instanceof TypeError && realError.message === "Failed to fetch"
      ? "连接服务器失败，请更换网络连接或稍后再试"
      : realError instanceof DOMException &&
          realError.message === "signal is aborted without reason"
        ? "请求已取消，可能因为连续发起了重复请求"
        : ((realError as FetchError).response?._data[
            adminConfig.value.fetch.message
          ] as string) ||
          (realError as NuxtError).message ||
          (realError as NuxtError).statusMessage);
  const title = code
    ? message
      ? `(${code}) ${message}`
      : `(${code})`
    : message;

  if (errorMap.has(code) && code !== 0 && interval !== 0) return false;
  errorMap.add(code);
  setTimeout(() => {
    errorMap.delete(code);
    switch (handler) {
      case "message":
        globalThis.$message?.[level](title, {
          duration: duration,
          keepAliveOnHover: true,
        });
        break;
      case "dialog":
        globalThis.$dialog?.[level]({
          title: title,
          content: description !== message ? description : undefined,
          positiveText: "知道了",
        });
        break;
      case "notify":
        globalThis.$notification?.[level]({
          title: title,
          content: description !== message ? description : undefined,
          duration: duration,
          keepAliveOnHover: true,
        });
        break;
      case "global":
        showError(realError);
        break;
    }
  }, interval);
  return propagate ? false : handler !== "none";
}

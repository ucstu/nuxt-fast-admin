import type { NuxtApp } from "#app";
import { useNuxtApp } from "#imports";
import { get } from "lodash-es";
import type { Get, LiteralUnion, Paths } from "type-fest";
import type { LiteralKeyOf } from "type-fest/source/internal";
import type { WritableComputedRef } from "vue-demi";
import type { ModuleConfigs } from "../types";
import { isNuxtApp } from "../utils";
import { $useAppConfig } from "./nuxt";
import { toRefDeep } from "./state";

type ModuleNames = LiteralUnion<LiteralKeyOf<ModuleConfigs> & string, string>;

export function useModuleConfig<
  Name extends ModuleNames,
  Module extends ModuleConfigs[Name],
>(module: Name, nuxtApp?: NuxtApp): WritableComputedRef<Module>;
export function useModuleConfig<
  Name extends ModuleNames,
  Module extends ModuleConfigs[Name],
  Key extends LiteralUnion<Paths<Module> & string, string>,
>(
  module: Name,
  key: Key,
  nuxtApp?: NuxtApp,
): WritableComputedRef<Get<Module, Key>>;
export function useModuleConfig<
  Name extends ModuleNames,
  Module extends ModuleConfigs[Name],
  Key extends LiteralUnion<Paths<Module> & string, string>,
>(module: Name, keyOrNuxtApp?: Key | NuxtApp, nuxtApp?: NuxtApp) {
  nuxtApp = (isNuxtApp(keyOrNuxtApp) ? keyOrNuxtApp : nuxtApp) ?? useNuxtApp();
  const key = isNuxtApp(keyOrNuxtApp) ? undefined : keyOrNuxtApp;
  const appConfig = $useAppConfig(nuxtApp);
  return key
    ? toRefDeep(appConfig, `${module}.${key}`)
    : toRefDeep(appConfig, module);
}

export function getModuleConfig<
  Name extends ModuleNames,
  Module extends ModuleConfigs[Name],
>(module: Name, nuxtApp?: NuxtApp): Module;
export function getModuleConfig<
  Name extends ModuleNames,
  Module extends ModuleConfigs[Name],
  Key extends LiteralUnion<Paths<Module> & string, string>,
>(module: Name, key: Key, nuxtApp?: NuxtApp): Get<Module, Key>;
export function getModuleConfig<
  Name extends ModuleNames,
  Module extends ModuleConfigs[Name],
  Key extends LiteralUnion<Paths<Module> & string, string>,
>(module: Name, keyOrNuxtApp?: Key | NuxtApp, nuxtApp?: NuxtApp) {
  nuxtApp = (isNuxtApp(keyOrNuxtApp) ? keyOrNuxtApp : nuxtApp) ?? useNuxtApp();
  const key = isNuxtApp(keyOrNuxtApp) ? undefined : keyOrNuxtApp;
  const appConfig = $useAppConfig(nuxtApp);
  return key ? get(appConfig, `${module}.${key}`) : get(appConfig, module);
}

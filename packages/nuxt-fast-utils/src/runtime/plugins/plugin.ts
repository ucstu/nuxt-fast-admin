import { defineNuxtPlugin, type NuxtApp } from "#app";
import { isEqual, pick } from "lodash-es";
import { useModuleConfig } from "../composables";
import { configKey } from "../config";
import { nuxtApp, resolveTo } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(_nuxtApp) {
    const utilsConfig = useModuleConfig(configKey);

    nuxtApp.value = _nuxtApp as NuxtApp;

    _nuxtApp.hook("fast-utils:to-equal", (source, target, result) => {
      if (!source || !target) return;
      const _source = resolveTo(source, _nuxtApp as NuxtApp);
      const _target = resolveTo(target, _nuxtApp as NuxtApp);
      result.value = isEqual(
        pick(_source, ...utilsConfig.value.keys),
        pick(_target, ...utilsConfig.value.keys),
      );
    });
  },
});

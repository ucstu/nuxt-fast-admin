import { defineNuxtPlugin, type NuxtApp } from "#app";
import { isEqual, pickBy } from "lodash-es";
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
        pickBy(_source, (value, key) => {
          if (value === null || value === undefined) return false;
          if (typeof value === "object" && Object.keys(value).length === 0)
            return false;
          if (!utilsConfig.value.keys.includes(key)) return false;
          return true;
        }),
        pickBy(_target, (value, key) => {
          if (value === null || value === undefined) return false;
          if (typeof value === "object" && Object.keys(value).length === 0)
            return false;
          if (!utilsConfig.value.keys.includes(key)) return false;
          return true;
        }),
      );
    });
  },
});

import { defineNuxtPlugin, useRouter, type NuxtApp } from "#app";
import { isEqual, pick } from "lodash-es";
import { useModuleConfig } from "../composables";
import { configKey } from "../config";
import { fixTo, nuxtApp } from "../utils";

export default defineNuxtPlugin({
  enforce: "pre",
  setup(_nuxtApp) {
    const router = useRouter();
    const utilsConfig = useModuleConfig(configKey);

    nuxtApp.value = _nuxtApp as NuxtApp;

    _nuxtApp.hook("fast-utils:to-equal", (source, target, result) => {
      if (!source || !target) return;
      const _source = router.resolve(fixTo(source));
      const _target = router.resolve(fixTo(target));
      result.value =
        isEqual(
          pick(_source, ...utilsConfig.value.keys),
          pick(_target, ...utilsConfig.value.keys)
        ) ||
        (_target.path.match(/\/:/) !== null &&
          _source.matched.some((route) =>
            isEqual(
              pick(route, ...utilsConfig.value.keys),
              pick(_target, ...utilsConfig.value.keys)
            )
          ));
    });
  },
});

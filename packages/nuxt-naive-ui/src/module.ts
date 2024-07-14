import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
} from "@nuxt/kit";
import { addModuleTypeTemplate } from "@ucstu/nuxt-fast-utils/utils";
import { camelCase, upperFirst } from "lodash-es";
import { name, version } from "../package.json";
import { configKey, defaults, initModule } from "./runtime/config";
import type { ModuleOptions } from "./runtime/types";

export type {
  ModuleOptions,
  ModulePublicRuntimeConfig,
} from "./runtime/types/module";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
  },
  defaults,
  setup(_options, nuxt) {
    installModule("@ucstu/nuxt-fast-utils");

    const options = initModule(_options, nuxt);

    addModuleTypeTemplate({
      nuxt,
      name,
      options,
      configKey,
      __dirname,
    });

    const { resolve } = createResolver(import.meta.url);

    if (process.env.NODE_ENV === "development") {
      const optimizeDeps = ["naive-ui"];
      extendViteConfig((config) => {
        config.optimizeDeps ||= {};
        config.optimizeDeps.include ||= [];
        for (const item of optimizeDeps) {
          if (!config.optimizeDeps.include.includes(item)) {
            config.optimizeDeps.include.push(`${name} > ${item}`);
          }
        }
      });
      const transpile = ["@juggle/resize-observer"];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    } else {
      const transpile = [
        "naive-ui",
        "vueuc",
        "@css-render/vue3-ssr",
        "@juggle/resize-observer",
        "@iconify/vue",
      ];
      for (const item of transpile) {
        if (!nuxt.options.build.transpile.includes(item)) {
          nuxt.options.build.transpile.push(item);
        }
      }
    }

    addPlugin({
      name,
      mode: "server",
      src: resolve("./runtime/plugins/plugin"),
    });

    const components = [
      "NThemeEditor",
      "NAffix",
      "NAlert",
      "NAnchor",
      "NAnchorLink",
      "NAutoComplete",
      "NAvatar",
      "NAvatarGroup",
      "NBackTop",
      "NBadge",
      "NBreadcrumb",
      "NBreadcrumbItem",
      "NButton",
      "NButtonGroup",
      "NCalendar",
      "NColorPicker",
      "NCard",
      "NCarousel",
      "NCarouselItem",
      "NCascader",
      "NCheckbox",
      "NCheckboxGroup",
      "NCode",
      "NCollapse",
      "NCollapseItem",
      "NCollapseTransition",
      "NConfigProvider",
      "NCountdown",
      "NNumberAnimation",
      "NDataTable",
      "NDatePicker",
      "NDescriptions",
      "NDescriptionsItem",
      "NDialog",
      "NDialogProvider",
      "NDivider",
      "NDrawer",
      "NDrawerContent",
      "NDropdown",
      "NDynamicInput",
      "NDynamicTags",
      "NElement",
      "NEl",
      "NEllipsis",
      "NPerformantEllipsis",
      "NEmpty",
      "NFlex",
      "NForm",
      "NFormItem",
      "NFormItemGridItem",
      "NFormItemGi",
      "NFormItemCol",
      "NFormItemRow",
      "NFloatButton",
      "NFloatButtonGroup",
      "NGlobalStyle",
      "NGradientText",
      "NGrid",
      "NGridItem",
      "NGi",
      "NIcon",
      "NIconWrapper",
      "NImage",
      "NImageGroup",
      "NInput",
      "NInputGroup",
      "NInputGroupLabel",
      "NInputNumber",
      "NLayout",
      "NLayoutContent",
      "NLayoutHeader",
      "NLayoutFooter",
      "NLayoutSider",
      "NRow",
      "NCol",
      "NLegacyTransfer",
      "NList",
      "NListItem",
      "NLoadingBarProvider",
      "NLog",
      "NInfiniteScroll",
      "NMenu",
      "NMention",
      "NMessageProvider",
      "NModal",
      "NModalProvider",
      "NNotificationProvider",
      "NPageHeader",
      "NPagination",
      "NPopconfirm",
      "NPopover",
      "NPopselect",
      "NProgress",
      "NQrCode",
      "NRadio",
      "NRadioGroup",
      "NRadioButton",
      "NRate",
      "NResult",
      "NScrollbar",
      "NSelect",
      "NSkeleton",
      "NSlider",
      "NSpace",
      "NSpin",
      "NSplit",
      "NStatistic",
      "NSteps",
      "NStep",
      "NSwitch",
      "NTable",
      "NTh",
      "NTr",
      "NTd",
      "NThead",
      "NTbody",
      "NTabs",
      "NTabPane",
      "NTab",
      "NTag",
      "NThing",
      "NTime",
      "NTimePicker",
      "NTimeline",
      "NTimelineItem",
      "NTooltip",
      "NTransfer",
      "NTree",
      "NTreeSelect",
      "NH1",
      "NH2",
      "NH3",
      "NH4",
      "NH5",
      "NH6",
      "NA",
      "NP",
      "NBlockquote",
      "NHr",
      "NUl",
      "NOl",
      "NLi",
      "NText",
      "NUpload",
      "NUploadDragger",
      "NUploadTrigger",
      "NUploadFileList",
      "NVirtualList",
      "NWatermark",
      "NEquation",
    ];

    const clientOnlyComponents = ["NDrawer", "NDrawerContent", "NModal"];

    components.forEach((name) => {
      addComponent({
        export: name,
        name,
        filePath: resolve("./runtime/components"),
        mode: clientOnlyComponents.includes(upperFirst(camelCase(name)))
          ? "client"
          : "all",
      });
    });

    const composables = [
      "useOsTheme",
      "create",
      "createTheme",
      "c",
      "cE",
      "cM",
      "cB",
      "cNotM",
      "createLocale",
      "useDialog",
      "useDialogReactiveList",
      "useLoadingBar",
      "useMessage",
      "useModal",
      "useModalReactiveList",
      "useNotification",
      "treeGetClickTarget",
      "createDiscreteApi",
      "useThemeVars",
    ];

    addImportsSources({
      from: resolve("./runtime/composables"),
      imports: [...composables, "useNaiveUiTheme", "useNaiveUiThemeConfig"],
    });
  },
});

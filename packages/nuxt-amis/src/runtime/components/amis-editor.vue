<template>
  <editor v-bind="props" />
</template>

<script lang="ts" setup>
import type { RenderOptions, Schema, SchemaObject } from "amis";
import {
  Editor as _Editor,
  type EditorManager,
  type EditorNodeType,
  type PluginClass,
  type RendererPluginAction,
} from "amis-editor";
import { applyPureReactInVue } from "veaury";

import "amis-editor-core/lib/style.css";

defineOptions({
  name: "AmisEditor",
});

const props = defineProps<{
  value: SchemaObject;
  onChange: (value: SchemaObject) => void;
  preview?: boolean;
  isMobile?: boolean;
  isSubEditor?: boolean;
  autoFocus?: boolean;
  className?: string;
  schemas?: Array<Schema>;
  theme?: string;
  /** 工具栏模式 */
  toolbarMode?: "default" | "mini";
  /** 是否需要弹框 */
  noDialog?: boolean;
  /** 应用语言类型 */
  appLocale?: string;
  /** 是否开启多语言 */
  i18nEnabled?: boolean;
  showCustomRenderersPanel?: boolean;
  amisDocHost?: string;
  superEditorData?: unknown;
  withSuperDataSchema?: boolean;
  /** 当前 Editor 为 SubEditor 时触发的宿主节点 */
  hostManager?: EditorManager;
  hostNode?: EditorNodeType;
  dataBindingChange?: (
    value: string,
    data: unknown,
    manager?: EditorManager,
  ) => void;
  /**
   * Preview 预览前可以修改配置。
   * 比如把api地址替换成 proxy 地址。
   */
  schemaFilter?: (schema: unknown, isPreview?: boolean) => unknown;
  amisEnv?: RenderOptions;
  /**
   * 上下文数据，设置后，面板和脚手架表单里面可以取到这些值。
   */
  ctx?: unknown;
  data?: unknown;
  /**
   * 是否禁用内置插件
   */
  disableBultinPlugin?: boolean;
  /**
   * 插件场景
   */
  scene?: string;
  disablePluginList?:
    | Array<string>
    | ((id: string, plugin: PluginClass) => boolean);
  plugins?: Array<
    | PluginClass
    | [PluginClass, Record<string, unknown> | (() => Record<string, unknown>)]
  >;
  /**
   * 传给预览器的其他属性
   */
  previewProps?: unknown;
  isHiddenProps?: (key: string) => boolean;
  /**
   * 事件动作面板相关配置
   */
  actionOptions?: {
    showOldEntry?: boolean;
    /**
     * 通用动作集（事件动作面板左侧动作树）
     */
    actionTreeGetter?: (
      actionTree: RendererPluginAction[],
    ) => RendererPluginAction[];
    /**
     * 自定义动作配置
     */
    customActionGetter?: (manager: EditorManager) => {
      [propName: string]: RendererPluginAction;
    };
  };
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onPreview?: (preview: boolean) => void;
  /** 打开公式编辑器之前触发的事件 */
  onFormulaEditorOpen?: (
    node: EditorNodeType,
    manager: EditorManager,
    ctx: Record<string, unknown>,
    host?: {
      node?: EditorNodeType;
      manager?: EditorManager;
    },
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ) => Promise<void | boolean>;
  getHostNodeDataSchema?: () => Promise<unknown>;
  getAvaiableContextFields?: (node: EditorNodeType) => Promise<unknown>;
}>();
const Editor = applyPureReactInVue(_Editor);
</script>

<style lang="css" scoped>
:deep(.ae-Editor) {
  height: 100%;
  width: 100%;
}
</style>

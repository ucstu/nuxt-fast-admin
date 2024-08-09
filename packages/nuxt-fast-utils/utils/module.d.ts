import type { Nuxt, NuxtApp } from "@nuxt/schema";
interface AddModuleTypeTemplateOptions {
  /**
   * nuxt对象
   */
  nuxt: Nuxt;
  /**
   * 模块名称
   */
  name: string;
  /**
   * 模块选项
   */
  options: unknown;
  /**
   * 配置键
   */
  configKey: string;
  /**
   * 文件夹名称
   */
  __dirname: string;
  /**
   * 扩展内容
   */
  getContents?: (data: {
    nuxt: Nuxt;
    app: NuxtApp;
    options: {
      fileName: string;
      moduleName: string;
      optionsName: string;
    };
  }) => string | Promise<string>;
}
/**
 * 添加模块类型模板
 * @param options
 */
export declare function addModuleTypeTemplate(
  options: AddModuleTypeTemplateOptions,
): void;
export {};

import type { configKey } from "../../module";
import type { ModuleConfigDefaults } from "./config";

export interface AppConfigOverrides {
  [configKey]: ModuleConfigDefaults;
  [key: string]: unknown;
}

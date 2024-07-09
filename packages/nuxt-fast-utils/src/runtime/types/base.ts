import type { configKey } from "../../config";
import type { ModuleConfigDefaults } from "./config";

export interface AppConfigOverrides {
  [configKey]: ModuleConfigDefaults;
  [key: string]: unknown;
}

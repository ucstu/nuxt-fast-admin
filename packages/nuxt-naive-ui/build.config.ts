import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: [
    "#app",
    "#imports",
    "#vue-router",
    "#build/types/app.config",
    "defu",
    "lodash-es",
  ],
});

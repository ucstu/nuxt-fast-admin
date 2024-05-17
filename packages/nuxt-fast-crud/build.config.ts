import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: ["#app", "#imports", "#vue-router", "defu", "lodash-es"],
});

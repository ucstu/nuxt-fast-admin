import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: [
    "#app",
    "#imports",
    "#vue-router",
    "#build/types/app.config",
    "defu",
    "hookable",
    "lodash-es",
  ],
  entries: [
    {
      builder: "mkdist",
      input: "./src/utils/",
      outDir: "./dist/utils",
      ext: "js",
    },
  ],
});

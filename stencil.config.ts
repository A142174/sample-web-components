import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "addresssearch",
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www",
      serviceWorker: null
    }
  ]
};

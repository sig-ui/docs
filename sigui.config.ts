type SiguiConfig = import("../packages/theme/src/resolve.js").SiguiConfig;

const config: SiguiConfig = {
  brand: "#6366f1",
  spacing: {
    includeExtended: true,
  },
  output: {
    dir: "sigui",
  },
  performance: {
    css: {
      maxSelectorSpecificity: [0, 5, 2],
    },
  },
};

export default config;

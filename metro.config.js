/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig();
  return {
    resolver: {
      sourceExts: [...sourceExts, 'vue'],
    },
    transformer: {
      babelTransformerPath: require.resolve('./vueTransformerPlugin.js'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  };
})();

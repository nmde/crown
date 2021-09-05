/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const upstreamTransformer = require('metro-react-native-babel-transformer');
const vueNativeScripts = require('vue-native-scripts');

const vueExtensions = ['vue'];

module.exports.transform = function transform({ src, filename, options }) {
  if (vueExtensions.some((ext) => filename.endsWith(`.${ext}`))) {
    return vueNativeScripts.transform({ filename, options, src });
  }
  return upstreamTransformer.transform({ filename, options, src });
};

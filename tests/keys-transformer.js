// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: keysTransformer } = require('ts-transformer-keys/transformer');

module.exports = {
  name: 'keys-transformer',
  version: 1,
  factory(cs) {
    return (ctx) => keysTransformer(cs.tsCompiler.program)(ctx);
  },
};

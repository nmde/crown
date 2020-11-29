/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const { fusebox } = require('fuse-box');

const fuse = fusebox({
  entry: 'src/backend/index.ts',
  target: 'server',
});

if (process.env.NODE_ENV === 'development') {
  fuse.runDev();
} else {
  fuse.runProd();
}

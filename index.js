/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const serverManifest = require('./dist/manifest-server.json');

require(serverManifest[0].absPath);

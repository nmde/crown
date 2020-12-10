/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const { fusebox } = require('fuse-box');
const { compileFromFile } = require('json-schema-to-typescript');
const path = require('path');

const dir = path.join(__dirname, 'src', 'backend', 'schemas');

async function compileSchemas() {
  ((await fs.readdir(dir)) as string[])
    .filter((category) => !/\.ts$/.test(category))
    .forEach(async (category) => {
      const defDir = path.join(__dirname, 'src', 'types', 'schemas', category);
      await fs.ensureDir(defDir);
      ['Query', 'Response'].forEach(async (file) => {
        await fs.writeFile(
          path.join(defDir, `${file}.d.ts`),
          await compileFromFile(path.join(dir, category, `${file}.json`)),
        );
      });
    });
}

compileSchemas();

const fuse = fusebox({
  entry: 'src/backend/index.ts',
  target: 'server',
});

if (process.env.NODE_ENV === 'development') {
  fuse.runDev();
} else {
  fuse.runProd();
}

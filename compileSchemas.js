/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const { compileFromFile } = require('json-schema-to-typescript');
const path = require('path');

const dir = path.resolve(__dirname, 'src', 'backend', 'schemas');

async function compileSchemas() {
  (await fs.readdir(dir))
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

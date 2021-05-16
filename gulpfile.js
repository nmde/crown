/* eslint-disable require-jsdoc */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const gulp = require('gulp');
const { compileFromFile } = require('json-schema-to-typescript');
const path = require('path');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const backendConfig = require('./config/backend.config');
const frontendConfig = require('./config/frontend.config');

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');
const schemas = path.join(src, 'backend', 'schemas');

/**
 * Generates type definitions for backend schema files
 */
async function compileSchemas() {
  (await fs.readdir(schemas))
    .filter((category) => !/\.ts$/.test(category))
    .forEach(async (category) => {
      const defDir = path.join(__dirname, 'src', 'types', 'schemas', category);
      await fs.ensureDir(defDir);
      ['Query', 'Response'].forEach(async (file) => {
        const fpath = path.join(schemas, category, `${file}.json`);
        try {
          await fs.access(fpath);
          await fs.writeFile(path.join(defDir, `${file}.d.ts`), await compileFromFile(fpath));
        } catch (err) {
          // Skip file that doesn't exist
        }
      });
    });
}

/**
 * Common task for compiling Typescript
 *
 * @param {string} entry the entry folder
 * @param {Object} config the webpack config
 * @returns {Object} the webpack stream building the source
 */
function build(entry, config) {
  return gulp
    .src(path.join(src, entry, 'index.ts'))
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest(dist));
}

/**
 * Builds the backend
 *
 * @returns {Object} the webpack stream for the backend
 */
function backend() {
  return build('backend', backendConfig);
}

/**
 * Builds the frontend
 *
 * @returns {Object} the webpack stream for the frontend
 */
function frontend() {
  return build('frontend', frontendConfig);
}

exports.schemas = compileSchemas;
exports.backend = backend;
exports.frontend = frontend;
exports.default = gulp.parallel(compileSchemas, backend, frontend);

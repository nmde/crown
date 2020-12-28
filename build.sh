# Compile API schemas to Typescript definition files
node ./compileSchemas.js

# Build frontend & backend bundles
npx webpack --config ./config/frontend.config.js
npx webpack --config ./config/backend.config.js
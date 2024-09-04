// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TensorFlow model files (like .bin and .json files)
config.resolver.assetExts.push('bin');
config.resolver.assetExts.push('json'); // Make sure JSON files are included

module.exports = config;

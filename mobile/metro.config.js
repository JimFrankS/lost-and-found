const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Collapse Hermes internal frames to prevent Metro from trying to read InternalBytecode.js and similar pseudo-files
config.symbolicator = {
  customizeFrame: (frame) => {
    const file = frame.file || '';
    const collapse =
      file.includes('InternalBytecode.js') ||
      file.includes('[native code]') ||
      file.startsWith('native') ||
      file.startsWith('address at');
    return { collapse };
  },
};
 
module.exports = withNativeWind(config, { input: './global.css' })
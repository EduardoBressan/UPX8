// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite usar require() com modelos 3D (Viro3DObject): .glb/.gltf/.bin e .obj/.mtl.
config.resolver.assetExts.push('glb', 'gltf', 'bin', 'obj', 'mtl');

module.exports = config;

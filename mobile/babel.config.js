module.exports = function (api) {
  api.cache(true);
  return {
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      "nativewind/babel",
    ],
  };
  };
};
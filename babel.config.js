module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@assets': './assets',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@constants': './src/constants',
            '@services': './src/services',
            '@types': './src/types',
          },
        },
      ],
    ],
  };
};

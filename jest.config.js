module.exports = {
  preset: '@react-native/jest-preset',
  // These packages ship TypeScript source for React Native, so Jest must transpile them.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-otp-studio|react-native-notitoast)/)',
  ],
};

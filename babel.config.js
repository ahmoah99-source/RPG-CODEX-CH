module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // تضمن هذه الإضافة معالجة التنسيقات والألوان بشكل متوافق مع نظام أندرويد
    ],
  };
};

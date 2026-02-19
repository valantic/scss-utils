export default {
  extends: 'stylelint-config-valantic',
  overrides: [
    {
      files: '**/*.scss',
      customSyntax: 'postcss-scss',
    },
    {
      files: '**/*.vue',
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    "annotation-no-unknown": null
  }
};

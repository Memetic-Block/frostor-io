module.exports = {
  root: true,
  overrides: [{
    files: [ './**/*.{ts,vue}' ]
  }],
  env: {
    browser: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
    extraFileExtensions: [ '.vue' ],
    vueFeatures: {
      interpolationAsNonHTML: false
    }
  },
  plugins: [ '@typescript-eslint' ],
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  rules: {
    indent: [ 'error', 2 ],
    'max-len': [ 'error', {
      code: 80,
      tabWidth: 2
    }],
    'vue/multi-word-component-names': 'off',
    'vue/component-tags-order': 'off',
    'vue/max-attributes-per-line': ['warn', {
      singleline: { max: 12 },
      multiline: { max: 1 }
    }],
    'vue/block-order': ['warn', {
      order: [ 'template', 'style', 'script' ]
    }]
  }
}

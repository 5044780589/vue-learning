module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  parser: "vue-eslint-parser",
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}

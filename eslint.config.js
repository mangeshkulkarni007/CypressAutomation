const mochaPlugin = require('eslint-plugin-mocha').configs.flat.recommended;

mochaPlugin.rules['mocha/no-exclusive-tests'] = 'error';
mochaPlugin.rules['mocha/no-mocha-arrows'] = 'off';
mochaPlugin.rules['mocha/no-setup-in-describe'] = 'off';

module.exports = [
  mochaPlugin,
  {
    plugins: {
      cypress: {
        rules: {
          'no-assigning-return-values': 'error',
          'no-unnecessary-waiting': 'error',
          'assertion-before-screenshot': 'warn',
          'no-force': 'warn',
          'no-async-tests': 'error',
          'no-pause': 'error',
        },
        env: {
          'cypress/globals': true,
        },
      },
    },
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        module: true,
        require: true,
      },
    },
    ignores: ['eslint.config.js'],
    rules: {
      // Additional rules for improving code syntax
      'no-console': 'error', // Disallow the use of console statements
      'no-unused-vars': 'warn', // Warn about unused variables
      semi: ['error', 'always'], // Require semicolons at the end of statements
      quotes: ['error', 'single'], // Enforce the use of single quotes
      indent: ['error', 2], // Enforce 2-space indentation
      'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline object and array literals
      'object-curly-spacing': ['error', 'always'], // Enforce consistent spacing inside braces of object literals
      'array-bracket-spacing': ['error', 'never'], // Disallow spaces inside array brackets
      'arrow-spacing': 'error', // Enforce consistent spacing before and after arrow function arrows
      'no-multiple-empty-lines': ['error', { max: 1 }], // Disallow multiple empty lines
      'comma-spacing': 'error', // Enforce consistent spacing after commas
      'space-infix-ops': 'error', // Require spaces around infix operators
      'space-in-parens': ['error', 'never'], // Disallow spaces inside parentheses
      'no-trailing-spaces': 'error', // Disallow trailing whitespace at the end of lines
      'eol-last': ['error', 'always'], // Require a newline at the end of files
      'no-multi-spaces': 'error', // Disallow multiple consecutive spaces
    },
  },
];

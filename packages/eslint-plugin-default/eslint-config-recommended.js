module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:nuxt/recommended',
    'plugin:vue/recommended',
    'prettier',
    'prettier/vue',
  ],
  plugins: ['simple-import-sort'],
  rules: {
    // disallow the use of `console`
    'no-console': 'error',

    // disallow returning values from Promise executor functions
    'no-promise-executor-return': 'error',

    // disallow loops with a body that allows only one iteration
    'no-unreachable-loop': 'error',

    // enforce `return` statements in callbacks of array methods
    'array-callback-return': 'error',

    // require `return` statements to either always or never specify values
    'consistent-return': 'error',

    // enforce consistent brace style for all control statements
    curly: ['error', 'all'],

    // require `default` cases in `switch` statements
    'default-case': 'error',

    // enforce default function parameters to be last
    'default-param-last': 'error',

    // require the use of `===` and `!==`
    eqeqeq: ['error', 'always', { null: 'ignore' }],

    // require grouped accessor pairs in object literals and classes
    'grouped-accessor-pairs': 'error',

    // disallow the use of `alert`, `confirm`, and `prompt`
    'no-alert': 'error',

    // disallow the use of `arguments.caller` or `arguments.callee`
    'no-caller': 'error',

    // disallow returning value from constructor
    'no-constructor-return': 'error',

    // disallow empty functions
    'no-empty-function': 'error',

    // disallow the use of `eval()`
    'no-eval': 'error',

    // disallow unnecessary calls to `.bind()`
    'no-extra-bind': 'error',

    // disallow unnecessary labels
    'no-extra-label': 'error',

    // disallow leading or trailing decimal points in numeric literals
    'no-floating-decimal': 'error',

    // disallow shorthand type conversions
    'no-implicit-coercion': [
      'error',
      {
        boolean: false,
      },
    ],

    // disallow declarations in the global scope
    'no-implicit-globals': 'error',

    // disallow the use of `eval()`-like methods
    'no-implied-eval': 'error',

    // disallow `this` keywords outside of classes or class-like objects
    'no-invalid-this': 'error',

    // disallow unnecessary nested blocks
    'no-lone-blocks': 'error',

    // disallow function declarations that contain unsafe references inside loop statements
    'no-loop-func': 'error',

    // disallow multiline strings
    'no-multi-str': 'error',

    // disallow `new` operators with the `String`, `Number`, and `Boolean` objects
    'no-new-wrappers': 'error',

    // disallow octal escape sequences in string literals
    'no-octal-escape': 'error',

    // disallow assignment operators in `return` statements
    'no-return-assign': 'error',

    // disallow unnecessary `return await`
    'no-return-await': 'error',

    // disallow comparisons where both sides are exactly the same
    'no-self-compare': 'error',

    // disallow comma operators
    'no-sequences': 'error',

    // disallow throwing literals as exceptions
    'no-throw-literal': 'error',

    // disallow unmodified loop conditions
    'no-unmodified-loop-condition': 'error',

    // disallow unused expressions
    'no-unused-expressions': 'error',

    // disallow unnecessary calls to `.call()` and `.apply()`
    'no-useless-call': 'error',

    // disallow unnecessary concatenation of literals or template literals
    'no-useless-concat': 'error',

    // disallow redundant return statements
    'no-useless-return': 'error',

    // require using Error objects as Promise rejection reasons
    'prefer-promise-reject-errors': 'error',

    // disallow use of the `RegExp` constructor in favor of regular expression literals
    'prefer-regex-literals': 'error',

    // disallow async functions which have no `await` expression
    'require-await': 'error',

    // require or disallow Yoda conditions
    yoda: 'error',

    // disallow variable declarations from shadowing variables declared in the outer scope
    'no-shadow': 'error',

    // disallow the use of variables before they are defined
    'no-use-before-define': 'error',

    // enforce camelcase naming convention
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],

    // enforce consistent naming when capturing the current execution context
    'consistent-this': ['error', 'self'],

    // enforce a maximum depth that blocks can be nested
    'max-depth': ['error', 4],

    // enforce a maximum depth that callbacks can be nested
    'max-nested-callbacks': ['error', 4],

    // require constructor names to begin with a capital letter
    'new-cap': 'error',

    // enforce or disallow parentheses when invoking a constructor with no arguments
    'new-parens': 'error',

    // disallow bitwise operators
    'no-bitwise': 'error',

    // disallow negated conditions
    'no-negated-condition': 'error',

    // disallow nested ternary expressions
    'no-nested-ternary': 'error',

    // disallow ternary operators when simpler alternatives exist
    'no-unneeded-ternary': 'error',

    // enforce variables to be declared either together or separately in functions
    'one-var': ['error', 'never'],

    // require or disallow assignment operator shorthand where possible
    'operator-assignment': 'error',

    // disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead
    'prefer-object-spread': 'error',

    // disallow duplicate module imports
    'no-duplicate-imports': 'error',

    // require `let` or `const` instead of `var`
    'no-var': 'error',

    // require or disallow method and property shorthand syntax for object literals
    'object-shorthand': 'error',

    // require using arrow functions for callbacks
    'prefer-arrow-callback': 'error',

    // require `const` declarations for variables that are never reassigned after declared
    'prefer-const': 'error',

    // require rest parameters instead of `arguments`
    'prefer-rest-params': 'error',

    // require spread operators instead of `.apply()`
    'prefer-spread': 'error',

    // require template literals instead of string concatenation
    'prefer-template': 'error',

    // Forbids using hyphenated attribute names on custom components in Vue templates.
    'vue/attribute-hyphenation': ['error', 'never'],

    // Enforce the component name property to Pascal case.
    'vue/name-property-casing': ['error', 'PascalCase'],

    // This rule enforce proper casing of props in vue components (camelCase).
    // Off because autofix will break the app.
    'vue/prop-name-casing': ['off', 'camelCase'],

    // Enforce order of attributes
    'vue/attributes-order': 'error',

    // Allow 'v-html' attribute
    'vue/no-v-html': 'off',

    // Enforce component tag names to pascal case. E.g. <CoolComponent>.
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],

    'vue/component-definition-name-casing': ['error', 'PascalCase'],

    // The rule is to enforce the HTML standard of always defaulting boolean attributes to false
    'vue/no-boolean-default': 'error',

    'vue/no-deprecated-scope-attribute': 'error',

    'vue/no-deprecated-slot-attribute': 'error',

    'vue/no-deprecated-slot-scope-attribute': 'error',

    'vue/no-static-inline-styles': 'error',

    'vue/require-direct-export': 'error',

    'vue/require-name-property': 'error',

    'vue/v-slot-style': 'error',

    'vue/valid-v-bind-sync': 'error',

    'vue/valid-v-slot': 'error',

    'simple-import-sort/sort': 'error',
  },
};

const rule = require('../../rules/require-qa-class');
const RuleTester = require('eslint').RuleTester;

const errorMessage = 'qa-* CSS class is required on this element';

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015,
  },
});

tester.run('require-qa-class', rule, {
  valid: [
    '<template><div></div></template>',
    '<template><input class="qa-btn" type="text" /></template>',
    '<template><button class="qa-btn"></button></template>',
    '<template><button :class="[\'qa-btn\']"></button></template>',
    '<template><button :class="[`qa-btn-${value}`]"></button></template>',
    '<template><button :class="{ \'qa-btn\': value }"></button></template>',
    '<template><button :class="{ [`qa-btn-${value}`]: value }"></button></template>',
    '<template><button class="qa-camelCase"></button></template>',
    '<template><button class="qa-multiple-sections"></button></template>',
    '<template><button class="Btn qa-multipleClasses"></button></template>',
    {
      code: '<template><button></button></template>',
      options: [
        {
          elements: ['input'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: '<template><input type="text" /></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><input class="Input" type="text" /></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button class="Btn"></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button :class="[\'Btn\']"></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button :class="[`Btn-${value}`]"></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button :class="{ \'Btn-btn\': value }"></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button :class="{ [`Btn-${value}`]: value }"></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><NButton></NButton></template>',
      options: [
        {
          elements: ['NButton'],
        },
      ],
      errors: [errorMessage],
    },
    {
      code: '<template><button class></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button :class></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button :class="value"></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button class="qa-WRONG_CASE"></button></template>',
      errors: [errorMessage],
    },
    {
      code: '<template><button class="qa-wrongStructure-"></button></template>',
      errors: [errorMessage],
    },
  ],
});

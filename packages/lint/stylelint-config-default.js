module.exports = {
  ignoreFiles: ['./.nuxt/**', './dist/**'],
  extends: ['stylelint-config-recommended', 'stylelint-config-rational-order'],
  plugins: ['stylelint-scss'],
  rules: {
    // Require an empty line before "@..." blocks
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-blockless', 'first-nested'],
      },
    ],

    // Require an empty line before each rule
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],

    // Require classes to match the following expression
    'selector-class-pattern': ['^[A-Z][A-Za-z0-9]+(?:-[a-z][A-Za-z0-9]+)?$|^m-[a-z][A-Za-z0-9]+$'],
    
    // Disallow unknown pseudo-element selectors
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ["v-deep"] }],

    // Require properties to be ordered
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': true,
      },
    ],

    // Disallow redundant nesting selectors, like "& .something" or "& > .something"
    'scss/selector-no-redundant-nesting-selector': true,

    // Disallow union class names with the parent selector, like "&-something"
    'scss/selector-no-union-class-name': true,

    // Disallow duplicated SCSS variables
    'scss/no-duplicate-dollar-variables': true,

    // Disallow duplicate mixins within a stylesheet
    'scss/no-duplicate-mixins': true,

    // Disallow unknown "@" rules
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
  },
};

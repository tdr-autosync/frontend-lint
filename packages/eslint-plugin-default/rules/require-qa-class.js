const utils = require('eslint-plugin-vue/lib/utils');

function checkLiteral(value) {
  return /(?:^|\s)qa-[a-z0-9_-]+/.test(value);
}

function checkTemplateExpression(expression) {
  return expression.quasis.some(element =>
    /(?:^|\s)qa-(?:$|[a-z0-9_-]+)/.test(element.value.cooked),
  );
}

function checkArrayExpression(expression) {
  return expression.elements.some(
    element =>
      (element.type === 'Literal' && checkLiteral(element.value)) ||
      (element.type === 'TemplateLiteral' && checkTemplateExpression(element)),
  );
}

function checkObjectExpression(expression) {
  return expression.properties.some(
    property =>
      (property.key.type === 'Literal' && checkLiteral(property.key.value)) ||
      (property.key.type === 'TemplateLiteral' && checkTemplateExpression(property.key)),
  );
}

function checkExpression(expression) {
  if (expression.type === 'ArrayExpression') {
    return checkArrayExpression(expression);
  } else if (expression.type === 'ObjectExpression') {
    return checkObjectExpression(expression);
  } else {
    return false;
  }
}

function reportNoQaClass(context, node) {
  context.report({
    node: node.startTag,
    loc: node.startTag.loc,
    message: 'qa-* CSS class is required on this element',
  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `qa-*` class on provided elements',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          elements: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
  },
  create(context) {
    const options = {
      elements: ['button', 'input', 'select', 'textarea'],
      ...(context.options[0] || {}),
    };
    const elementsToCheck = options.elements.map(item => item.toLowerCase());

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (!elementsToCheck.includes(node.name.toLowerCase())) {
          return;
        }

        const classAttribute = utils.getAttribute(node, 'class');
        if (
          classAttribute &&
          classAttribute.value &&
          classAttribute.value.type === 'VLiteral' &&
          checkLiteral(classAttribute.value.value)
        ) {
          return;
        }

        const classDirective = utils.getDirective(node, 'bind', 'class');
        if (
          classDirective &&
          classDirective.value &&
          classDirective.value.type === 'VExpressionContainer' &&
          classDirective.value.expression &&
          checkExpression(classDirective.value.expression)
        ) {
          return;
        }
        reportNoQaClass(context, node);
      },
    });
  },
};

## "require-qa-class" rule

This rule requires qa-\* CSS classes to be provided class on specific HTML elements.

## Usage

This rule is not enabled by default. To use it you need to enable it manually, just update your ESLint configuration accordingly to the following example.

```json
"rules": {
  "@motoinsight/default/require-qa-class": [
    "error",
    {
      "elements": ["button", "input", "select", "textarea"],
    }
  ]
}
```

## Configuration options

| Name     | Type       | Default                                     | Description                         |
| -------- | ---------- | ------------------------------------------- | ----------------------------------- |
| elements | `string[]` | `["button", "input", "select", "textarea"]` | Sets the list of elements to check. |

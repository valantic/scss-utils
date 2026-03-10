# valantic SCSS Utils

A reusable library of SCSS utilities, mixins, and functions designed for scalable and maintainable styling across projects. This package includes features like container queries, typography utilities, spacing helpers, and more.

This will add **no extra output to your css files**, include it to your project and use what you need.

This package is also part of your [vue-template](https://github.com/valantic/vue-template) a boilerplate (starting point) for a vue3 project.

## Changelog

See all per version here: [CHANGELOG.md](./CHANGELOG.md)

## Requirements

Your project needs at least **node 22** and **sass 1.93**.
We suggest stylelint to be installed.

```json
  "devDependencies": {
    "sass": "~1.97.3",
    "stylelint": "~17.4.0",
    "stylelint-config-valantic": "~10.1.0"
  }
```

## Installation

Add the package to your `package.json`:

```json
"dependencies": {
  "@valantic/scss-utils": "github:valantic/scss-utils#v1.0.0",
}
```

## Usage

This library uses the Sass module system. You can import variables, functions, and mixins separately:

```scss
@use '@valantic/scss-utils/variables' as v;
@use '@valantic/scss-utils/functions' as f;
@use '@valantic/scss-utils/mixins' as m;

.card {
  font-size: f.calc-em(16px);
  color: v.$va-color-primary;
  @include m.line-clamp(2);
  @include m.container(sm, lg) {
    background-color: v.$va-color-secondary;
  }
}

// Optional: emit base element styles
@use '@valantic/scss-utils/setup';
```

## License
This project is licensed under the MIT License.


## Contributing

We welcome contributions! If you’d like to make improvements, submit a pull request or open an issue.

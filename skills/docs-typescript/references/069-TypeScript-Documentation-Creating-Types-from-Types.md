# TypeScript: Documentation - Creating Types from Types

Source: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html

Was this page helpful?

# Creating Types from Types

TypeScript’s type system is very powerful because it allows expressing types *in terms of other types*.

The simplest form of this idea is generics. Additionally, we have a wide variety of *type operators* available to use.
It’s also possible to express types in terms of *values* that we already have.

By combining various type operators, we can express complex operations and values in a succinct, maintainable way.
In this section we’ll cover ways to express a new type in terms of an existing type or value.

- [Generics](/docs/handbook/2/generics.html) - Types which take parameters
- [Keyof Type Operator](/docs/handbook/2/keyof-types.html) - Using the `keyof` operator to create new types
- [Typeof Type Operator](/docs/handbook/2/typeof-types.html) - Using the `typeof` operator to create new types
- [Indexed Access Types](/docs/handbook/2/indexed-access-types.html) - Using `Type['a']` syntax to access a subset of a type
- [Conditional Types](/docs/handbook/2/conditional-types.html) - Types which act like if statements in the type system
- [Mapped Types](/docs/handbook/2/mapped-types.html) - Creating types by mapping each property in an existing type
- [Template Literal Types](/docs/handbook/2/template-literal-types.html) - Mapped types which change properties via template literal strings

[### Generics

Types which take parameters](/docs/handbook/2/generics.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/handbook-v2/Type Manipulation/_Creating Types from Types.md) ❤

Contributors to this page:

OT![Orta Therox  (6)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

GF![Graham Fisher  (1)](https://gravatar.com/avatar/17f72e3d32dca8852e79c078e2f3459819bc0e07e1c5f755d06fc6dc0aa0ce35?s=32&&d=blank)

AP![Alexander Pepper  (1)](https://gravatar.com/avatar/850df7f9663dde77d709c17712433aa445507f474424d2f8991b54be74263d8d?s=32&&d=blank)

PC![Pradeep Chauhan  (1)](https://gravatar.com/avatar/f696ff36977e958e37feabb1d420ef73f97f886c12fbefa2a6e1eb1c0f4f4d0f?s=32&&d=blank)

Last updated: Jul 27, 2026

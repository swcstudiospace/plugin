# Statements and declarations - JavaScript | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements

## [Statements and declarations by category](#statements_and_declarations_by_category)

For an alphabetical listing see the sidebar on the left.

### [Control flow](#control_flow)

[`return`](/en-US/docs/Web/JavaScript/Reference/Statements/return)
:   Specifies the value to be returned by a function.

[`break`](/en-US/docs/Web/JavaScript/Reference/Statements/break)
:   Terminates the current loop, switch, or label statement and transfers program control to the statement following the terminated statement.

[`continue`](/en-US/docs/Web/JavaScript/Reference/Statements/continue)
:   Terminates execution of the statements in the current iteration of the current or labeled loop, and continues execution of the loop with the next iteration.

[`throw`](/en-US/docs/Web/JavaScript/Reference/Statements/throw)
:   Throws a user-defined exception.

[`if...else`](/en-US/docs/Web/JavaScript/Reference/Statements/if...else)
:   Executes a statement if a specified condition is true. If the condition is false, another statement can be executed.

[`switch`](/en-US/docs/Web/JavaScript/Reference/Statements/switch)
:   Evaluates an expression, matching the expression's value to a case clause, and executes statements associated with that case.

[`try...catch`](/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
:   Marks a block of statements to try, and specifies a response, should an exception be thrown.

### [Declaring variables](#declaring_variables)

[`var`](/en-US/docs/Web/JavaScript/Reference/Statements/var)
:   Declares a variable, optionally initializing it to a value.

[`let`](/en-US/docs/Web/JavaScript/Reference/Statements/let)
:   Declares a block scope local variable, optionally initializing it to a value.

[`const`](/en-US/docs/Web/JavaScript/Reference/Statements/const)
:   Declares a read-only named constant.

[`using`](/en-US/docs/Web/JavaScript/Reference/Statements/using)
:   Declares local variables that are *synchronously disposed*.

[`await using`](/en-US/docs/Web/JavaScript/Reference/Statements/await_using)
:   Declares local variables that are *asynchronously disposed*.

### [Functions and classes](#functions_and_classes)

[`function`](/en-US/docs/Web/JavaScript/Reference/Statements/function)
:   Declares a function with the specified parameters.

[`function*`](/en-US/docs/Web/JavaScript/Reference/Statements/function*)
:   Generator Functions enable writing [iterators](/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) more easily.

[`async function`](/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
:   Declares an async function with the specified parameters.

[`async function*`](/en-US/docs/Web/JavaScript/Reference/Statements/async_function*)
:   Asynchronous Generator Functions enable writing async [iterators](/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) more easily.

[`class`](/en-US/docs/Web/JavaScript/Reference/Statements/class)
:   Declares a class.

### [Iterations](#iterations)

[`do...while`](/en-US/docs/Web/JavaScript/Reference/Statements/do...while)
:   Creates a loop that executes a specified statement until the test condition evaluates to false. The condition is evaluated after executing the statement, resulting in the specified statement executing at least once.

[`for`](/en-US/docs/Web/JavaScript/Reference/Statements/for)
:   Creates a loop that consists of three optional expressions, enclosed in parentheses and separated by semicolons, followed by a statement executed in the loop.

[`for...in`](/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
:   Iterates over the enumerable properties of an object, in arbitrary order. For each distinct property, statements can be executed.

[`for...of`](/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
:   Iterates over iterable objects (including [arrays](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), array-like objects, [iterators and generators](/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators)), invoking a custom iteration hook with statements to be executed for the value of each distinct property.

[`for await...of`](/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
:   Iterates over async iterable objects, array-like objects, [iterators and generators](/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators), invoking a custom iteration hook with statements to be executed for the value of each distinct property.

[`while`](/en-US/docs/Web/JavaScript/Reference/Statements/while)
:   Creates a loop that executes a specified statement as long as the test condition evaluates to true. The condition is evaluated before executing the statement.

### [Others](#others)

[Empty](/en-US/docs/Web/JavaScript/Reference/Statements/Empty)
:   An empty statement is used to provide no statement, although the JavaScript syntax would expect one.

[Block](/en-US/docs/Web/JavaScript/Reference/Statements/block)
:   A block statement is used to group zero or more statements. The block is delimited by a pair of curly braces.

[Expression statement](/en-US/docs/Web/JavaScript/Reference/Statements/Expression_statement)
:   An expression statement evaluates an expression and discards its result. It allows the expression to perform side effects, such as executing a function or updating a variable.

[`debugger`](/en-US/docs/Web/JavaScript/Reference/Statements/debugger)
:   Invokes any available debugging functionality. If no debugging functionality is available, this statement has no effect.

[`export`](/en-US/docs/Web/JavaScript/Reference/Statements/export)
:   Used to export functions to make them available for imports in external modules, and other scripts.

[`import`](/en-US/docs/Web/JavaScript/Reference/Statements/import)
:   Used to import functions exported from an external module, another script.

[label](/en-US/docs/Web/JavaScript/Reference/Statements/label)
:   Provides a statement with an identifier that you can refer to using a `break` or `continue` statement.

[`with`](/en-US/docs/Web/JavaScript/Reference/Statements/with)
:   Extends the scope chain for a statement.

## [Difference between statements and declarations](#difference_between_statements_and_declarations)

In this section, we will be mixing two kinds of constructs: [*statements*](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#prod-Statement "External link (opens in new tab)") and [*declarations*](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#prod-Declaration "External link (opens in new tab)"). They are two disjoint sets of grammars. The following are declarations:

- [`let`](/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [`const`](/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [`function`](/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [`function*`](/en-US/docs/Web/JavaScript/Reference/Statements/function*)
- [`async function`](/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [`async function*`](/en-US/docs/Web/JavaScript/Reference/Statements/async_function*)
- [`class`](/en-US/docs/Web/JavaScript/Reference/Statements/class)
- [`export`](/en-US/docs/Web/JavaScript/Reference/Statements/export) (Note: it can only appear at the top-level of a [module](/en-US/docs/Web/JavaScript/Guide/Modules))
- [`import`](/en-US/docs/Web/JavaScript/Reference/Statements/import) (Note: it can only appear at the top-level of a [module](/en-US/docs/Web/JavaScript/Guide/Modules))

Everything else in the [list above](#statements_and_declarations_by_category) is a statement.

The terms "statement" and "declaration" have a precise meaning in the formal syntax of JavaScript that affects where they may be placed in code. For example, in most control-flow structures, the body only accepts statements — such as the two arms of an [`if...else`](/en-US/docs/Web/JavaScript/Reference/Statements/if...else):

```
if (condition)
  statement1;
else
  statement2;
```

If you use a declaration instead of a statement, it would be a [`SyntaxError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError). For example, a [`let`](/en-US/docs/Web/JavaScript/Reference/Statements/let) declaration is not a statement, so you can't use it in its bare form as the body of an `if` statement.

```
if (condition)
  let i = 0; // SyntaxError: Lexical declaration cannot appear in a single-statement context
```

On the other hand, [`var`](/en-US/docs/Web/JavaScript/Reference/Statements/var) is a statement, so you can use it on its own as the `if` body.

```
if (condition)
  var i = 0;
```

You can see declarations as "[binding](/en-US/docs/Glossary/Binding) identifiers to values", and statements as "carrying out actions". The fact that `var` is a statement instead of a declaration is a special case, because it doesn't follow normal lexical scoping rules and may create side effects — in the form of creating global variables, mutating existing `var`-defined variables, and defining variables that are visible outside of its block (because `var`-defined variables aren't block-scoped).

As another example, [labels](/en-US/docs/Web/JavaScript/Reference/Statements/label) can only be attached to statements.

```
label: const a = 1; // SyntaxError: Lexical declaration cannot appear in a single-statement context
```

**Note:**
There's a legacy grammar that allows [function declarations to have labels](/en-US/docs/Web/JavaScript/Reference/Statements/label#labeled_function_declarations), but it's only standardized for compatibility with web reality.

To get around this, you can wrap the declaration in braces — this makes it part of a [block statement](/en-US/docs/Web/JavaScript/Reference/Statements/block).

```
label: {
  const a = 1;
}

if (condition) {
  let i = 0;
}
```

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- [Expressions and operators](/en-US/docs/Web/JavaScript/Reference/Operators)

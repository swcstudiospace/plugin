# Expressions and operators - JavaScript | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators

## [Expressions and operators by category](#expressions_and_operators_by_category)

For an alphabetical listing see the sidebar on the left.

### [Primary expressions](#primary_expressions)

Basic keywords and general expressions in JavaScript. These expressions have the highest precedence (higher than [operators](/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence)).

[`this`](/en-US/docs/Web/JavaScript/Reference/Operators/this)
:   The `this` keyword refers to a special property of an execution context.

[Literals](/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#literals)
:   Basic `null`, boolean, number, and string literals.

[`[]`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
:   Array initializer/literal syntax.

[`{}`](/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
:   Object initializer/literal syntax.

[`function`](/en-US/docs/Web/JavaScript/Reference/Operators/function)
:   The `function` keyword defines a function expression.

[`class`](/en-US/docs/Web/JavaScript/Reference/Operators/class)
:   The `class` keyword defines a class expression.

[`function*`](/en-US/docs/Web/JavaScript/Reference/Operators/function*)
:   The `function*` keyword defines a generator function expression.

[`async function`](/en-US/docs/Web/JavaScript/Reference/Operators/async_function)
:   The `async function` defines an async function expression.

[`async function*`](/en-US/docs/Web/JavaScript/Reference/Operators/async_function*)
:   The `async function*` keywords define an async generator function expression.

[`/ab+c/i`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
:   Regular expression literal syntax.

[`` `string` ``](/en-US/docs/Web/JavaScript/Reference/Template_literals)
:   Template literal syntax.

[`( )`](/en-US/docs/Web/JavaScript/Reference/Operators/Grouping)
:   Grouping operator.

### [Left-hand-side expressions](#left-hand-side_expressions)

Left values are the destination of an assignment.

[Property accessors](/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)
:   Member operators provide access to a property or method of an object (`object.property` and `object["property"]`).

[`?.`](/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
:   The optional chaining operator returns `undefined` instead of causing an error if a reference is [nullish](/en-US/docs/Glossary/Nullish) ([`null`](/en-US/docs/Web/JavaScript/Reference/Operators/null) or [`undefined`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)).

[`new`](/en-US/docs/Web/JavaScript/Reference/Operators/new)
:   The `new` operator creates an instance of a constructor.

[`new.target`](/en-US/docs/Web/JavaScript/Reference/Operators/new.target)
:   In constructors, `new.target` refers to the constructor that was invoked by [`new`](/en-US/docs/Web/JavaScript/Reference/Operators/new).

[`import.meta`](/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)
:   An object exposing context-specific metadata to a JavaScript module.

[`super`](/en-US/docs/Web/JavaScript/Reference/Operators/super)
:   The `super` keyword calls the parent constructor or allows accessing properties of the parent object.

[`import()`](/en-US/docs/Web/JavaScript/Reference/Operators/import)
:   The `import()` syntax allows loading a module asynchronously and dynamically into a potentially non-module environment.

### [Increment and decrement](#increment_and_decrement)

Postfix/prefix increment and postfix/prefix decrement operators.

[`A++`](/en-US/docs/Web/JavaScript/Reference/Operators/Increment)
:   Postfix increment operator.

[`A--`](/en-US/docs/Web/JavaScript/Reference/Operators/Decrement)
:   Postfix decrement operator.

[`++A`](/en-US/docs/Web/JavaScript/Reference/Operators/Increment)
:   Prefix increment operator.

[`--A`](/en-US/docs/Web/JavaScript/Reference/Operators/Decrement)
:   Prefix decrement operator.

### [Unary operators](#unary_operators)

A unary operation is an operation with only one operand.

[`delete`](/en-US/docs/Web/JavaScript/Reference/Operators/delete)
:   The `delete` operator deletes a property from an object.

[`void`](/en-US/docs/Web/JavaScript/Reference/Operators/void)
:   The `void` operator evaluates an expression and discards its return value.

[`typeof`](/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
:   The `typeof` operator determines the type of a given object.

[`+`](/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus)
:   The unary plus operator converts its operand to Number type.

[`-`](/en-US/docs/Web/JavaScript/Reference/Operators/Unary_negation)
:   The unary negation operator converts its operand to Number type and then negates it.

[`~`](/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT)
:   Bitwise NOT operator.

[`!`](/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT)
:   Logical NOT operator.

[`await`](/en-US/docs/Web/JavaScript/Reference/Operators/await)
:   Pause and resume an async function and wait for the promise's fulfillment/rejection.

### [Arithmetic operators](#arithmetic_operators)

Arithmetic operators take numerical values (either literals or variables) as their operands and return a single numerical value.

[`**`](/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)
:   Exponentiation operator.

[`*`](/en-US/docs/Web/JavaScript/Reference/Operators/Multiplication)
:   Multiplication operator.

[`/`](/en-US/docs/Web/JavaScript/Reference/Operators/Division)
:   Division operator.

[`%`](/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)
:   Remainder operator.

[`+`](/en-US/docs/Web/JavaScript/Reference/Operators/Addition) (Plus)
:   Addition operator.

[`-`](/en-US/docs/Web/JavaScript/Reference/Operators/Subtraction)
:   Subtraction operator.

### [Relational operators](#relational_operators)

A comparison operator compares its operands and returns a boolean value based on whether the comparison is true.

[`<`](/en-US/docs/Web/JavaScript/Reference/Operators/Less_than) (Less than)
:   Less than operator.

[`>`](/en-US/docs/Web/JavaScript/Reference/Operators/Greater_than) (Greater than)
:   Greater than operator.

[`<=`](/en-US/docs/Web/JavaScript/Reference/Operators/Less_than_or_equal)
:   Less than or equal operator.

[`>=`](/en-US/docs/Web/JavaScript/Reference/Operators/Greater_than_or_equal)
:   Greater than or equal operator.

[`instanceof`](/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
:   The `instanceof` operator determines whether an object is an instance of another object.

[`in`](/en-US/docs/Web/JavaScript/Reference/Operators/in)
:   The `in` operator determines whether an object has a given property.

**Note:**
`=>` is not an operator, but the notation for [Arrow functions](/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

### [Equality operators](#equality_operators)

The result of evaluating an equality operator is always of type boolean based on whether the comparison is true.

[`==`](/en-US/docs/Web/JavaScript/Reference/Operators/Equality)
:   Equality operator.

[`!=`](/en-US/docs/Web/JavaScript/Reference/Operators/Inequality)
:   Inequality operator.

[`===`](/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
:   Strict equality operator.

[`!==`](/en-US/docs/Web/JavaScript/Reference/Operators/Strict_inequality)
:   Strict inequality operator.

### [Bitwise shift operators](#bitwise_shift_operators)

Operations to shift all bits of the operand.

[`<<`](/en-US/docs/Web/JavaScript/Reference/Operators/Left_shift)
:   Bitwise left shift operator.

[`>>`](/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift)
:   Bitwise right shift operator.

[`>>>`](/en-US/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift)
:   Bitwise unsigned right shift operator.

### [Binary bitwise operators](#binary_bitwise_operators)

Bitwise operators treat their operands as a set of 32 bits (zeros and ones) and return standard JavaScript numerical values.

[`&`](/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)
:   Bitwise AND.

[`|`](/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR)
:   Bitwise OR.

[`^`](/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR)
:   Bitwise XOR.

### [Binary logical operators](#binary_logical_operators)

Logical operators implement boolean (logical) values and have [short-circuiting](/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence#short-circuiting) behavior.

[`&&`](/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)
:   Logical AND.

[`||`](/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR)
:   Logical OR.

[`??`](/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
:   Nullish Coalescing Operator.

### [Conditional (ternary) operator](#conditional_ternary_operator)

[`(condition ? ifTrue : ifFalse)`](/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)
:   The conditional operator returns one of two values based on the logical value of the condition.

### [Assignment operators](#assignment_operators)

An assignment operator assigns a value to its left operand based on the value of its right operand.

[`=`](/en-US/docs/Web/JavaScript/Reference/Operators/Assignment)
:   Assignment operator.

[`*=`](/en-US/docs/Web/JavaScript/Reference/Operators/Multiplication_assignment)
:   Multiplication assignment.

[`/=`](/en-US/docs/Web/JavaScript/Reference/Operators/Division_assignment)
:   Division assignment.

[`%=`](/en-US/docs/Web/JavaScript/Reference/Operators/Remainder_assignment)
:   Remainder assignment.

[`+=`](/en-US/docs/Web/JavaScript/Reference/Operators/Addition_assignment)
:   Addition assignment.

[`-=`](/en-US/docs/Web/JavaScript/Reference/Operators/Subtraction_assignment)
:   Subtraction assignment

[`<<=`](/en-US/docs/Web/JavaScript/Reference/Operators/Left_shift_assignment)
:   Left shift assignment.

[`>>=`](/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift_assignment)
:   Right shift assignment.

[`>>>=`](/en-US/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift_assignment)
:   Unsigned right shift assignment.

[`&=`](/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND_assignment)
:   Bitwise AND assignment.

[`^=`](/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR_assignment)
:   Bitwise XOR assignment.

[`|=`](/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR_assignment)
:   Bitwise OR assignment.

[`**=`](/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation_assignment)
:   Exponentiation assignment.

[`&&=`](/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND_assignment)
:   Logical AND assignment.

[`||=`](/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment)
:   Logical OR assignment.

[`??=`](/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment)
:   Nullish coalescing assignment.

[`[a, b] = arr`, `{ a, b } = obj`](/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring)
:   Destructuring allows you to assign the properties of an array or object to variables using syntax that looks similar to array or object literals.

### [Yield operators](#yield_operators)

[`yield`](/en-US/docs/Web/JavaScript/Reference/Operators/yield)
:   Pause and resume a generator function.

[`yield*`](/en-US/docs/Web/JavaScript/Reference/Operators/yield*)
:   Delegate to another generator function or iterable object.

### [Spread syntax](#spread_syntax)

[`...obj`](/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
:   Spread syntax allows an iterable, such as an array or string, to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected. In an object literal, the spread syntax enumerates the properties of an object and adds the key-value pairs to the object being created.

### [Comma operator](#comma_operator)

[`,`](/en-US/docs/Web/JavaScript/Reference/Operators/Comma_operator)
:   The comma operator allows multiple expressions to be evaluated in a single statement and returns the result of the last expression.

## [Specifications](#specifications)

| Specification |
| --- |
| [ECMAScript® 2027 Language Specification # prod-ArgumentList](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-ArgumentList) |
| [ECMAScript® 2027 Language Specification # sec-unary-plus-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unary-plus-operator) |
| [ECMAScript® 2027 Language Specification # sec-comma-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-comma-operator) |
| [ECMAScript® 2027 Language Specification # sec-equality-operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-equality-operators) |
| [ECMAScript® 2027 Language Specification # sec-relational-operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators) |
| [ECMAScript® 2027 Language Specification # prod-BitwiseXORExpression](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-BitwiseXORExpression) |
| [ECMAScript® 2027 Language Specification # sec-grouping-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-grouping-operator) |
| [ECMAScript® 2027 Language Specification # prod-AssignmentRestProperty](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-AssignmentRestProperty) |
| [ECMAScript® 2027 Language Specification # sec-assignment-operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-assignment-operators) |
| [ECMAScript® 2027 Language Specification # prod-MethodDefinition](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#prod-MethodDefinition) |
| [ECMAScript® 2027 Language Specification # sec-async-function-definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-function-definitions) |
| [ECMAScript® 2027 Language Specification # prod-FormalParameters](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#prod-FormalParameters) |
| [ECMAScript® 2027 Language Specification # sec-typeof-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-typeof-operator) |
| [ECMAScript® 2027 Language Specification # sec-destructuring-assignment](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-destructuring-assignment) |
| [ECMAScript® 2027 Language Specification # sec-destructuring-binding-patterns](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-destructuring-binding-patterns) |
| [ECMAScript® 2027 Language Specification # prod-OptionalExpression](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-OptionalExpression) |
| [ECMAScript® 2027 Language Specification # prod-CoalesceExpression](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-CoalesceExpression) |
| [ECMAScript® 2027 Language Specification # prod-BitwiseANDExpression](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-BitwiseANDExpression) |
| [ECMAScript® 2027 Language Specification # sec-addition-operator-plus](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-addition-operator-plus) |
| [ECMAScript® 2027 Language Specification # prod-YieldExpression](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#prod-YieldExpression) |
| [ECMAScript® 2027 Language Specification # sec-multiplicative-operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-multiplicative-operators) |
| [ECMAScript® 2027 Language Specification # sec-exp-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-exp-operator) |
| [ECMAScript® 2027 Language Specification # prod-PropertyDefinition](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-PropertyDefinition) |
| [ECMAScript® 2027 Language Specification # sec-conditional-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-conditional-operator) |
| [ECMAScript® 2027 Language Specification # sec-null-value](https://tc39.es/ecma262/multipage/overview.html#sec-null-value) |
| [ECMAScript® 2027 Language Specification # prod-SpreadElement](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-SpreadElement) |
| [ECMAScript® 2027 Language Specification # sec-postfix-increment-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-postfix-increment-operator) |
| [ECMAScript® 2027 Language Specification # sec-delete-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-delete-operator) |
| [ECMAScript® 2027 Language Specification # sec-left-shift-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-left-shift-operator) |
| [ECMAScript® 2027 Language Specification # sec-generator-function-definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-generator-function-definitions) |
| [ECMAScript® 2027 Language Specification # sec-void-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-void-operator) |
| [ECMAScript® 2027 Language Specification # sec-subtraction-operator-minus](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-subtraction-operator-minus) |
| [ECMAScript® 2027 Language Specification # sec-class-definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-class-definitions) |
| [ECMAScript® 2027 Language Specification # prod-AssignmentRestElement](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-AssignmentRestElement) |
| [ECMAScript® 2027 Language Specification # sec-unary-minus-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unary-minus-operator) |
| [ECMAScript® 2027 Language Specification # sec-built-in-function-objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-function-objects) |
| [ECMAScript® 2027 Language Specification # sec-generator-function-definitions-runtime-semantics-evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-generator-function-definitions-runtime-semantics-evaluation) |
| [ECMAScript® 2027 Language Specification # sec-function-definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-function-definitions) |
| [ECMAScript® 2027 Language Specification # sec-signed-right-shift-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-signed-right-shift-operator) |
| [ECMAScript® 2027 Language Specification # sec-bitwise-not-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-bitwise-not-operator) |
| [ECMAScript® 2027 Language Specification # sec-unsigned-right-shift-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unsigned-right-shift-operator) |
| [ECMAScript® 2027 Language Specification # sec-property-accessors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-property-accessors) |
| [ECMAScript® 2027 Language Specification # sec-import-calls](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-import-calls) |
| [ECMAScript® 2027 Language Specification # sec-logical-not-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-logical-not-operator) |
| [ECMAScript® 2027 Language Specification # prod-ImportMeta](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-ImportMeta) |
| [ECMAScript® 2027 Language Specification # prod-ComputedPropertyName](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-ComputedPropertyName) |
| [ECMAScript® 2027 Language Specification # prod-LogicalORExpression](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-LogicalORExpression) |
| [ECMAScript® 2027 Language Specification # sec-super-keyword](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-super-keyword) |
| [ECMAScript® 2027 Language Specification # sec-postfix-decrement-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-postfix-decrement-operator) |
| [ECMAScript® 2027 Language Specification # prod-BitwiseORExpression](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-BitwiseORExpression) |
| [ECMAScript® 2027 Language Specification # sec-object-initializer](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-object-initializer) |
| [ECMAScript® 2027 Language Specification # sec-this-keyword](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-this-keyword) |
| [ECMAScript® 2027 Language Specification # sec-new-operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-new-operator) |
| [ECMAScript® 2027 Language Specification # prod-LogicalANDExpression](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-LogicalANDExpression) |
| [ECMAScript® 2027 Language Specification # sec-async-generator-function-definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-generator-function-definitions) |
| [HTML # import-meta-resolve](https://html.spec.whatwg.org/multipage/webappapis.html#import-meta-resolve) |
| [HTML # integration-with-the-javascript-module-system](https://html.spec.whatwg.org/multipage/webappapis.html#integration-with-the-javascript-module-system) |

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- [Operator precedence](/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence)

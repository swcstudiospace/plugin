# JavaScript code | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/javascript

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/internals/contributing/writing-code/javascript/)
- [6.0](https://docs.djangoproject.com/en/6.0/internals/contributing/writing-code/javascript/)
- [5.2](https://docs.djangoproject.com/en/5.2/internals/contributing/writing-code/javascript/)
- [5.1](https://docs.djangoproject.com/en/5.1/internals/contributing/writing-code/javascript/)
- [5.0](https://docs.djangoproject.com/en/5.0/internals/contributing/writing-code/javascript/)
- [4.2](https://docs.djangoproject.com/en/4.2/internals/contributing/writing-code/javascript/)
- [4.1](https://docs.djangoproject.com/en/4.1/internals/contributing/writing-code/javascript/)
- [4.0](https://docs.djangoproject.com/en/4.0/internals/contributing/writing-code/javascript/)
- [3.2](https://docs.djangoproject.com/en/3.2/internals/contributing/writing-code/javascript/)
- [3.1](https://docs.djangoproject.com/en/3.1/internals/contributing/writing-code/javascript/)
- [3.0](https://docs.djangoproject.com/en/3.0/internals/contributing/writing-code/javascript/)
- [2.2](https://docs.djangoproject.com/en/2.2/internals/contributing/writing-code/javascript/)
- [2.1](https://docs.djangoproject.com/en/2.1/internals/contributing/writing-code/javascript/)
- [2.0](https://docs.djangoproject.com/en/2.0/internals/contributing/writing-code/javascript/)
- [1.11](https://docs.djangoproject.com/en/1.11/internals/contributing/writing-code/javascript/)
- [1.10](https://docs.djangoproject.com/en/1.10/internals/contributing/writing-code/javascript/)
- [1.9](https://docs.djangoproject.com/en/1.9/internals/contributing/writing-code/javascript/)

# JavaScript code

While most of Django core is Python, the `admin` and `gis` contrib apps
contain JavaScript code.

Please follow these coding standards when writing JavaScript code for inclusion
in Django.

## Code style

- Please conform to the indentation style dictated in the `.editorconfig`
  file. We recommend using a text editor with [EditorConfig](https://editorconfig.org/) support to avoid
  indentation and whitespace issues. Most of the JavaScript files use 4 spaces
  for indentation, but there are some exceptions.
- When naming variables, use `camelCase` instead of `underscore_case`.
  Different JavaScript files sometimes use a different code style. Please try
  to conform to the code style of each file.
- Use the [Biome](https://biomejs.dev/) code linter to check your code for bugs and style errors.
  Biome will be run by the pre-commit hooks. We also recommended installing
  a Biome plugin in your text editor.
- Where possible, write code that will work even if the page structure is later
  changed with JavaScript. For instance, when binding a click handler, use
  `$('body').on('click', selector, func)` instead of
  `$(selector).click(func)`. This makes it easier for projects to extend
  Django’s default behavior with JavaScript.

## JavaScript patches

Django’s admin system leverages the jQuery framework to increase the
capabilities of the admin interface. In conjunction, there is an emphasis on
admin JavaScript performance and minimizing overall admin media file size.

## JavaScript tests

Django’s JavaScript tests can be run in a browser or from the command line.
The tests are located in a top level [js\_tests](https://github.com/django/django/blob/main/js_tests) directory.

### Writing tests

Django’s JavaScript tests use [QUnit](https://qunitjs.com/). Here is an example test module:

```
QUnit.module('magicTricks', {
    beforeEach: function() {
        const $ = django.jQuery;
        $('#qunit-fixture').append('<button class="button"></button>');
    }
});

QUnit.test('removeOnClick removes button on click', function(assert) {
    const $ = django.jQuery;
    removeOnClick('.button');
    assert.equal($('.button').length, 1);
    $('.button').click();
    assert.equal($('.button').length, 0);
});

QUnit.test('copyOnClick adds button on click', function(assert) {
    const $ = django.jQuery;
    copyOnClick('.button');
    assert.equal($('.button').length, 1);
    $('.button').click();
    assert.equal($('.button').length, 2);
});
```

Please consult the `QUnit` documentation for information on the types of
[assertions supported by QUnit](https://api.qunitjs.com/assert/).

### Running tests

The JavaScript tests may be run from a web browser or from the command line.

#### Testing from a web browser

To run the tests from a web browser, open up [js\_tests/tests.html](https://github.com/django/django/blob/main/js_tests/tests.html) in
your browser.

To measure code coverage when running the tests, you need to view that file
over HTTP. To view code coverage:

- Execute `python -m http.server` from the root directory (not from inside
  `js_tests`).
- Open <http://localhost:8000/js_tests/tests.html> in your web browser.

#### Testing from the command line

To run the tests from the command line, you need to have [Node.js](https://nodejs.org/) installed.

After installing `Node.js`, install the JavaScript test dependencies by
running the following from the root of your Django checkout:

/



```
$ npm install
```

```
...\> npm install
```

Then run the tests with:

/



```
$ npm test
```

```
...\> npm test
```

 [Back to Top](#top)

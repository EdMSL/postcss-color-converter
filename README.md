# postcss-color-converter

> [PostCSS](https://github.com/postcss/postcss) plugin for transform HEX, RGB, HSL and keyword colors between themselves (without transform to keyword color). Uses [color-convert](https://www.npmjs.com/package/color-convert) under hood. Support Sass, Less and CSS variables.

## Installation

```console
$ npm install postcss-color-converter
```

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorConverter = require("postcss-color-converter")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(colorConverter({ outputColorFormat: 'rgb' }))
  .process(css)
  .css
```

## Options

#### `outputColorFormat`
Type: `String`<br>
_Required_<br>
Available values: `hex, rgb, hsl`<br>
Default: ``<br>
Set output color format. Don't forget set this parameter.

#### `alwaysAlpha`
Type: `Boolean`<br>
Default: `false`<br>
If `true`, output RGB and HSL colors will always have alpha chanel value (which will be equal to 1), even if converted from color without alpha chanel.

```js
colorConverter({
  outputColorFormat: 'hsl',
  alwaysAlpha: true,
});
```

## Examples

Using this `input.css` and option `outputColorFormat`: 'rgb':

```scss
body {
  --blue: blue;
  $darkRed: #6009;
  color: red;
  background-color: #ffffff;
  fill: hsla(56, 69%, 57%, 0.3);
  box-shadow:
    0 0 0 0 #fff,
    10px 10px 0 0 green,
    20px 20px 0 0 #00000080,
    30px 30px 0 0 rgb(123, 123, 123);
}

```

you will get:

```scss
body {
  --blue: rgb(0, 0, 255);
  $darkRed: rgba(102, 0, 0, 0.6);
  color: rgb(255, 0, 0);
  background-color: rgb(255, 255, 255);
  fill: rgba(221, 211, 70, 0.3);
  box-shadow:
    0 0 0 0 rgb(255, 255, 255),
    10px 10px 0 0 rgb(0, 128, 0),
    20px 20px 0 0 rgba(0, 0, 0, 0.5),
    30px 30px 0 0 rgb(123, 123, 123);
}
```

Checkout [tests](test) for more examples.

---

## [Changelog](CHANGELOG.md)

## [License](LICENSE)

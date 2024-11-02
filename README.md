# postcss-color-converter

> [PostCSS](https://github.com/postcss/postcss) plugin to convert HEX, RGB, HSL and keyword colors between themselves (without transform to keyword color format). Uses [color-convert](https://www.npmjs.com/package/color-convert) under hood. Supports modern color function notation ([specification](https://drafts.csswg.org/css-color/#the-hsl-notation)), Sass(SCSS) ([postcss-scss](https://www.npmjs.com/package/postcss-scss) or [postcss-sass](https://www.npmjs.com/package/postcss-sass) needed) and CSS variables.

## Installation

```console
npm install postcss postcss-color-converter --save-dev
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

More preferable to use it through the PostCSS CLI

```console
npm install postcss-cli --save-dev
```

Use plugin in your postcss.config.mjs configuration file:

```js
var colorConverter = require('postcss-color-converter');

module.exports = {
  /* set syntax option, if you use it for scss files */
  syntax: 'postcss-scss',
  plugins: [
    colorConverter(/* pluginOptions */)
  ]
}
```

Use npm script in `package.json`, such as:

```json
{
  "scripts": {
    "postcss": "postcss ./src/styles/*.css --config ./postcss.config.mjs -r"
  }
}
```

Then:

```console
npm run postcss
```

Please refer to [PostCSS documentation](https://github.com/postcss/postcss#usage) for your current environment.

## Options

#### `outputColorFormat`

Type: `String`

_Required_

Available values: `hex, rgb, hsl`

Default: ''

Set output color format. Don't forget set this parameter.

#### `ignore`

Type: `String[]`

Available values: `hex, rgb, hsl, keyword`

Default: `[]`

Array of color formats, which you don't want to convert.

#### `alwaysAlpha`

Type: `Boolean`

Default: `false`

If `true`, output RGB and HSL colors will always have alpha chanel value (which will be equal to 1), even if converted from color without alpha chanel. This parameter does not apply to HEX color.

If `ignore` includes `outputColorFormat` color format, this parameter will be ignore.

```js
colorConverter({
  outputColorFormat: 'hsl',
  ignore: ['hex'],
  alwaysAlpha: true,
});
```

## Examples

Using these `input.css` and `input.scss` with `outputColorFormat`: 'rgb' option:

```css
body {
  --blue: blue;
  color: #ef51;
  background-color: #ffffff;
  fill: hsla(56, 69%, 57%, 0.3);
  box-shadow:
    0 0 0 0 #fff,
    10px 10px 0 0 green,
    20px 20px 0 0 #00000080,
    30px 30px 0 0 rgb(123, 123, 123);
}
```

```scss
p {
  $darkRed: #6009;
}
```

you'll get:

```css
body {
  --blue: rgb(0, 0, 255);
  color: rgba(238, 255, 85, 0.07);
  background-color: rgb(255, 255, 255);
  fill: rgba(221, 211, 70, 0.3);
  box-shadow:
    0 0 0 0 rgb(255, 255, 255),
    10px 10px 0 0 rgb(0, 128, 0),
    20px 20px 0 0 rgba(0, 0, 0, 0.5),
    30px 30px 0 0 rgb(123, 123, 123);
}
```

```scss
p {
  $darkRed: rgba(102, 0, 0, 0.6);
}
```

Checkout [tests](test) for more examples or clone this repository and use:

```console
npm i
npm run postcss
```

Then go to the `test/fixtures` folder and see the `common.test.scss` file.

## Contributing

This is my first open-source work and my English is not very good, so if you find inaccuracies or errors in the documentation, then let me know.
Pull requests are always welcome. Pull requests must be accompanied by passing automated tests (`$ npm test`). For bugs and feature requests, please create an issue.

## [Changelog](CHANGELOG.md)

## [License](LICENSE)

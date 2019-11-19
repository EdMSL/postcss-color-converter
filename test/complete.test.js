const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('Various complete test', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('All input colors must be correct converted to hex(a)', function () {
    assert.equal(transform(
      `
      $red: red;
      ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 0%,
          hsla(56, 69%, 57%, 0.5) 50%,
          green 100%,
        );
      }
      `,
      { outputColorFormat: 'hex' },
    ), `
      $red: #ff0000;
      ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 0%,
          #ddd34680 50%,
          #008000 100%,
        );
      }
      `);
  });

  it('All input colors must be correct converted to rgba', function () {
    assert.equal(transform(
      `
      $red: red;
      ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 0%,
          hsla(56, 69%, 57%, 0.5) 50%,
          green 100%,
        );
      }
      `,
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), `
      $red: rgba(255, 0, 0, 1);
      ul {
        background: linear-gradient(
          to bottom,
          rgba(205, 86, 171, 1) 0%,
          rgba(221, 211, 70, 0.5) 50%,
          rgba(0, 128, 0, 1) 100%,
        );
      }
      `);
  });

  it('All input colors must be correct converted to hsl(a)', function () {
    assert.equal(transform(
      `
      padding: 10px;
      color: red;
      $abc: #ffffff80;
      box-shadow: 0 0 0 red, 0 0 0 rgba(255, 0, 0, 0.5);
      `,
      { outputColorFormat: 'hsl' },
    ), `
      padding: 10px;
      color: hsl(0, 100%, 50%);
      $abc: hsla(0, 0%, 100%, 0.5);
      box-shadow: 0 0 0 hsl(0, 100%, 50%), 0 0 0 hsla(0, 100%, 50%, 0.5);
      `);
  });
});

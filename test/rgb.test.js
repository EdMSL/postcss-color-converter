const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('postcss-color-converter for rgb colors', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(255, 255, 255); }');
  });

  it('Input color must be converted to hex', function () {
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          rgb(69, 103, 137) 0%,
          rgb(255, 245, 85) 100%,
        );
      }`,
      { outputColorFormat: 'hex' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          #456789 0%,
          #fff555 100%,
        );
      }`);
  });
});

const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('postcss-color-converter', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    assert.equal(transform(
      'body { color: #ffffff; }',
      {}
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: #ffffff; }',
      { outputColorFormat: 'hex' }
    ), 'body { color: #ffffff; }');
  });

  it('Input color must be converted to rgb', function () {
    assert.equal(transform(
      'body { color: #ffffff; }',
      { outputColorFormat: 'rgb' }
    ), 'body { color: rgb(255, 255, 255); }');
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          #456789 0%,
          #fff555 100%,
        );
      }`,
      { outputColorFormat: 'rgb' }
    ), `ul {
        background: linear-gradient(
          to bottom,
          rgb(69, 103, 137) 0%,
          rgb(255, 245, 85) 100%,
        );
      }`);
    assert.equal(transform(
      'body { color: #555; }',
      { outputColorFormat: 'rgb' }
    ), 'body { color: rgb(85, 85, 85); }');
  });
});

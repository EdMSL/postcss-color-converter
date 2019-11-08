const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('postcss-color-converter for hex colors', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    assert.equal(transform(
      'body { color: #ffffff; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: #fff; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #fff; }');
    assert.equal(transform(
      'body { color: #fff5; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #fff5; }');
    assert.equal(transform(
      'body { color: #FFF5; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #FFF5; }');
    assert.equal(transform(
      'body { color: #FfFc; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #FfFc; }');
  });

  it('Input color must be converted to rgb', function () {
    assert.equal(transform(
      'body { color: #ffffff; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(255, 255, 255); }');
    assert.equal(transform(
      'body { color: #FFFFFF; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(255, 255, 255); }');
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          #456789 0%,
          #fff555 100%,
        );
      }`,
      { outputColorFormat: 'rgb' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          rgb(69, 103, 137) 0%,
          rgb(255, 245, 85) 100%,
        );
      }`);
    assert.equal(transform(
      'body { color: #555; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(85, 85, 85); }');
    assert.equal(transform(
      'body { color: #fff45780; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(255, 244, 87, 0.5); }');
    assert.equal(transform(
      'body { color: #FFF45780; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(255, 244, 87, 0.5); }');
    assert.equal(transform(
      'body { color: #fff45799; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(255, 244, 87, 0.6); }');
    assert.equal(transform(
      'body { color: #c4d9; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(204, 68, 221, 0.6); }');
    assert.equal(transform(
      'body { color: #ecdaf5a2; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(236, 218, 245, 0.64); }');
    assert.equal(transform(
      'body { color: #ecdaf555; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(236, 218, 245, 0.33); }');
    assert.equal(transform(
      'body { color: #ecdaf556; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(236, 218, 245, 0.34); }');
    assert.equal(transform(
      'body { color: #ef51; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(238, 255, 85, 0.07); }');
  });

  it('Input color must be converted to hsl', function () {
    assert.equal(transform(
      'body { color: #c95959; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(0, 51%, 57%); }');
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          #ef5e 0%,
          #a42de9 100%,
        );
      }`,
      { outputColorFormat: 'hsl' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          hsla(66, 100%, 67%, 0.93) 0%,
          hsl(278, 81%, 55%) 100%,
        );
      }`);
    assert.equal(transform(
      'body { color: #ef5; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(66, 100%, 67%); }');
    assert.equal(transform(
      'body { color: #ef51; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsla(66, 100%, 67%, 0.07); }');
    assert.equal(transform(
      'body { color: #57c1ff; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(202, 100%, 67%); }');
    assert.equal(transform(
      'body { color: #57C1FF; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(202, 100%, 67%); }');
  });
});

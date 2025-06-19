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
    assert.equal(transform(
      'body { color: #ccccccff; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ccccccff; }');
    assert.equal(transform(
      'body { color: #ccccccff; }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ccccccff; }');
    assert.equal(transform(
      'body { color: #cccccc22; }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #cccccc22; }');
  });

  it('Invalid input color should not be converted', function () {
    assert.equal(transform(
      'body { color: #ccccc22; }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ccccc22; }');
    assert.equal(transform(
      'body { color: #ccccc22; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ccccc22; }');
    assert.equal(transform(
      'body { color: #cc; }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #cc; }');
    assert.equal(transform(
      'body { color: #cc; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #cc; }');
    assert.equal(transform(
      'body { color: #ccfff; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ccfff; }');
    assert.equal(transform(
      'body { color: #ccfff; }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ccfff; }');
    assert.equal(transform(
      'body { color: #ccfffff; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ccfffff; }');
    assert.equal(transform(
      'body { color: #ccfffff; }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ccfffff; }');
    assert.equal(transform(
      'body { color: #ccffffffa; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ccffffffa; }');
    assert.equal(transform(
      'body { color: #ccffffffa; }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ccffffffa; }');
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
      'body { color: #555; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(85, 85, 85); }');
    assert.equal(transform(
      'body { color: #FFF; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(255, 255, 255); }');
    assert.equal(transform(
      'body { color: lighten(black, 50%); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: lighten(rgb(0, 0, 0), 50%); }');
  });

  it('Input color must be converted to rgba', function () {
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
    assert.equal(transform(
      'body { color: #ef5; }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(238, 255, 85, 1); }');
    assert.equal(transform(
      'body { color: #ffffff; }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(255, 255, 255, 1); }');
  });

  it('Input color must be converted to hsl', function () {
    assert.equal(transform(
      'body { color: #ef5; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(66, 100%, 67%); }');
    assert.equal(transform(
      'body { color: #c95959; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(0, 51%, 57%); }');
  });

  it('Input color must be converted to hsla', function () {
    assert.equal(transform(
      'body { color: #ef51; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsla(66, 100%, 67%, 0.07); }');
    assert.equal(transform(
      'body { color: #57C1FFa2; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsla(202, 100%, 67%, 0.64); }');
    assert.equal(transform(
      'body { color: #57C1FF; }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: hsla(202, 100%, 67%, 1); }');
    assert.equal(transform(
      'body { color: #fff; }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: hsla(0, 0%, 100%, 1); }');
  });

  it('Input color must be converted to oklch', function () {
    assert.equal(transform(
      'body { color: #ef51; }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.95775 0.18717 114.91111 / 0.07); }');
    assert.equal(transform(
      'body { color: #57C1FFa2; }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.77416 0.13155 237.58927 / 0.64); }');
    assert.equal(transform(
      'body { color: #57c1ff; }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.77416 0.13155 237.58927); }');
    assert.equal(transform(
      'body { color: #57C1FF; }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(0.77416 0.13155 237.58927 / 1); }');
    assert.equal(transform(
      'body { color: #fff; }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(1 0 0 / 1); }');
  });

  it('All input colors must be correct converted to hex(a)', function () {
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          #cd56ab80 20%,
          rgb(68, 187, 221) 30%,
          rgba(68, 188, 221, 0.5) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          oklch(0.3875 0.2608 266.85) 70%,
          oklch(0.5609 0.2034 7.43 / 0.89) 80%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'hex' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          #cd56ab80 20%,
          #44bbdd 30%,
          #44bcdd80 40%,
          #ddd346 50%,
          #ddd34680 60%,
          #1601cc 70%,
          #ce255fe3 80%,
          #008000 100%,
        );
      }`);
  });
});

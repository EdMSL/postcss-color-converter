const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('postcss-color-converter for hsl colors', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    assert.equal(transform(
      'body { color: hsl(var(--color), 50%, 10%); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: hsl(var(--color), 50%, 10%); }');
    assert.equal(transform(
      'body { color: hsl(100%, 50%, calc(40 + 20)); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: hsl(100%, 50%, calc(40 + 20)); }');
    assert.equal(transform(
      'body { color: hsla(100%, 50%, 56%, var(--alpha)); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: hsla(100%, 50%, 56%, var(--alpha)); }');
    assert.equal(transform(
      'body { color: hsla(100%, $saturate, 56%, 0.6); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: hsla(100%, $saturate, 56%, 0.6); }');
    assert.equal(transform(
      'body { color: hsl(255, 0%, 0%); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(255, 0%, 0%); }');
    assert.equal(transform(
      'body { color: hsl(10 0% 0%); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(10 0% 0%); }');
    assert.equal(transform(
      'body { color: hsl(10 0% 0% / 1); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(10 0% 0% / 1); }');
    assert.equal(transform(
      'body { color: hsl(10 0% 0% / 0); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(10 0% 0% / 0); }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 1); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsla(0, 0%, 100%, 1); }');
  });

  it('Invalid input color should not be converted', function () {
    assert.equal(transform(
      'body { color: hsl(0, 0%, 120%); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: hsl(0, 0%, 120%); }');
    assert.equal(transform(
      'body { color: hsl(0, -100%, 10%); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: hsl(0, -100%, 10%); }');
    assert.equal(transform(
      'body { color: hsl(-10, 0%, 10%); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: hsl(-10, 0%, 10%); }');
    assert.equal(transform(
      'body { color: hsl(0, 110%, 100%); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: hsl(0, 110%, 100%); }');
    assert.equal(transform(
      'body { color: hsl(361, 10%, 100%); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: hsl(361, 10%, 100%); }');
  });

  it('Input color must be converted to hex', function () {
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { --red: hsla(0, 100%, 50%, 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { --red: #ff0000; }');
    assert.equal(transform(
      'body { $blue: hsl(240, 100%, 50%); }',
      { outputColorFormat: 'hex' },
    ), 'body { $blue: #0000ff; }');
  });

  it('Input color must be converted to hexa', function () {
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, .5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff80; }');
  });

  it('Input color must be converted to rgb', function () {
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(255, 255, 255); }');
  });

  it('Input color must be converted to rgba', function () {
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(255, 255, 255, 0.5); }');
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(255, 255, 255, 1); }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(255, 255, 255, 0.5); }');
  });

  it('Input color must be converted to oklch', function () {
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(1 0 0 / 0.5); }');
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(1 0 0 / 1); }');
    assert.equal(transform(
      'body { background: hsl(50 80% 40%); }',
      { outputColorFormat: 'oklch' },
    ), 'body { background: oklch(0.69747 0.13926 95.67047); }');
    assert.equal(transform(
      'body { background: hsl(0 80% 50% / 25%); }',
      { outputColorFormat: 'oklch' },
    ), 'body { background: oklch(0.58861 0.23047 28.23964 / 0.25); }');
  });

  it('Input color must be converted to oklab', function () {
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(1 0 0 / 0.5); }');
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'oklab', alwaysAlpha: true },
    ), 'body { color: oklab(1 0 0 / 1); }');
    assert.equal(transform(
      'body { background: hsl(50 80% 40%); }',
      { outputColorFormat: 'oklab' },
    ), 'body { background: oklab(0.69747 -0.01376 0.13858); }');
    assert.equal(transform(
      'body { background: hsl(0 80% 50% / 25%); }',
      { outputColorFormat: 'oklab' },
    ), 'body { background: oklab(0.58861 0.20304 0.10905 / 0.25); }');
  });

  it('Input color with modern color function notation must be converted to hsl(a)', function () {
    assert.equal(transform(
      'body { color: hsl(0 0% 100%); }',
      { outputColorFormat: 'hsl',alwaysAlpha: true },
    ), 'body { color: hsla(0 0% 100% / 1); }');
  });

  it('Input color with modern color function notation must be converted to rgb(a)', function () {
    assert.equal(transform(
      'body { color: hsl(0  0%  100%); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(255 255 255); }');
    assert.equal(transform(
      'body { background-color: hsl(0 0% 100% / 0); }',
      { outputColorFormat: 'rgb' },
    ), 'body { background-color: rgba(255 255 255 / 0); }');
    assert.equal(transform(
      'body { background-color: hsl(0 0% 100% / 0.5); }',
      { outputColorFormat: 'rgb' },
    ), 'body { background-color: rgba(255 255 255 / 0.5); }');
    assert.equal(transform(
      'body { background-color: hsl(0 0% 100% / 0.5); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { background-color: rgba(255 255 255 / 0.5); }');
    assert.equal(transform(
      'body { color: hsl(0  0%  100%); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(255 255 255 / 1); }');
  });

  it('Input color with modern color function notation must be converted to hex(a)', function () {
    assert.equal(transform(
      'body { background-color: hsl(0  0%  100%); }',
      { outputColorFormat: 'hex' },
    ), 'body { background-color: #ffffff; }');
    assert.equal(transform(
      'body { background-color: hsl(0  0%  100% / 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { background-color: #ffffff; }');
    assert.equal(transform(
      'body { background-color: hsl(0  0%  100% / 1); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { background-color: #ffffff; }');
    assert.equal(transform(
      'body { background-color: hsl(0  0%  100% / 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { background-color: #ffffff80; }');
    assert.equal(transform(
      'body { background-color: hsl(0  0%  100% / 0.5); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { background-color: #ffffff80; }');
    assert.equal(transform(
      'body { background-color: hsl(0  0%  100% / 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { background-color: #ffffff00; }');
  });

  it('All input colors must be correct converted to hsl(a)', function () {
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
          hsl(56 69% 57%) 70%,
          oklch(0.5237 0.0962 124.94) 80%,
          oklab(0.91191 -0.15203 0.17893) 90%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'hsl' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          hsl(317, 54%, 57%) 10%,
          hsla(317, 54%, 57%, 0.5) 20%,
          hsl(193, 69%, 57%) 30%,
          hsla(193, 69%, 57%, 0.5) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          hsl(56 69% 57%) 70%,
          hsl(80 40% 32%) 80%,
          hsl(84 100% 59%) 90%,
          hsl(120, 100%, 25%) 100%,
        );
      }`);
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
          oklch(0.5237 0.0962 124.94) 70%,
          oklab(0.91191 -0.15203 0.17893) 90%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), `ul {
        background: linear-gradient(
          to bottom,
          hsla(317, 54%, 57%, 1) 10%,
          hsla(317, 54%, 57%, 0.5) 20%,
          hsla(193, 69%, 57%, 1) 30%,
          hsla(193, 69%, 57%, 0.5) 40%,
          hsla(56, 69%, 57%, 1) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          hsla(80 40% 32% / 1) 70%,
          hsla(84 100% 59% / 1) 90%,
          hsla(120, 100%, 25%, 1) 100%,
        );
      }`);
  });
});

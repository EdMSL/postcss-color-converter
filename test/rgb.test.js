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
    assert.equal(transform(
      'body { color: rgb($red, 50, 10); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: rgb($red, 50, 10); }');
    assert.equal(transform(
      'body { color: rgb(100, 50, calc(40 + 20)); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: rgb(100, 50, calc(40 + 20)); }');
    assert.equal(transform(
      'body { color: rgba(100, 50, 56, var(--alpha)); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: rgba(100, 50, 56, var(--alpha)); }');
    assert.equal(transform(
      'body { color: rgba(100, $green, 56, 0.6); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: rgba(100, $green, 56, 0.6); }');
    assert.equal(transform(
      'body { color: rgb(255 255 $red / 0.5); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: rgb(255 255 $red / 0.5); }');
    assert.equal(transform(
      'body { color: rgb(255 255 255); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(255 255 255); }');
    assert.equal(transform(
      'body { color: rgba(255 255 255 / 1); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(255 255 255 / 1); }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 1); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(255, 255, 255, 1); }');
    assert.equal(transform(
      'body { color: rgba(255 255 255 / 1); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(255 255 255 / 1); }');
    assert.equal(transform(
      'body { color: rgb(100 50 56 / var(--alpha)); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: rgb(100 50 56 / var(--alpha)); }');
    assert.equal(transform(
      'body { color: rgb(100 50 56 / var(--alpha)); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: rgb(100 50 56 / var(--alpha)); }');
    assert.equal(transform(
      'body { color: rgb(100 50 56 / var(--alpha)); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: rgb(100 50 56 / var(--alpha)); }');
  });

  it('Invalid input color should not be converted', function () {
    assert.equal(transform(
      'body { color: rgb(355, 255, 255); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: rgb(355, 255, 255); }');
    assert.equal(transform(
      'body { color: rgb(-55, 255, 255); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: rgb(-55, 255, 255); }');
    assert.equal(transform(
      'body { color: rgb(55, o55, 255); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: rgb(55, o55, 255); }');
    assert.equal(transform(
      'body { color: rgb(255, 255, 255, 255, 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: rgb(255, 255, 255, 255, 1); }');
    assert.equal(transform(
      'body { color: rgb(255 255 255 \\ 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: rgb(255 255 255 \\ 1); }');
  });

  it('Input color must be converted to hex', function () {
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 1); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { --red: rgb(255, 0, 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { --red: #ff0000; }');
    assert.equal(transform(
      'body { $green: rgb(0, 255, 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { $green: #00ff00; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff; }');
  });

  it('Input color must be converted to hexa', function () {
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, .5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0.5); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff00; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff00; }');
  });

  it('Input color must be converted to rgba', function () {
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(255, 255, 255, 1); }');
  });

  it('Input color must be converted to hsl', function () {
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(0, 0%, 100%); }');
    assert.equal(transform(
      'body { color: rgb(253, 254, 255); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(210, 100%, 100%); }');
  });

  it('Input color must be converted to hsla', function () {
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0.5); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsla(0, 0%, 100%, 0.5); }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0.5); }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: hsla(0, 0%, 100%, 0.5); }');
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: hsla(0, 0%, 100%, 1); }');
  });

  it('Input color must be converted to oklch', function () {
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0.5); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(1 0 0 / 0.5); }');
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(1 0 0 / 1); }');
    assert.equal(transform(
      'body { color: rgb(255, 255, 255, 0.5); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(1 0 0 / 0.5); }');
    assert.equal(transform(
      'body { color: rgb(55, 105, 200); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.53755 0.15767 261.75889); }');
    assert.equal(transform(
      'body { color: rgb(37, 15, 70); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.23863 0.09672 296.64188); }');
    assert.equal(transform(
      'body { color: rgb(37, 15, 70); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(0.23863 0.09672 296.64188 / 1); }');
    assert.equal(transform(
      'body { color: rgba(17, 168, 13, 0.9); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.6354 0.21145 142.44562 / 0.9); }');
    assert.equal(transform(
      'body { color: rgba(17, 168, 13, 0.9); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(0.6354 0.21145 142.44562 / 0.9); }');
    assert.equal(transform(
      'body { color: rgba(0, 0, 0, 0); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0 0 0 / 0); }');
    assert.equal(transform(
      'body { color: rgba(0, 0, 0, 0); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(0 0 0 / 0); }');
  });

  it('Input color must be converted to oklab', function () {
    assert.equal(transform(
      'body { color: rgb(0, 0, 0); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(0 0 0); }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0.5); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(1 0 0 / 0.5); }');
    assert.equal(transform(
      'body { color: rgb(14, 72, 199); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(0.45812 -0.02566 -0.20357); }');
  });

  it('Input color with modern color function notation must be converted to hsla', function () {
    assert.equal(transform(
      'body { background-color: rgb(255 255 255 / 0); }',
      { outputColorFormat: 'hsl' },
    ), 'body { background-color: hsla(0 0% 100% / 0); }');
    assert.equal(transform(
      'body { background-color: rgb(255 255 255); }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { background-color: hsla(0 0% 100% / 1); }');
    assert.equal(transform(
      'body { background-color: rgb(255 255 255 / 1); }',
      { outputColorFormat: 'hsl' },
    ), 'body { background-color: hsla(0 0% 100% / 1); }');
    assert.equal(transform(
      'body { background-color: rgb(255 255 255 / 1); }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { background-color: hsla(0 0% 100% / 1); }');
  });

  it('Input color with modern color function notation must be converted to rgba', function () {
    assert.equal(transform(
      'body { background-color: rgb(255 255 255); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { background-color: rgba(255 255 255 / 1); }');
  });

  it('Input color with modern color function notation must be converted to hex(a)', function () {
    assert.equal(transform(
      'body { background-color: rgb(255 255 255); }',
      { outputColorFormat: 'hex' },
    ), 'body { background-color: #ffffff; }');
    assert.equal(transform(
      'body { background-color: rgb(255 255 255 / 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { background-color: #ffffff; }');
    assert.equal(transform(
      'body { background-color: rgb(255 255 255 / 1); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { background-color: #ffffff; }');
    assert.equal(transform(
      'body { background-color: rgb(255 255 255 / 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { background-color: #ffffff80; }');
    assert.equal(transform(
      'body { background-color: rgb(255 255 255 / 0.5); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { background-color: #ffffff80; }');
    assert.equal(transform(
      'body { background-color: rgb(255 255 255 / 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { background-color: #ffffff00; }');
  });

  it('All input colors must be correct converted to rgb(a)', function () {
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
          rgb(255 255 255) 70%,
          oklch(0.401 0.123 21.57 / 0.5) 80%,
          oklab(0.91191 -0.15203 0.17893) 90%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'rgb' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          rgb(205, 86, 171) 10%,
          rgba(205, 86, 171, 0.5) 20%,
          rgb(68, 187, 221) 30%,
          rgba(68, 188, 221, 0.5) 40%,
          rgb(221, 211, 70) 50%,
          rgba(221, 211, 70, 0.5) 60%,
          rgb(255 255 255) 70%,
          rgba(125 36 41 / 0.5) 80%,
          rgb(171 255 46) 90%,
          rgb(0, 128, 0) 100%,
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
          rgb(255 255 255) 70%,
          oklch(0.6354 0.21145 142.44562) 80%,
          oklab(0.91191 -0.15203 0.17893) 90%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), `ul {
        background: linear-gradient(
          to bottom,
          rgba(205, 86, 171, 1) 10%,
          rgba(205, 86, 171, 0.5) 20%,
          rgba(68, 187, 221, 1) 30%,
          rgba(68, 188, 221, 0.5) 40%,
          rgba(221, 211, 70, 1) 50%,
          rgba(221, 211, 70, 0.5) 60%,
          rgba(255 255 255 / 1) 70%,
          rgba(17 168 13 / 1) 80%,
          rgba(171 255 46 / 1) 90%,
          rgba(0, 128, 0, 1) 100%,
        );
      }`);
  });
});

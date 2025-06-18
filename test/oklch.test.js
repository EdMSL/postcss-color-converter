const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('postcss-color-converter for oklch colors', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    assert.equal(transform(
      'body { color: oklch(1 0 0); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(1 0 0); }');
    assert.equal(transform(
      'body { color: oklch(100% 0 0); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(100% 0 0); }');
    assert.equal(transform(
      'body { color: oklch(0 0 0); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0 0 0); }');
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 21.57); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.401 0.123 21.57); }');
    assert.equal(transform(
      'body { color: oklch(0.255 0.39 33 / 1); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.255 0.39 33 / 1); }');
    assert.equal(transform(
      'body { color: oklch(0.255 0.39 33 / 1); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(0.255 0.39 33 / 1); }');
    assert.equal(transform(
      'body { color: oklch($red 0.5 10.2); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: oklch($red 0.5 10.2); }');
    assert.equal(transform(
      'body { color: oklch(0 0.505 calc(40 + 20)); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: oklch(0 0.505 calc(40 + 20)); }');
    assert.equal(transform(
      'body { color: oklch(0 0.505 calc(40 + 20)); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: oklch(0 0.505 calc(40 + 20)); }');
    assert.equal(transform(
      'body { color: oklch(0.105 0.508 56 / var(--alpha)); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: oklch(0.105 0.508 56 / var(--alpha)); }');
    assert.equal(transform(
      'body { color: oklch(0.105 0.508 56 / var(--alpha)); }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: oklch(0.105 0.508 56 / var(--alpha)); }');
    assert.equal(transform(
      'body { color: oklch(0.912 $green 22 / 0.6); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: oklch(0.912 $green 22 / 0.6); }');
    assert.equal(transform(
      'body { color: oklch(0.3 0.255 $red); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: oklch(0.3 0.255 $red); }');
  });

  it('Invalid input color should not be converted', function () {
    assert.equal(transform(
      'body { color: oklch(-0.401 0.123 21.57); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: oklch(-0.401 0.123 21.57); }');
    assert.equal(transform(
      'body { color: oklch(0.401 -0.123 21.57); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: oklch(0.401 -0.123 21.57); }');
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 5o / 1); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: oklch(0.401 0.123 5o / 1); }');
  });

  it('Input color must be converted to hexa', function () {
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 21.57 / 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #7d242980; }');
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 21.57 / 0.5); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #7d242980; }');
  })

  it('Input color must be converted to hex', function () {
    assert.equal(transform(
      'body { color: oklch(1 0 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: oklch(0 0 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #000000; }');
    assert.equal(transform(
      'body { color: oklch(0.6317 0.2377 8.66); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #f5236c; }');
    assert.equal(transform(
      'body { color: oklch(0.5321 0.2458 262.77); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #0e58f7; }');
    assert.equal(transform(
      'body { --red: oklch(0.628 0.2577 29.23); }',
      { outputColorFormat: 'hex' },
    ), 'body { --red: #ff0000; }');
    assert.equal(transform(
      'body { $blue: oklch(0.452 0.313214 264.052); }',
      { outputColorFormat: 'hex' },
    ), 'body { $blue: #0000ff; }');
  });

  it('Input color must be converted to hexa', function () {
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 21.57 / 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #7d242980; }');
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 21.57); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #7d2429; }');
  });

  it('Input color must be converted to rgb', function () {
    assert.equal(transform(
      'body { color: oklch(0.8 0.2458 146); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(0 228 75); }');
  });

  it('Input color must be converted to hsl', function () {
    assert.equal(transform(
      'body { color: oklch(1 0 0); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(0 0% 100%); }');
  });

  // it('Input color must be converted to rgba', function () {
  //   assert.equal(transform(
  //     'body { color: hsla(0, 0%, 100%, 0.5); }',
  //     { outputColorFormat: 'rgb' },
  //   ), 'body { color: rgba(255, 255, 255, 0.5); }');
  //   assert.equal(transform(
  //     'body { color: hsl(0, 0%, 100%); }',
  //     { outputColorFormat: 'rgb', alwaysAlpha: true },
  //   ), 'body { color: rgba(255, 255, 255, 1); }');
  //   assert.equal(transform(
  //     'body { color: hsla(0, 0%, 100%, 0.5); }',
  //     { outputColorFormat: 'rgb', alwaysAlpha: true },
  //   ), 'body { color: rgba(255, 255, 255, 0.5); }');
  // });

  // it('Input color with modern color function notation must be converted to hsl(a)', function () {
  //   assert.equal(transform(
  //     'body { color: hsl(0 0% 100%); }',
  //     { outputColorFormat: 'hsl',alwaysAlpha: true },
  //   ), 'body { color: hsl(0 0% 100% / 1); }');
  // });

  // it('Input color with modern color function notation must be converted to rgb(a)', function () {
  //   assert.equal(transform(
  //     'body { color: hsl(0  0%  100%); }',
  //     { outputColorFormat: 'rgb' },
  //   ), 'body { color: rgb(255 255 255); }');
  //   assert.equal(transform(
  //     'body { background-color: hsl(0 0% 100% / 0); }',
  //     { outputColorFormat: 'rgb' },
  //   ), 'body { background-color: rgb(255 255 255 / 0); }');
  //   assert.equal(transform(
  //     'body { background-color: hsl(0 0% 100% / 0.5); }',
  //     { outputColorFormat: 'rgb' },
  //   ), 'body { background-color: rgb(255 255 255 / 0.5); }');
  //   assert.equal(transform(
  //     'body { background-color: hsl(0 0% 100% / 0.5); }',
  //     { outputColorFormat: 'rgb', alwaysAlpha: true },
  //   ), 'body { background-color: rgb(255 255 255 / 0.5); }');
  //   assert.equal(transform(
  //     'body { color: hsl(0  0%  100%); }',
  //     { outputColorFormat: 'rgb', alwaysAlpha: true },
  //   ), 'body { color: rgb(255 255 255 / 1); }');
  // });

  // it('Input color with modern color function notation must be converted to hex(a)', function () {
  //   assert.equal(transform(
  //     'body { background-color: hsl(0  0%  100%); }',
  //     { outputColorFormat: 'hex' },
  //   ), 'body { background-color: #ffffff; }');
  //   assert.equal(transform(
  //     'body { background-color: hsl(0  0%  100% / 1); }',
  //     { outputColorFormat: 'hex' },
  //   ), 'body { background-color: #ffffff; }');
  //   assert.equal(transform(
  //     'body { background-color: hsl(0  0%  100% / 1); }',
  //     { outputColorFormat: 'hex', alwaysAlpha: true },
  //   ), 'body { background-color: #ffffff; }');
  //   assert.equal(transform(
  //     'body { background-color: hsl(0  0%  100% / 0.5); }',
  //     { outputColorFormat: 'hex' },
  //   ), 'body { background-color: #ffffff80; }');
  //   assert.equal(transform(
  //     'body { background-color: hsl(0  0%  100% / 0.5); }',
  //     { outputColorFormat: 'hex', alwaysAlpha: true },
  //   ), 'body { background-color: #ffffff80; }');
  //   assert.equal(transform(
  //     'body { background-color: hsl(0  0%  100% / 0); }',
  //     { outputColorFormat: 'hex' },
  //   ), 'body { background-color: #ffffff00; }');
  // });

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
          hsla(120, 100%, 25%, 1) 100%,
        );
      }`);
  });
});

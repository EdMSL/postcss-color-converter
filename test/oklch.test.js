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
      'body { color: oklch(0.401 - 0.123 21.57); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: oklch(0.401 - 0.123 21.57); }');
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 5o / 1); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: oklch(0.401 0.123 5o / 1); }');
  });

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
      'body { $blue: oklch(0.452 0.313214 264.052 / 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { $blue: #0000ff; }');
  });

  it('Input color must be converted to hexa', function () {
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 21.57 / 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #7d242980; }');
    assert.equal(transform(
      'body { color: oklch(0.401 0.123 21.57 / 0.24); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #7d24293d; }');
  });

  it('Input color must be converted to rgb', function () {
    assert.equal(transform(
      'body { color: oklch(0.8 0.2458 146); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(0 228 75); }');
    assert.equal(transform(
      'body { color: oklch(0.5609 0.2034 7.43); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(206 37 95); }');
    assert.equal(transform(
      'body { color: oklch(0.77416 0.13155 237.58927); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(87 193 255); }');
  });

  it('Input color must be converted to rgba', function () {
    assert.equal(transform(
      'body { color: oklch(0.8 0.2458 146 / 0.35); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(0 228 75 / 0.35); }');
    assert.equal(transform(
      'body { color: oklch(0.5609 0.2034 7.43 / 0.81); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(206 37 95 / 0.81); }');
    assert.equal(transform(
      'body { color: oklch(0.5609 0.2034 7.43); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(206 37 95 / 1); }');
    assert.equal(transform(
      'body { color: oklch(0.77416 0.13155 237.58927 / 0.44); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(87 193 255 / 0.44); }');
  });

  it('Input color must be converted to hsl', function () {
    assert.equal(transform(
      'body { color: oklch(1 0 0); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(0 0% 100%); }');
    assert.equal(transform(
      'body { color: oklch(0.2863 0.0548 173.36); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(167 100% 10%); }');
    assert.equal(transform(
      'body { background: oklch(0.82839 0.15701 171.96382); }',
      { outputColorFormat: 'hsl' },
    ), 'body { background: hsl(167 81% 51%); }');
  });

  it('Input color must be converted to hsla', function () {
    assert.equal(transform(
      'body { color: oklch(1 0 0 / 0.46); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsla(0 0% 100% / 0.46); }');
    assert.equal(transform(
      'body { color: oklch(0.2863 0.0548 173.36 / 0.27); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsla(167 100% 10% / 0.27); }');
    assert.equal(transform(
      'body { color: oklch(0.2863 0.0548 173.36); }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: hsla(167 100% 10% / 1); }');
    assert.equal(transform(
      'body { background: oklch(0.82839 0.15701 171.96382 / 0.72); }',
      { outputColorFormat: 'hsl' },
    ), 'body { background: hsla(167 81% 51% / 0.72); }');
  });

  it('Input color must be converted to oklab', function () {
    assert.equal(transform(
      'body { background: oklch(0.47 0.18682 15.52411); }',
      { outputColorFormat: 'oklab' },
    ), 'body { background: oklab(0.47 0.18 0.05); }');
    assert.equal(transform(
      'body { background: oklch(0.47 0.18682 15.52411 / 1); }',
      { outputColorFormat: 'oklab' },
    ), 'body { background: oklab(0.47 0.18 0.05 / 1); }');
    assert.equal(transform(
      'body { background: oklch(0.86 0.18 97); }',
      { outputColorFormat: 'oklab' },
    ), 'body { background: oklab(0.86 -0.02194 0.17866); }');
    assert.equal(transform(
      'body { background: oklch(0.86 0.18 97 / 0.23); }',
      { outputColorFormat: 'oklab' },
    ), 'body { background: oklab(0.86 -0.02194 0.17866 / 0.23); }');
    assert.equal(transform(
      'body { background: oklch(0.86 0.18 97); }',
      { outputColorFormat: 'oklab', alwaysAlpha: true },
    ), 'body { background: oklab(0.86 -0.02194 0.17866 / 1); }');
    assert.equal(transform(
      'body { background: oklch(86% 0.18 97); }',
      { outputColorFormat: 'oklab' },
    ), 'body { background: oklab(0.86 -0.02194 0.17866); }');
  });

  it('All input colors must be correct converted to oklch', function () {
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          #cd56ab80 20%,
          rgba(68, 187, 221, 1) 30%,
          rgba(68, 187, 221, 0.5) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          oklch(0.85 0.1567 105.23) 70%,
          oklab(0.86 -0.02194 0.17866) 80%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'oklch' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          oklch(0.63224 0.17882 340.13323) 10%,
          oklch(0.63224 0.17882 340.13323 / 0.5) 20%,
          oklch(0.73979 0.11435 220.62738 / 1) 30%,
          oklch(0.73979 0.11435 220.62738 / 0.5) 40%,
          oklch(0.85023 0.15659 105.25833) 50%,
          oklch(0.85023 0.15659 105.25833 / 0.5) 60%,
          oklch(0.85 0.1567 105.23) 70%,
          oklch(0.86 0.18 97.00105) 80%,
          oklch(0.51975 0.17686 142.49383) 100%,
        );
      }`);
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          #cd56ab80 20%,
          rgb(68, 187, 221) 30%,
          rgba(68, 187, 221, 0.5) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          oklch(0.85 0.1567 105.23) 70%,
          oklab(0.86 -0.02194 0.17866) 80%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), `ul {
        background: linear-gradient(
          to bottom,
          oklch(0.63224 0.17882 340.13323 / 1) 10%,
          oklch(0.63224 0.17882 340.13323 / 0.5) 20%,
          oklch(0.73979 0.11435 220.62738 / 1) 30%,
          oklch(0.73979 0.11435 220.62738 / 0.5) 40%,
          oklch(0.85023 0.15659 105.25833 / 1) 50%,
          oklch(0.85023 0.15659 105.25833 / 0.5) 60%,
          oklch(0.85 0.1567 105.23 / 1) 70%,
          oklch(0.86 0.18 97.00105 / 1) 80%,
          oklch(0.51975 0.17686 142.49383 / 1) 100%,
        );
      }`);
  });
});

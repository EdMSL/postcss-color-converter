const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('postcss-color-converter for oklab colors', function () {
  function transform(source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    assert.equal(transform(
      'body { color: oklab(1 0 0); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(1 0 0); }');
    assert.equal(transform(
      'body { color: oklab(100% 0 0); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(100% 0 0); }');
    assert.equal(transform(
      'body { color: oklab(0 0 0); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(0 0 0); }');
    assert.equal(transform(
      'body { color: oklab(0.401 0.123 0.21578); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(0.401 0.123 0.21578); }');
    assert.equal(transform(
      'body { color: oklab(0.255 0.39 0.33547 / 1); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(0.255 0.39 0.33547 / 1); }');
    assert.equal(transform(
      'body { color: oklab(0.25635 0.17939 0.65474 / 1); }',
      { outputColorFormat: 'oklab', alwaysAlpha: true },
    ), 'body { color: oklab(0.25635 0.17939 0.65474 / 1); }');
    assert.equal(transform(
      'body { color: oklab($red 0.5789 0.07813); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: oklab($red 0.5789 0.07813); }');
    assert.equal(transform(
      'body { color: oklab(0 0.505 calc(40 + 20)); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: oklab(0 0.505 calc(40 + 20)); }');
    assert.equal(transform(
      'body { color: oklab(0 0.505 calc(40 + 20)); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: oklab(0 0.505 calc(40 + 20)); }');
    assert.equal(transform(
      'body { color: oklab(0.10506 0.50819 0.41256 / var(--alpha)); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: oklab(0.10506 0.50819 0.41256 / var(--alpha)); }');
    assert.equal(transform(
      'body { color: oklab(0.17805 0.51808 0.39714 / var(--alpha)); }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: oklab(0.17805 0.51808 0.39714 / var(--alpha)); }');
    assert.equal(transform(
      'body { color: oklab(0.91213 $green 0.32522 / 0.6); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: oklab(0.91213 $green 0.32522 / 0.6); }');
    assert.equal(transform(
      'body { color: oklab(0.02313 0.28758 $red); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: oklab(0.02313 0.28758 $red); }');
  });

  it('Invalid input color should not be converted', function () {
    assert.equal(transform(
      'body { color: oklab(-0.401 0.123 21.57); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: oklab(-0.401 0.123 21.57); }');
    assert.equal(transform(
      'body { color: oklab(0.401 -0.123 21.57); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: oklab(0.401 -0.123 21.57); }');
    assert.equal(transform(
      'body { color: oklab(0.401 0.123 -21.57); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(0.401 0.123 -21.57); }');
    assert.equal(transform(
      'body { color: oklab(0.401 - 0.123 -0.2157); }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(0.401 - 0.123 -0.2157); }');
    assert.equal(transform(
      'body { color: oklab(0.401 0.123 5o / 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: oklab(0.401 0.123 5o / 1); }');
  });

  it('Input color must be converted to hex(a)', function () {
    assert.equal(transform(
      'body { color: oklab(1 0 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: oklab(0 0 0); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #000000; }');
    assert.equal(transform(
      'body { color: oklab(0.91191 -0.15203 0.17893); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #abff2e; }');
    assert.equal(transform(
      'body { color: oklab(0.91191 -0.15203 0.17893); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #abff2e; }');
    assert.equal(transform(
      'body { color: oklab(0.7556 0.07759 -0.10386); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #c599f0; }');
    assert.equal(transform(
      'body { $somepink: oklab(0.65454 0.26284 -0.02378 / 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { $somepink: #fe1199; }');
  });

  it('Input color must be converted to hex(a)', function () {
    assert.equal(transform(
      'body { --someblue: oklab(0.663 -0.06884 -0.15771 / 0.34); }',
      { outputColorFormat: 'hex' },
    ), 'body { --someblue: #0099f557; }');
    assert.equal(transform(
      'body { color: oklab(0.91191 -0.15203 0.17893 / 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #abff2e80; }');
  });

  it('Input color must be converted to rgb', function () {
    assert.equal(transform(
      'body { color: oklab(0.45812 -0.02566 -0.20357); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(14 72 199); }');
    assert.equal(transform(
      'body { $somevar: oklab(0.45812 -0.02566 -0.20357); }',
      { outputColorFormat: 'rgb' },
    ), 'body { $somevar: rgb(14 72 199); }');
    assert.equal(transform(
      'body { --somevar: oklab(0.45812 -0.02566 -0.20357); }',
      { outputColorFormat: 'rgb' },
    ), 'body { --somevar: rgb(14 72 199); }');
  });

  it('Input color must be converted to rgba', function () {
    assert.equal(transform(
      'body { color: oklab(0.45812 -0.02566 -0.20357 / 0.65); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(14 72 199 / 0.65); }');
    assert.equal(transform(
      'body { color: oklab(0.45812 -0.02566 -0.20357); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(14 72 199 / 1); }');
  });

  it('Input color must be converted to hsl', function () {
    assert.equal(transform(
      'body { color: oklab(0.45812 -0.02566 -0.20357); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(221 87% 42%); }');
  });

  it('Input color must be converted to hsla', function () {
    assert.equal(transform(
      'body { color: oklab(0.45812 -0.02566 -0.20357 / 0.09); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsla(221 87% 42% / 0.09); }');
    assert.equal(transform(
      'body { color: oklab(0.45812 -0.02566 -0.20357); }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: hsla(221 87% 42% / 1); }');
  });
});



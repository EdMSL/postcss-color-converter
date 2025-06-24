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

  it('Input color must be converted to oklch', function () {
    assert.equal(transform(
      'body { color: oklab(0.47 0.18 0.05); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.47 0.18682 15.52411); }');
    assert.equal(transform(
      'body { color: oklab(0.47 0.18 0.05); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(0.47 0.18682 15.52411 / 1); }');
    assert.equal(transform(
      'body { color: oklab(0.86 -0.02194 0.17866); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.86 0.18 97.00105); }');
    assert.equal(transform(
      'body { color: oklab(0.86 -0.02194 0.17866); }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(0.86 0.18 97.00105 / 1); }');
    assert.equal(transform(
      'body { color: oklab(69% 0.13 0.14); }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.69 0.19105 47.1211); }');
  });

  it('All input colors must be correct converted to oklab', function () {
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
          oklch(0.3875 0.2608 266.85) 70%,
          oklch(0.5609 0.2034 7.43 / 0.89) 80%,
          oklab(0.91191 -0.15203 0.17893) 90%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'oklab' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          oklab(0.63224 0.16818 -0.06077) 10%,
          oklab(0.63224 0.16818 -0.06077 / 0.5) 20%,
          oklab(0.73979 -0.08679 -0.07446) 30%,
          oklab(0.73979 -0.08679 -0.07446 / 0.5) 40%,
          oklab(0.85023 -0.04121 0.15107) 50%,
          oklab(0.85023 -0.04121 0.15107 / 0.5) 60%,
          oklab(0.3875 -0.01433 -0.26041) 70%,
          oklab(0.5609 0.20169 0.0263 / 0.89) 80%,
          oklab(0.91191 -0.15203 0.17893) 90%,
          oklab(0.51975 -0.1403 0.10768) 100%,
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
          oklch(0.3875 0.2608 266.85) 70%,
          oklch(0.5609 0.2034 7.43 / 0.89) 80%,
          oklab(0.91191 -0.15203 0.17893) 90%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'oklab', alwaysAlpha: true },
    ), `ul {
        background: linear-gradient(
          to bottom,
          oklab(0.63224 0.16818 -0.06077 / 1) 10%,
          oklab(0.63224 0.16818 -0.06077 / 0.5) 20%,
          oklab(0.73979 -0.08679 -0.07446 / 1) 30%,
          oklab(0.73979 -0.08679 -0.07446 / 0.5) 40%,
          oklab(0.85023 -0.04121 0.15107 / 1) 50%,
          oklab(0.85023 -0.04121 0.15107 / 0.5) 60%,
          oklab(0.3875 -0.01433 -0.26041 / 1) 70%,
          oklab(0.5609 0.20169 0.0263 / 0.89) 80%,
          oklab(0.91191 -0.15203 0.17893 / 1) 90%,
          oklab(0.51975 -0.1403 0.10768 / 1) 100%,
        );
      }`);
  });
});



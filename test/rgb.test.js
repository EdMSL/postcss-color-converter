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
  });

  it('Input color must be converted to hexa', function () {
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 0.5); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: rgba(255, 255, 255, 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffffff; }');
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffffff; }');
  });

  it('Input color must be converted to hsl', function () {
    assert.equal(transform(
      'body { color: rgb(255, 255, 255); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(0, 0%, 100%); }');
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
          rgba(0, 128, 0, 1) 100%,
        );
      }`);
  });
});

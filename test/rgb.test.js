import postcss from 'postcss';
import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('postcss-color-converter for rgb colors', function () {
  function transform(source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    expect(transform('body { color: rgb(255, 255, 255); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgb(255, 255, 255); }');
    expect(transform('body { color: rgb($red, 50, 10); }', { outputColorFormat: 'hex' })).toBe('body { color: rgb($red, 50, 10); }');
    expect(transform('body { color: rgb(100, 50, calc(40 + 20)); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgb(100, 50, calc(40 + 20)); }');
    expect(transform('body { color: rgba(100, 50, 56, var(--alpha)); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgba(100, 50, 56, var(--alpha)); }');
    expect(transform('body { color: rgba(100, $green, 56, 0.6); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgba(100, $green, 56, 0.6); }');
    expect(transform('body { color: rgb(255 255 $red / 0.5); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgb(255 255 $red / 0.5); }');
    expect(transform('body { color: rgb(255 255 255); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgb(255 255 255); }');
    expect(transform('body { color: rgb(255 255 255 / 1); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgb(255 255 255 / 1); }');
    expect(transform('body { color: rgba(255, 255, 255, 1); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgba(255, 255, 255, 1); }');
    expect(transform('body { color: rgb(255 255 255 / 1); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { color: rgb(255 255 255 / 1); }');
    expect(transform('body { color: rgb(100 50 56 / var(--alpha)); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { color: rgb(100 50 56 / var(--alpha)); }');
    expect(transform('body { color: rgb(100 50 56 / var(--alpha)); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgb(100 50 56 / var(--alpha)); }');
    expect(transform('body { color: rgb(100 50 56 / var(--alpha)); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { color: rgb(100 50 56 / var(--alpha)); }');
  });

  it('Input color must be converted to rgba', function () {
    expect(transform('body { color: rgb(255, 255, 255); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { color: rgba(255, 255, 255, 1); }');
  });

  it('Input color must be converted to hex', function () {
    expect(transform('body { color: rgb(255, 255, 255); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff; }');
    expect(transform('body { color: rgba(255, 255, 255, 1); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff; }');
    expect(transform('body { color: rgba(255, 255, 255, 1); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { color: #ffffff; }');
    expect(transform('body { --red: rgb(255, 0, 0); }', { outputColorFormat: 'hex' })).toBe('body { --red: #ff0000; }');
    expect(transform('body { $green: rgb(0, 255, 0); }', { outputColorFormat: 'hex' })).toBe('body { $green: #00ff00; }');
    expect(transform('body { color: rgba(255, 255, 255, 1); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff; }');
    expect(transform('body { color: rgb(255, 255, 255); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { color: #ffffff; }');
  });

  it('Input color must be converted to hexa', function () {
    expect(transform('body { color: rgba(255, 255, 255, 0.5); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff80; }');
    expect(transform('body { color: rgba(255, 255, 255, .5); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff80; }');
    expect(transform('body { color: rgba(255, 255, 255, 0.5); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { color: #ffffff80; }');
    expect(transform('body { color: rgba(255, 255, 255, 0); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { color: #ffffff00; }');
    expect(transform('body { color: rgba(255, 255, 255, 0); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff00; }');
  });

  it('Input color must be converted to hsl', function () {
    expect(transform('body { color: rgb(255, 255, 255); }', { outputColorFormat: 'hsl' })).toBe('body { color: hsl(0, 0%, 100%); }');
    expect(transform('body { color: rgb(253, 254, 255); }', { outputColorFormat: 'hsl' })).toBe('body { color: hsl(210, 100%, 100%); }');
  });

  it('Input color must be converted to hsla', function () {
    expect(transform('body { color: rgba(255, 255, 255, 0.5); }', { outputColorFormat: 'hsl' })).toBe('body { color: hsla(0, 0%, 100%, 0.5); }');
    expect(transform('body { color: rgba(255, 255, 255, 0.5); }', { outputColorFormat: 'hsl', alwaysAlpha: true })).toBe('body { color: hsla(0, 0%, 100%, 0.5); }');
    expect(transform('body { color: rgb(255, 255, 255); }', { outputColorFormat: 'hsl', alwaysAlpha: true })).toBe('body { color: hsla(0, 0%, 100%, 1); }');
  });

  it('Input color with modern color function notation must be converted to hsl', function () {
    expect(transform('body { background-color: rgb(255 255 255 / 0); }', { outputColorFormat: 'hsl' })).toBe('body { background-color: hsl(0 0% 100% / 0); }');
    expect(transform('body { background-color: rgb(255 255 255); }', { outputColorFormat: 'hsl', alwaysAlpha: true })).toBe('body { background-color: hsl(0 0% 100% / 1); }');
    expect(transform('body { background-color: rgb(255 255 255 / 1); }', { outputColorFormat: 'hsl' })).toBe('body { background-color: hsl(0 0% 100% / 1); }');
    expect(transform('body { background-color: rgb(255 255 255 / 1); }', { outputColorFormat: 'hsl', alwaysAlpha: true })).toBe('body { background-color: hsl(0 0% 100% / 1); }');
  });

  it('Input color with modern color function notation must be converted to rgb', function () {
    expect(transform('body { background-color: rgb(255 255 255); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { background-color: rgb(255 255 255 / 1); }');
  });

  it('Input color with modern color function notation must be converted to hex(a)', function () {
    expect(transform('body { background-color: rgb(255 255 255); }', { outputColorFormat: 'hex' })).toBe('body { background-color: #ffffff; }');
    expect(transform('body { background-color: rgb(255 255 255 / 1); }', { outputColorFormat: 'hex' })).toBe('body { background-color: #ffffff; }');
    expect(transform('body { background-color: rgb(255 255 255 / 1); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { background-color: #ffffff; }');
    expect(transform('body { background-color: rgb(255 255 255 / 0.5); }', { outputColorFormat: 'hex' })).toBe('body { background-color: #ffffff80; }');
    expect(transform('body { background-color: rgb(255 255 255 / 0.5); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { background-color: #ffffff80; }');
    expect(transform('body { background-color: rgb(255 255 255 / 0); }', { outputColorFormat: 'hex' })).toBe('body { background-color: #ffffff00; }');
  });

  it('All input colors must be correct converted to rgb(a)', function () {
    expect(
      transform(
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
          green 100%,
        );
      }`,
        { outputColorFormat: 'rgb' }
      )
    ).toBe(
      `ul {
        background: linear-gradient(
          to bottom,
          rgb(205, 86, 171) 10%,
          rgba(205, 86, 171, 0.5) 20%,
          rgb(68, 187, 221) 30%,
          rgba(68, 188, 221, 0.5) 40%,
          rgb(221, 211, 70) 50%,
          rgba(221, 211, 70, 0.5) 60%,
          rgb(255 255 255) 70%,
          rgb(0, 128, 0) 100%,
        );
      }`
    );
    expect(
      transform(
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
          green 100%,
        );
      }`,
        { outputColorFormat: 'rgb', alwaysAlpha: true }
      )
    ).toBe(
      `ul {
        background: linear-gradient(
          to bottom,
          rgba(205, 86, 171, 1) 10%,
          rgba(205, 86, 171, 0.5) 20%,
          rgba(68, 187, 221, 1) 30%,
          rgba(68, 188, 221, 0.5) 40%,
          rgba(221, 211, 70, 1) 50%,
          rgba(221, 211, 70, 0.5) 60%,
          rgb(255 255 255 / 1) 70%,
          rgba(0, 128, 0, 1) 100%,
        );
      }`
    );
  });
});

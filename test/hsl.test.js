import postcss from 'postcss';
import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('postcss-color-converter for hsl colors', function () {
  function transform(source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    expect(transform('body { color: hsl(var(--color), 50%, 10%); }', { outputColorFormat: 'rgb' })).toBe('body { color: hsl(var(--color), 50%, 10%); }');
    expect(transform('body { color: hsl(100%, 50%, calc(40 + 20)); }', { outputColorFormat: 'rgb' })).toBe('body { color: hsl(100%, 50%, calc(40 + 20)); }');
    expect(transform('body { color: hsla(100%, 50%, 56%, var(--alpha)); }', { outputColorFormat: 'rgb' })).toBe('body { color: hsla(100%, 50%, 56%, var(--alpha)); }');
    expect(transform('body { color: hsl(255, 0%, 0%); }', { outputColorFormat: 'hsl' })).toBe('body { color: hsl(255, 0%, 0%); }');
    expect(transform('body { color: hsl(10 0% 0%); }', { outputColorFormat: 'hsl' })).toBe('body { color: hsl(10 0% 0%); }');
    expect(transform('body { color: hsl(10 0% 0% / 1); }', { outputColorFormat: 'hsl' })).toBe('body { color: hsl(10 0% 0% / 1); }');
    expect(transform('body { color: hsl(10 0% 0% / 0); }', { outputColorFormat: 'hsl' })).toBe('body { color: hsl(10 0% 0% / 0); }');
    expect(transform('body { color: hsla(0, 0%, 100%, 1); }', { outputColorFormat: 'hsl' })).toBe('body { color: hsla(0, 0%, 100%, 1); }');
  });

  it('Input color must be converted to hex', function () {
    expect(transform('body { color: hsl(0, 0%, 100%); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff; }');
    expect(transform('body { color: hsl(0, 0%, 100%); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { color: #ffffff; }');
    expect(transform('body { color: hsla(0, 0%, 100%, 1); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff; }');
    expect(transform('body { color: hsla(0, 0%, 100%, 1); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff; }');
    expect(transform('body { --red: hsla(0, 100%, 50%, 1); }', { outputColorFormat: 'hex' })).toBe('body { --red: #ff0000; }');
    expect(transform('body { $blue: hsl(240, 100%, 50%); }', { outputColorFormat: 'hex' })).toBe('body { $blue: #0000ff; }');
  });

  it('Input color must be converted to hexa', function () {
    expect(transform('body { color: hsla(0, 0%, 100%, 0.5); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff80; }');
    expect(transform('body { color: hsla(0, 0%, 100%, .5); }', { outputColorFormat: 'hex' })).toBe('body { color: #ffffff80; }');
    expect(transform('body { color: hsla(0, 0%, 100%, 0.5); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { color: #ffffff80; }');
  });

  it('Input color must be converted to rgb', function () {
    expect(transform('body { color: hsl(0, 0%, 100%); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgb(255, 255, 255); }');
  });

  it('Input color must be converted to rgba', function () {
    expect(transform('body { color: hsla(0, 0%, 100%, 0.5); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgba(255, 255, 255, 0.5); }');
    expect(transform('body { color: hsl(0, 0%, 100%); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { color: rgba(255, 255, 255, 1); }');
    expect(transform('body { color: hsla(0, 0%, 100%, 0.5); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { color: rgba(255, 255, 255, 0.5); }');
  });

  it('Input color with modern color function notation must be converted to hsl(a)', function () {
    expect(transform('body { color: hsl(0 0% 100%); }', { outputColorFormat: 'hsl', alwaysAlpha: true })).toBe('body { color: hsl(0 0% 100% / 1); }');
  });

  it('Input color with modern color function notation must be converted to rgb(a)', function () {
    expect(transform('body { color: hsl(0  0%  100%); }', { outputColorFormat: 'rgb' })).toBe('body { color: rgb(255 255 255); }');
    expect(transform('body { background-color: hsl(0 0% 100% / 0); }', { outputColorFormat: 'rgb' })).toBe('body { background-color: rgb(255 255 255 / 0); }');
    expect(transform('body { background-color: hsl(0 0% 100% / 0.5); }', { outputColorFormat: 'rgb' })).toBe('body { background-color: rgb(255 255 255 / 0.5); }');
    expect(transform('body { background-color: hsl(0 0% 100% / 0.5); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { background-color: rgb(255 255 255 / 0.5); }');
    expect(transform('body { color: hsl(0  0%  100%); }', { outputColorFormat: 'rgb', alwaysAlpha: true })).toBe('body { color: rgb(255 255 255 / 1); }');
  });

  it('Input color with modern color function notation must be converted to hex(a)', function () {
    expect(transform('body { background-color: hsl(0  0%  100%); }', { outputColorFormat: 'hex' })).toBe('body { background-color: #ffffff; }');
    expect(transform('body { background-color: hsl(0  0%  100% / 1); }', { outputColorFormat: 'hex' })).toBe('body { background-color: #ffffff; }');
    expect(transform('body { background-color: hsl(0  0%  100% / 1); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { background-color: #ffffff; }');
    expect(transform('body { background-color: hsl(0  0%  100% / 0.5); }', { outputColorFormat: 'hex' })).toBe('body { background-color: #ffffff80; }');
    expect(transform('body { background-color: hsl(0  0%  100% / 0.5); }', { outputColorFormat: 'hex', alwaysAlpha: true })).toBe('body { background-color: #ffffff80; }');
    expect(transform('body { background-color: hsl(0  0%  100% / 0); }', { outputColorFormat: 'hex' })).toBe('body { background-color: #ffffff00; }');
  });

  it('All input colors must be correct converted to hsl(a)', function () {
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
          hsl(56 69% 57%) 70%,
          green 100%,
        );
      }`,
        { outputColorFormat: 'hsl' }
      )
    ).toBe(
      `ul {
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
          green 100%,
        );
      }`,
        { outputColorFormat: 'hsl', alwaysAlpha: true }
      )
    ).toBe(
      `ul {
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
      }`
    );
  });
});

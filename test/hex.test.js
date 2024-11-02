import postcss from 'postcss';
import plugin from '../index.js';
import { describe, it, expect } from 'vitest';

describe('postcss-color-converter for hex colors', function () {
  const tests = [
    {
      name: 'Input color should not be converted',
      source: 'body { color: #ffffff; }',
      expected: 'body { color: #ffffff; }',
      options: { outputColorFormat: 'hex' },
    },
    {
      name: 'Input color should not be converted',
      source: 'body { color: #fff; }',
      expected: 'body { color: #fff; }',
      options: { outputColorFormat: 'hex' },
    },
    {
      name: 'Input color should not be converted',
      source: 'body { color: #fff5; }',
      expected: 'body { color: #fff5; }',
      options: { outputColorFormat: 'hex' },
    },
    {
      name: 'Input color should not be converted',
      source: 'body { color: #FFF5; }',
      expected: 'body { color: #FFF5; }',
      options: { outputColorFormat: 'hex' },
    },
    {
      name: 'Input color should not be converted',
      source: 'body { color: #FfFc; }',
      expected: 'body { color: #FfFc; }',
      options: { outputColorFormat: 'hex' },
    },
    {
      name: 'Input color should not be converted',
      source: 'body { color: #ccccccff; }',
      expected: 'body { color: #ccccccff; }',
      options: { outputColorFormat: 'hex' },
    },
    {
      name: 'Input color should not be converted',
      source: 'body { color: #ccccccff; }',
      expected: 'body { color: #ccccccff; }',
      options: { outputColorFormat: 'hex', alwaysAlpha: true },
    },
    {
      name: 'Input color should not be converted',
      source: 'body { color: #cccccc22; }',
      expected: 'body { color: #cccccc22; }',
      options: { outputColorFormat: 'hex', alwaysAlpha: true },
    },
    {
      name: 'Input color must be converted to rgb',
      source: 'body { color: #ffffff; }',
      expected: 'body { color: rgb(255, 255, 255); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgb',
      source: 'body { color: #FFFFFF; }',
      expected: 'body { color: rgb(255, 255, 255); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgb',
      source: 'body { color: #555; }',
      expected: 'body { color: rgb(85, 85, 85); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgb',
      source: 'body { color: #FFF; }',
      expected: 'body { color: rgb(255, 255, 255); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgb',
      source: 'body { color: lighten(black, 50%); }',
      expected: 'body { color: lighten(rgb(0, 0, 0), 50%); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #fff45780; }',
      expected: 'body { color: rgba(255, 244, 87, 0.5); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #fff45780; }',
      expected: 'body { color: rgba(255, 244, 87, 0.5); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #fff45799; }',
      expected: 'body { color: rgba(255, 244, 87, 0.6); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #c4d9; }',
      expected: 'body { color: rgba(204, 68, 221, 0.6); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #ecdaf5a2; }',
      expected: 'body { color: rgba(236, 218, 245, 0.64); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #ecdaf555; }',
      expected: 'body { color: rgba(236, 218, 245, 0.33); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #ecdaf556; }',
      expected: 'body { color: rgba(236, 218, 245, 0.34); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #ef51; }',
      expected: 'body { color: rgba(238, 255, 85, 0.07); }',
      options: { outputColorFormat: 'rgb' },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #ef5; }',
      expected: 'body { color: rgba(238, 255, 85, 1); }',
      options: { outputColorFormat: 'rgb', alwaysAlpha: true },
    },
    {
      name: 'Input color must be converted to rgba',
      source: 'body { color: #ffffff; }',
      expected: 'body { color: rgba(255, 255, 255, 1); }',
      options: { outputColorFormat: 'rgb', alwaysAlpha: true },
    },
    {
      name: 'Input color must be converted to hsl',
      source: 'body { color: #ef5; }',
      expected: 'body { color: hsl(66, 100%, 67%); }',
      options: { outputColorFormat: 'hsl' },
    },
    {
      name: 'Input color must be converted to hsl',
      source: 'body { color: #c95959; }',
      expected: 'body { color: hsl(0, 51%, 57%); }',
      options: { outputColorFormat: 'hsl' },
    },
    {
      name: 'Input color must be converted to hsla',
      source: 'body { color: #ef51; }',
      expected: 'body { color: hsla(66, 100%, 67%, 0.07); }',
      options: { outputColorFormat: 'hsl' },
    },
    {
      name: 'Input color must be converted to hsla',
      source: 'body { color: #57C1FFa2; }',
      expected: 'body { color: hsla(202, 100%, 67%, 0.64); }',
      options: { outputColorFormat: 'hsl' },
    },
    {
      name: 'Input color must be converted to hsla',
      source: 'body { color: #57C1FF; }',
      expected: 'body { color: hsla(202, 100%, 67%, 1); }',
      options: { outputColorFormat: 'hsl', alwaysAlpha: true },
    },
    {
      name: 'Input color must be converted to hsla',
      source: 'body { color: #fff; }',
      expected: 'body { color: hsla(0, 0%, 100%, 1); }',
      options: { outputColorFormat: 'hsl', alwaysAlpha: true },
    },
    {
      name: 'All input colors must be correct converted to hex(a)',
      source: `ul {
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
      expected: `ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          #cd56ab80 20%,
          #44bbdd 30%,
          #44bcdd80 40%,
          #ddd346 50%,
          #ddd34680 60%,
          #008000 100%,
        );
      }`,
      options: { outputColorFormat: 'hex' },
    },
  ];

  tests.forEach(({ name, source, expected, options }) => {
    it(name, function () {
      const actual = postcss([plugin(options)]).process(source).css;

      expect(actual).toBe(expected);
    });
  });
});

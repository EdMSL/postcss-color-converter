import postcss from 'postcss';
import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('Various complete test', function () {
  const tests = [
    {
      name: 'All input colors must be correct converted to hex(a)',
      source: `
      $red: red;
      ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 0%,
          hsla(56, 69%, 57%, 0.5) 50%,
          green 100%,
        );
      }
      `,
      expected: `
      $red: #ff0000;
      ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 0%,
          #ddd34680 50%,
          #008000 100%,
        );
      }
      `,
      options: { outputColorFormat: 'hex' },
    },
    {
      name: 'All input colors except with special values must be correct converted to hsl(a)',
      source: `div {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          #cd56ab80 20%,
          rgb(68, 187, calc(30 +20)) 30%,
          rgba(68, 188, 221, var(--alpha)) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          green 100%,
          hsl(var(--hue), 10%, 10%),
          hsl(calc(10 + 20), 10%, 10%),
        );
      }`,
      expected: `div {
        background: linear-gradient(
          to bottom,
          hsl(317, 54%, 57%) 10%,
          hsla(317, 54%, 57%, 0.5) 20%,
          rgb(68, 187, calc(30 +20)) 30%,
          rgba(68, 188, 221, var(--alpha)) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          hsl(120, 100%, 25%) 100%,
          hsl(var(--hue), 10%, 10%),
          hsl(calc(10 + 20), 10%, 10%),
        );
      }`,
      options: { outputColorFormat: 'hsl' },
    },
  ];

  tests.forEach(({ name, source, expected, options }) => {
    it(name, function () {
      const actual = postcss([plugin(options)]).process(source).css;

      expect(actual).toBe(expected);
    });
  });
});

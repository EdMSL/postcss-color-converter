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

  it('url() function must be ignored', function () {
    assert.equal(transform(
      `
      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMjAgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU0LjEgKDc2NDkwKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uLWFycm93LXVwPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTMuNDE0MjEzNTYsMC41ODU3ODY0MzggQzIuNjMzMTY0OTgsLTAuMTk1MjYyMTQ2IDEuMzY2ODM1MDIsLTAuMTk1MjYyMTQ2IDAuNTg1Nzg2NDM4LDAuNTg1Nzg2NDM4IEMtMC4xOTUyNjIxNDYsMS4zNjY4MzUwMiAtMC4xOTUyNjIxNDYsMi42MzMxNjQ5OCAwLjU4NTc4NjQzOCwzLjQxNDIxMzU2IEw4LjU4NTc4NjQ0LDExLjQxNDIxMzYgQzkuMzY2ODM1MDIsMTIuMTk1MjYyMSAxMC42MzMxNjUsMTIuMTk1MjYyMSAxMS40MTQyMTM2LDExLjQxNDIxMzYgTDE5LjQxNDIxMzYsMy40MTQyMTM1NiBDMjAuMTk1MjYyMSwyLjYzMzE2NDk4IDIwLjE5NTI2MjEsMS4zNjY4MzUwMiAxOS40MTQyMTM2LDAuNTg1Nzg2NDM4IEMxOC42MzMxNjUsLTAuMTk1MjYyMTQ2IDE3LjM2NjgzNSwtMC4xOTUyNjIxNDYgMTYuNTg1Nzg2NCwwLjU4NTc4NjQzOCBMMTAsNy4xNzE1NzI4OCBMMy40MTQyMTM1NiwwLjU4NTc4NjQzOCBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iTGFuZGluZ3BhZ2UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSIwMS4wMi1MYW5kaW5ncGFnZS1GQVEtRGVza3RvcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNjUuMDAwMDAwLCAtNTk3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iMDQtQ29udGVudC1UeXAtMDIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIzNi4wMDAwMDAsIDQ4Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJGcmFnZS0wMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDgwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJpY29uLWFycm93LXVwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5MjkuMDAwMDAwLCAzNS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSJTaGFwZSIgZmlsbD0iIzI4MzczQyIgZmlsbC1ydWxlPSJub256ZXJvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC4wMDAwMDAsIDYuMDAwMDAwKSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC0xMC4wMDAwMDAsIC02LjAwMDAwMCkgIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat;
      `,
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), `
      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMjAgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU0LjEgKDc2NDkwKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uLWFycm93LXVwPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTMuNDE0MjEzNTYsMC41ODU3ODY0MzggQzIuNjMzMTY0OTgsLTAuMTk1MjYyMTQ2IDEuMzY2ODM1MDIsLTAuMTk1MjYyMTQ2IDAuNTg1Nzg2NDM4LDAuNTg1Nzg2NDM4IEMtMC4xOTUyNjIxNDYsMS4zNjY4MzUwMiAtMC4xOTUyNjIxNDYsMi42MzMxNjQ5OCAwLjU4NTc4NjQzOCwzLjQxNDIxMzU2IEw4LjU4NTc4NjQ0LDExLjQxNDIxMzYgQzkuMzY2ODM1MDIsMTIuMTk1MjYyMSAxMC42MzMxNjUsMTIuMTk1MjYyMSAxMS40MTQyMTM2LDExLjQxNDIxMzYgTDE5LjQxNDIxMzYsMy40MTQyMTM1NiBDMjAuMTk1MjYyMSwyLjYzMzE2NDk4IDIwLjE5NTI2MjEsMS4zNjY4MzUwMiAxOS40MTQyMTM2LDAuNTg1Nzg2NDM4IEMxOC42MzMxNjUsLTAuMTk1MjYyMTQ2IDE3LjM2NjgzNSwtMC4xOTUyNjIxNDYgMTYuNTg1Nzg2NCwwLjU4NTc4NjQzOCBMMTAsNy4xNzE1NzI4OCBMMy40MTQyMTM1NiwwLjU4NTc4NjQzOCBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iTGFuZGluZ3BhZ2UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSIwMS4wMi1MYW5kaW5ncGFnZS1GQVEtRGVza3RvcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNjUuMDAwMDAwLCAtNTk3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iMDQtQ29udGVudC1UeXAtMDIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIzNi4wMDAwMDAsIDQ4Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJGcmFnZS0wMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDgwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJpY29uLWFycm93LXVwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5MjkuMDAwMDAwLCAzNS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSJTaGFwZSIgZmlsbD0iIzI4MzczQyIgZmlsbC1ydWxlPSJub256ZXJvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC4wMDAwMDAsIDYuMDAwMDAwKSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC0xMC4wMDAwMDAsIC02LjAwMDAwMCkgIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat;
      `);
  });
});

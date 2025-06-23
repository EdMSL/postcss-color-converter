const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('Various complete test', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input keyword colors must be correct converted', function () {
    assert.equal(transform(
      'body { color: blue; }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #0000ff; }');
    assert.equal(transform(
      'body { color: blue; }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #0000ff; }');
    assert.equal(transform(
      'body { color: green; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(0, 128, 0); }');
    assert.equal(transform(
      'body { color: green; }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(0, 128, 0, 1); }');
    assert.equal(transform(
      'body { color: fuchsia; }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(300, 100%, 50%); }');
    assert.equal(transform(
      'body { color: fuchsia; }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: hsla(300, 100%, 50%, 1); }');
    assert.equal(transform(
      'body { color: tomato; }',
      { outputColorFormat: 'oklch' },
    ), 'body { color: oklch(0.69622 0.19552 32.32128); }');
    assert.equal(transform(
      'body { color: tomato; }',
      { outputColorFormat: 'oklch', alwaysAlpha: true },
    ), 'body { color: oklch(0.69622 0.19552 32.32128 / 1); }');
    assert.equal(transform(
      'body { color: red; }',
      { outputColorFormat: 'oklab' },
    ), 'body { color: oklab(0.62796 0.22486 0.12585); }');
    assert.equal(transform(
      'body { color: red; }',
      { outputColorFormat: 'oklab', alwaysAlpha: true },
    ), 'body { color: oklab(0.62796 0.22486 0.12585 / 1); }');
  });

  it('Invalid keyword color should not be converted', function () {
    assert.equal(transform(
      'body { color: greens; }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: greens; }');
    assert.equal(transform(
      'body { color: aquablue; }',
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), 'body { color: aquablue; }');
  });

  it('All input colors must be correct converted to hex(a)', function () {
    assert.equal(transform(
      `
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
      { outputColorFormat: 'hex' },
    ), `
      $red: #ff0000;
      ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 0%,
          #ddd34680 50%,
          #008000 100%,
        );
      }
      `);
  });

  it('All input colors must be correct converted to rgba', function () {
    assert.equal(transform(
      `
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
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), `
      $red: rgba(255, 0, 0, 1);
      ul {
        background: linear-gradient(
          to bottom,
          rgba(205, 86, 171, 1) 0%,
          rgba(221, 211, 70, 0.5) 50%,
          rgba(0, 128, 0, 1) 100%,
        );
      }
      `);
  });

  it('All input colors must be correct converted to hsl(a)', function () {
    assert.equal(transform(
      `
      padding: 10px;
      color: red;
      $abc: #ffffff80;
      box-shadow: 0 0 0 red, 0 0 0 rgba(255, 0, 0, 0.5);
      -webkit-box-shadow: 0 0 0 red, 0 0 0 rgba(255, 0, 0, 0.5);
      border: 1px dotted saturate(#c69, 20%);
      `,
      { outputColorFormat: 'hsl' },
    ), `
      padding: 10px;
      color: hsl(0, 100%, 50%);
      $abc: hsla(0, 0%, 100%, 0.5);
      box-shadow: 0 0 0 hsl(0, 100%, 50%), 0 0 0 hsla(0, 100%, 50%, 0.5);
      -webkit-box-shadow: 0 0 0 hsl(0, 100%, 50%), 0 0 0 hsla(0, 100%, 50%, 0.5);
      border: 1px dotted saturate(hsl(330, 50%, 60%), 20%);
      `);
  });

  it('All input colors must be correct converted to oklch', function () {
    assert.equal(transform(
      `
      padding: 10px;
      color: yellow;
      $abc: #0ca1b4;
      box-shadow: 0 0 0 white, 0 0 0 rgba(255, 0, 0, 0.5);
      -webkit-box-shadow: 0 0 0 MediumSpringGreen, 0 0 0 rgba(255 248 220 / 0.5);
      border: 1px dotted saturate(#c695, 20%);
      `,
      { outputColorFormat: 'oklch' },
    ), `
      padding: 10px;
      color: oklch(0.96798 0.21101 109.76944);
      $abc: oklch(0.65008 0.11069 209.70572);
      box-shadow: 0 0 0 oklch(1 0 0), 0 0 0 oklch(0.62796 0.25768 29.23494 / 0.5);
      -webkit-box-shadow: 0 0 0 oklch(0.86681 0.20675 156.90475), 0 0 0 oklch(0.9773 0.03726 95.43669 / 0.5);
      border: 1px dotted saturate(oklch(0.64537 0.14134 350.50702 / 0.33), 20%);
      `);
  });

  it('Only keyword colors must be correct converted to rgb', function () {
    assert.equal(transform(
      `
      color: red;
      outline-color: hsla(0, 0%, 100%, 0.5);
      box-shadow: 0 0 0 red, 0 0 0 rgba(255, 0, 0, 0.5);
      border-color: #fcc;
      border-right-color: lighten(black, 50%);
      background-color: oklch(1 0 0 / 0.5);
      `,
      { outputColorFormat: 'rgb', ignore: ['hex', 'rgb', 'hsl', 'oklch'] },
    ), `
      color: rgb(255, 0, 0);
      outline-color: hsla(0, 0%, 100%, 0.5);
      box-shadow: 0 0 0 rgb(255, 0, 0), 0 0 0 rgba(255, 0, 0, 0.5);
      border-color: #fcc;
      border-right-color: lighten(rgb(0, 0, 0), 50%);
      background-color: oklch(1 0 0 / 0.5);
      `);
  });

  it('All colors except hex must be correct converted to hsla', function () {
    assert.equal(transform(
      `
      color: red;
      outline-color: hsl(0, 0%, 100%);
      box-shadow: 0 0 0 red, 0 0 0 rgba(255, 0, 0, 0.5);
      border-color: #fcc;
      fill: rgb(140, 90, 20);
      `,
      { outputColorFormat: 'hsl', ignore: ['hex'], alwaysAlpha: true },
    ), `
      color: hsla(0, 100%, 50%, 1);
      outline-color: hsla(0, 0%, 100%, 1);
      box-shadow: 0 0 0 hsla(0, 100%, 50%, 1), 0 0 0 hsla(0, 100%, 50%, 0.5);
      border-color: #fcc;
      fill: hsla(35, 75%, 31%, 1);
      `);
  });

  it('All colors except keyword must be correct converted to hex(a)', function () {
    assert.equal(transform(
      `
      color: red;
      outline-color: hsl(0, 0%, 100%);
      box-shadow: 0 0 0 red, 0 0 0 rgba(255, 0, 0, 0.5);
      border-color: #fcc;
      fill: rgb(140, 90, 20);
      text-decoration-color: rgba(0, 0, 0);
      `,
      { outputColorFormat: 'hex', ignore: ['keyword'], alwaysAlpha: true },
    ), `
      color: red;
      outline-color: #ffffff;
      box-shadow: 0 0 0 red, 0 0 0 #ff000080;
      border-color: #fcc;
      fill: #8c5a14;
      text-decoration-color: #000000;
      `);
  });

  it('Only hex and keyword colors must be converted to oklch', function () {
    assert.equal(transform(
      `
      color: DeepPink;
      outline-color: hsla(0, 0%, 100%, 0.35);
      box-shadow: 0 0 0 gold, 0 0 0 GoldenRod, 0 0 0 rgb(218, 165, 102);
      border-color: #fc2c;
      fill: rgb(140, 90, 20);
      text-decoration-color: #fcfeff00;
      background: oklch(0.456 0.12 100.59);
      `,
      { outputColorFormat: 'oklch', ignore: ['hsl', 'rgb', 'oklch'], alwaysAlpha: true },
    ), `
      color: oklch(0.65493 0.26134 356.94458 / 1);
      outline-color: hsla(0, 0%, 100%, 0.35);
      box-shadow: 0 0 0 oklch(0.88677 0.18219 95.33195 / 1), 0 0 0 oklch(0.75157 0.14694 83.98793 / 1), 0 0 0 rgb(218, 165, 102);
      border-color: oklch(0.86587 0.17084 89.57408 / 0.8);
      fill: rgb(140, 90, 20);
      text-decoration-color: oklch(0.9958 0.00251 228.87852 / 0);
      background: oklch(0.456 0.12 100.59);
      `);
  });

  it('All input colors except with spec values must be correct converted to rgb(a)', function () {
    assert.equal(transform(
      `p {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          rgb(68, 187, 221) 30%,
          hsl(56, var(--green), 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'rgb' },
    ), `p {
        background: linear-gradient(
          to bottom,
          rgb(205, 86, 171) 10%,
          rgb(68, 187, 221) 30%,
          hsl(56, var(--green), 57%) 50%,
          rgba(221, 211, 70, 0.5) 60%,
          rgb(0, 128, 0) 100%,
        );
      }`);
  });

  it('All input colors except with special values must be correct converted to hsl(a)', function () {
    assert.equal(transform(
      `div {
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
      { outputColorFormat: 'hsl' },
    ), `div {
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
      }`);
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

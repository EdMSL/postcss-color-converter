const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('Various complete test', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

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

  it('Only keyword colors must be correct converted to rgb', function () {
    assert.equal(transform(
      `
      color: red;
      outline-color: hsla(0, 0%, 100%, 0.5);
      box-shadow: 0 0 0 red, 0 0 0 rgba(255, 0, 0, 0.5);
      border-color: #fcc;
      border-right-color: lighten(black, 50%);
      `,
      { outputColorFormat: 'rgb', ignore: ['hex', 'rgb', 'hsl'] },
    ), `
      color: rgb(255, 0, 0);
      outline-color: hsla(0, 0%, 100%, 0.5);
      box-shadow: 0 0 0 rgb(255, 0, 0), 0 0 0 rgba(255, 0, 0, 0.5);
      border-color: #fcc;
      border-right-color: lighten(rgb(0, 0, 0), 50%);
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
        );
      }`);
  });
});

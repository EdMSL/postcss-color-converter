const { assert } = require('chai');

const {
  getRGBColorStr,
  getRGBAColorStr,
  getHSLColorStr,
  getHSLAColorStr,
} = require('../src/utils');

/* eslint-disable prefer-arrow-callback, func-names */

describe('convertion of hex colors', function () {
  it('Color must be correct converted to rgb', function () {
    assert.equal(getRGBColorStr('#ffffff', 'hex'), 'rgb(255, 255, 255)');
    assert.equal(getRGBColorStr('#CC55AA', 'hex'), 'rgb(204, 85, 170)');
    assert.equal(getRGBColorStr('#37b', 'hex'), 'rgb(51, 119, 187)');
  });
  it('Color must be correct converted to rgba', function () {
    assert.equal(getRGBAColorStr('#ffffff', 'hex'), 'rgba(255, 255, 255, 1)');
    assert.equal(getRGBAColorStr('#60cd567e', 'hex'), 'rgba(96, 205, 86, 0.49)');
    assert.equal(getRGBAColorStr('#93b6', 'hex'), 'rgba(153, 51, 187, 0.4)');
  });
  it('Color must be correct converted to hsl', function () {
    assert.equal(getHSLColorStr('#ffffff', 'hex'), 'hsl(0, 0%, 100%)');
    assert.equal(getHSLColorStr('#CC55AA', 'hex'), 'hsl(317, 54%, 57%)');
    assert.equal(getHSLColorStr('#3b6', 'hex'), 'hsl(143, 57%, 47%)');
  });
  it('Color must be correct converted to hsla', function () {
    assert.equal(getHSLAColorStr('#ffffff', 'hex'), 'hsla(0, 0%, 100%, 1)');
    assert.equal(getHSLAColorStr('#db9a39a1', 'hex'), 'hsla(36, 69%, 54%, 0.63)');
    assert.equal(getHSLAColorStr('#7b3d', 'hex'), 'hsla(90, 57%, 47%, 0.87)');
  });
});

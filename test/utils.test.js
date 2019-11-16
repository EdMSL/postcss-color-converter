const { assert } = require('chai');

const {
  getRGBColorStr,
  getHSLColorStr,
  getHSLAColorStr,
  getHEXColorStr,
} = require('../src/utils');

/* eslint-disable prefer-arrow-callback, func-names */

describe('Test convert functions', function () {
  it('Color must be correct converted to rgb', function () {
    assert.equal(getRGBColorStr('hex', '#ffffff'), 'rgb(255, 255, 255)');
    assert.equal(getRGBColorStr('hex', '#CC55AA'), 'rgb(204, 85, 170)');
    assert.equal(getRGBColorStr('hex', '#37b'), 'rgb(51, 119, 187)');
    assert.equal(getRGBColorStr('hsl', [0, 0, 100]), 'rgb(255, 255, 255)');
  });

  it('Color must be correct converted to rgba', function () {
    assert.equal(getRGBColorStr('hex', '#ffffff', 'ff'), 'rgba(255, 255, 255, 1)');
    assert.equal(getRGBColorStr('hex', '#60cd56', '7e'), 'rgba(96, 205, 86, 0.49)');
    assert.equal(getRGBColorStr('hex', '#93b', '66'), 'rgba(153, 51, 187, 0.4)');
    assert.equal(getRGBColorStr('hsl', [0, 0, 100], 0.4), 'rgba(255, 255, 255, 0.4)');
  });

  it('Color must be correct converted to hsl', function () {
    assert.equal(getHSLColorStr('#ffffff', 'hex'), 'hsl(0, 0%, 100%)');
    assert.equal(getHSLColorStr('#CC55AA', 'hex'), 'hsl(317, 54%, 57%)');
    assert.equal(getHSLColorStr('#3b6', 'hex'), 'hsl(143, 57%, 47%)');
    assert.equal(getHSLColorStr([255, 255, 255], 'rgb'), 'hsl(0, 0%, 100%)');
  });

  it('Color must be correct converted to hsla', function () {
    assert.equal(getHSLAColorStr('#ffffff', 'ff', 'hex'), 'hsla(0, 0%, 100%, 1)');
    assert.equal(getHSLAColorStr('#db9a39', 'a1', 'hex'), 'hsla(36, 69%, 54%, 0.63)');
    assert.equal(getHSLAColorStr('#7b3', 'dd', 'hex'), 'hsla(90, 57%, 47%, 0.87)');
    assert.equal(getHSLAColorStr([255, 255, 255], 0.85, 'rgb'), 'hsla(0, 0%, 100%, 0.85)');
  });

  it('Color must be correct converted to hex', function () {
    assert.equal(getHEXColorStr('rgb', [255, 255, 255]), '#ffffff');
    assert.equal(getHEXColorStr('rgb', [55, 55, 55]), '#373737');
    assert.equal(getHEXColorStr('hsl', [317, 54, 57]), '#cd56ab');
  });

  it('Color must be correct converted to hexa', function () {
    assert.equal(getHEXColorStr('rgb', [255, 255, 255], 0.5), '#ffffff80');
    assert.equal(getHEXColorStr('hsl', [36, 69, 54], 0.63), '#db9a39a1');
  });
});

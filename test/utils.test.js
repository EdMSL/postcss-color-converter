const { assert } = require('chai');

const {
  getRGBColorStr,
  getRGBAColorStr,
  getHSLColorStr,
  getHSLAColorStr,
  getHEXColorStr,
  getHEXAColorStr,
} = require('../src/utils');

/* eslint-disable prefer-arrow-callback, func-names */

describe('convertion of hex colors', function () {
  it('Color must be correct converted to rgb', function () {
    assert.equal(getRGBColorStr('#ffffff', 'hex'), 'rgb(255, 255, 255)');
    assert.equal(getRGBColorStr('#CC55AA', 'hex'), 'rgb(204, 85, 170)');
    assert.equal(getRGBColorStr('#37b', 'hex'), 'rgb(51, 119, 187)');
    assert.equal(getRGBColorStr('#37bc', 'hex'), 'rgb(51, 119, 187)');
  });
  it('Color must be correct converted to rgba', function () {
    assert.equal(getRGBAColorStr('#ffffff', 'ff', 'hex'), 'rgba(255, 255, 255, 1)');
    assert.equal(getRGBAColorStr('#60cd56', '7e', 'hex'), 'rgba(96, 205, 86, 0.49)');
    assert.equal(getRGBAColorStr('#93b', '66', 'hex'), 'rgba(153, 51, 187, 0.4)');
  });
  it('Color must be correct converted to hsl', function () {
    assert.equal(getHSLColorStr('#ffffff', 'hex'), 'hsl(0, 0%, 100%)');
    assert.equal(getHSLColorStr('#ffffff44', 'hex'), 'hsl(0, 0%, 100%)');
    assert.equal(getHSLColorStr('#CC55AA', 'hex'), 'hsl(317, 54%, 57%)');
    assert.equal(getHSLColorStr('#cd56ab', 'hex'), 'hsl(317, 54%, 57%)');
    assert.equal(getHSLColorStr('#3b6', 'hex'), 'hsl(143, 57%, 47%)');
  });
  it('Color must be correct converted to hsla', function () {
    assert.equal(getHSLAColorStr('#ffffff', 'ff', 'hex'), 'hsla(0, 0%, 100%, 1)');
    assert.equal(getHSLAColorStr('#db9a39', 'a1', 'hex'), 'hsla(36, 69%, 54%, 0.63)');
    assert.equal(getHSLAColorStr('#7b3', 'dd', 'hex'), 'hsla(90, 57%, 47%, 0.87)');
  });
  it('Color must be correct converted to hex', function () {
    assert.equal(getHEXColorStr([255, 255, 255], 'rgb'), '#ffffff');
    assert.equal(getHEXColorStr([55, 55, 55], 'rgb'), '#373737');
    assert.equal(getHEXColorStr([317, 54, 57], 'hsl'), '#cd56ab');
  });
  it('Color must be correct converted to hexa', function () {
    assert.equal(getHEXAColorStr([255, 255, 255], 0.5, 'rgb'), '#ffffff80');
    assert.equal(getHEXAColorStr([36, 69, 54], 0.63, 'hsl'), '#db9a39a1');
  });
});

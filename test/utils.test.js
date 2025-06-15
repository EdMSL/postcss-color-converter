const { assert } = require('chai');
const colorFn = require('colorizr');


const {
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
  convertHEXAlphaValueToNumber,
  convertNumberAlphaValueToHEX,
} = require('../src/utils');
const { getFormattedString, getAlpha } = require('../src/converts');
const { hex } = require('color-convert');

/* eslint-disable prefer-arrow-callback, func-names */

describe('Test convert functions', function () {
  // it('Color must be correct converted to rgb', function () {
  //   assert.equal(getRGBColorStr('hex', '#ffffff'), 'rgb(255, 255, 255)');
  //   assert.equal(getRGBColorStr('hex', '#CC55AA'), 'rgb(204, 85, 170)');
  //   assert.equal(getRGBColorStr('hex', '#37b'), 'rgb(51, 119, 187)');
  //   assert.equal(getRGBColorStr('hsl', [0, 0, 100]), 'rgb(255, 255, 255)');
  //   assert.equal(getRGBColorStr('keyword', 'red'), 'rgb(255, 0, 0)');
  // });

  // it('Color must be correct converted to rgba', function () {
  //   assert.equal(getRGBColorStr('hex', '#ffffff', convertHEXAlphaValueToNumber('ff')), 'rgba(255, 255, 255, 1)');
  //   assert.equal(getRGBColorStr('hex', '#60cd56', convertHEXAlphaValueToNumber('7e')), 'rgba(96, 205, 86, 0.49)');
  //   assert.equal(getRGBColorStr('hex', '#93b', convertHEXAlphaValueToNumber('66')), 'rgba(153, 51, 187, 0.4)');
  //   assert.equal(getRGBColorStr('hsl', [0, 0, 100], 0.4), 'rgba(255, 255, 255, 0.4)');
  //   assert.equal(getRGBColorStr('keyword', 'red', 1), 'rgba(255, 0, 0, 1)');
  // });

  // it('Color must be correct converted to hsl', function () {
  //   assert.equal(getHSLColorStr('hex', '#ffffff'), 'hsl(0, 0%, 100%)');
  //   assert.equal(getHSLColorStr('hex', '#CC55AA'), 'hsl(317, 54%, 57%)');
  //   assert.equal(getHSLColorStr('hex', '#3b6'), 'hsl(143, 57%, 47%)');
  //   assert.equal(getHSLColorStr('rgb', [255, 255, 255]), 'hsl(0, 0%, 100%)');
  //   assert.equal(getHSLColorStr('keyword', 'red'), 'hsl(0, 100%, 50%)');
  // });

  // it('Color must be correct converted to hsla', function () {
  //   assert.equal(getHSLColorStr('hex', '#ffffff', convertHEXAlphaValueToNumber('ff')), 'hsla(0, 0%, 100%, 1)');
  //   assert.equal(getHSLColorStr('hex', '#db9a39', convertHEXAlphaValueToNumber('a1')), 'hsla(36, 69%, 54%, 0.63)');
  //   assert.equal(getHSLColorStr('hex', '#7b3', convertHEXAlphaValueToNumber('dd')), 'hsla(90, 57%, 47%, 0.87)');
  //   assert.equal(getHSLColorStr('rgb', [255, 255, 255], 0.85), 'hsla(0, 0%, 100%, 0.85)');
  //   assert.equal(getHSLColorStr('keyword', 'red', 1), 'hsla(0, 100%, 50%, 1)');
  // });

  // it('Color must be correct converted to hex', function () {
  //   assert.equal(getHEXColorStr('rgb', [255, 255, 255]), '#ffffff');
  //   assert.equal(getHEXColorStr('rgb', [55, 55, 55]), '#373737');
  //   assert.equal(getHEXColorStr('hsl', [317, 54, 57]), '#cd56ab');
  //   assert.equal(getHEXColorStr('keyword', 'red'), '#ff0000');
  // });

  // it('Color must be correct converted to hexa', function () {
  //   assert.equal(getHEXColorStr('rgb', [255, 255, 255], 0.5), '#ffffff80');
  //   assert.equal(getHEXColorStr('hsl', [36, 69, 54], 0.63), '#db9a39a1');
  //   assert.equal(getHEXColorStr('keyword', 'red', 1), '#ff0000ff');
  // });

  // it('Color must be correct converted to hexa', function () {
  //   assert.equal(convertNumberAlphaValueToHEX(0), '00');
  //   assert.equal(convertNumberAlphaValueToHEX(0.5), '80');
  //   assert.equal(convertNumberAlphaValueToHEX(1), 'ff');
  // });`

  // it('Color must be correct converted to hexa', function () {
    // assert.deepEqual(colorFn.parseCSS('#57C1FF', 'hsl'), {h: 202, s: 100, l: 67});
    // assert.deepEqual(colorFn.rgb2hsl([255, 255, 255, 0]), {h: 0, s: 0, l: 100, alpha: 1});
    // assert.equal(colorFn.convert('rgb(255 255 255 / 1)', 'hsl'), 'hsla(0 0% 100% / 1)');
    // assert.equal(colorFn.formatHex('#fff9'), '#ffffff99');
    // assert.equal(colorFn.extractAlphaFromHex(colorFn.formatHex('#fff9')), 0.6);
    // assert.deepEqual(colorFn.parseCSS(colorFn.convert('#f00', 'rgb'), 'rgb'), {r: 255, g: 0, b: 0});
    // assert.equal(getFormattedString('hsl', {h: 56, s: 69, l: 57}, 0.5, true), 'hsla(56 69% 57% / 0.5)');
    // assert.equal(getFormattedString('hsl', {h: 56, s: 69, l: 57}, 0, true), 'hsl(56 69% 57%)');
    // assert.equal(getFormattedString('hsl', {h: 56, s: 69, l: 57}), 'hsl(56, 69%, 57%)');
    // assert.equal(getFormattedString('hsl', {h: 56, s: 69, l: 57}, 0.5), 'hsla(56, 69%, 57%, 0.5)');
    // assert.equal(getFormattedString('rgb', {r: 255, g: 0, b: 0}, 0.5), 'rgba(255, 0, 0, 0.5)');
    // assert.equal(getFormattedString('rgb', {r: 255, g: 0, b: 0}, 0.5, true), 'rgba(255 0 0 / 0.5)');
    // assert.equal(getFormattedString('hex', '#ff0000', 0.5), '#ff000080');
    // assert.equal(getFormattedString('hex', '#ff0000', 0, true), '#ff0000');
    // assert.equal(getFormattedString('hex', '#ef5', 0, true), '#ff0000');
    // assert.equal(getAlpha('#ef5', 'hex', true), 1);
    // assert.equal(getAlpha('#fff9', 'hex'), 0.6);
    // assert.equal(test('#fffc'), false);
    // assert.equal(test('rgb(255 255 255)'), true);
    // assert.equal(getFormattedString('keyword', 'rgb', 'red'), 'rgb(255 0 0)');
    // assert.equal(getFormattedString('hex', 'rgb', '#fff'), 'rgb(255 255 255)');
    // assert.equal(getFormattedString('hex', 'rgb', '#fff', true), 'rgba(255 255 255 / 1)');
    // assert.equal(getFormattedString('hex', 'rgb', '#ffffff', true), 'rgba(255 255 255 / 1)');
    // assert.equal(getFormattedString('hex', 'rgb', '#ffffff'), 'rgb(255 255 255)');
    // assert.equal(getFormattedString('hex', 'rgb', '#ffff'), 'rgba(255 255 255 / 1)');
    // assert.equal(getFormattedString('hex', 'rgb', '#ffffffff'), 'rgba(255 255 255 / 1)');
    // assert.equal(getFormattedString('rgb', 'hex', [255, 255, 255]), '#ffffff');
    // assert.equal(getFormattedString('rgb', 'hex', [255, 255, 255, 1]), '#ffffff');
    // assert.equal(getFormattedString('rgb', 'hex', [255, 255, 255, 1], true), '#ffffff');
    // assert.equal(getFormattedString('rgb', 'hex', [255, 255, 255, 0.5], ), '#ffffff80');
  // });
});

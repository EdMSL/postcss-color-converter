const { assert } = require('chai');
const convert = require('color-convert').default;
const {converter, formatRgb, formatCss} = require('culori');

let oklch = converter('oklch');

const {
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
  convertHEXAlphaValueToNumber,
  convertNumberAlphaValueToHEX,
} = require('../src/utils');

/* eslint-disable prefer-arrow-callback, func-names */

// describe('Test convert functions', function () {
//   it('Color must be correct converted to rgb', function () {
//     assert.equal(getRGBColorStr('hex', '#ffffff'), 'rgb(255, 255, 255)');
//     assert.equal(getRGBColorStr('hex', '#CC55AA'), 'rgb(204, 85, 170)');
//     assert.equal(getRGBColorStr('hex', '#37b'), 'rgb(51, 119, 187)');
//     assert.equal(getRGBColorStr('hsl', [0, 0, 100]), 'rgb(255, 255, 255)');
//     assert.equal(getRGBColorStr('keyword', 'red'), 'rgb(255, 0, 0)');
//   });

//   it('Color must be correct converted to rgba', function () {
//     assert.equal(getRGBColorStr('hex', '#ffffff', convertHEXAlphaValueToNumber('ff')), 'rgba(255, 255, 255, 1)');
//     assert.equal(getRGBColorStr('hex', '#60cd56', convertHEXAlphaValueToNumber('7e')), 'rgba(96, 205, 86, 0.49)');
//     assert.equal(getRGBColorStr('hex', '#93b', convertHEXAlphaValueToNumber('66')), 'rgba(153, 51, 187, 0.4)');
//     assert.equal(getRGBColorStr('hsl', [0, 0, 100], 0.4), 'rgba(255, 255, 255, 0.4)');
//     assert.equal(getRGBColorStr('keyword', 'red', 1), 'rgba(255, 0, 0, 1)');
//   });

//   it('Color must be correct converted to hsl', function () {
//     assert.equal(getHSLColorStr('hex', '#ffffff'), 'hsl(0, 0%, 100%)');
//     assert.equal(getHSLColorStr('hex', '#CC55AA'), 'hsl(317, 54%, 57%)');
//     assert.equal(getHSLColorStr('hex', '#3b6'), 'hsl(143, 57%, 47%)');
//     assert.equal(getHSLColorStr('rgb', [255, 255, 255]), 'hsl(0, 0%, 100%)');
//     assert.equal(getHSLColorStr('keyword', 'red'), 'hsl(0, 100%, 50%)');
//   });

//   it('Color must be correct converted to hsla', function () {
//     assert.equal(getHSLColorStr('hex', '#ffffff', convertHEXAlphaValueToNumber('ff')), 'hsla(0, 0%, 100%, 1)');
//     assert.equal(getHSLColorStr('hex', '#db9a39', convertHEXAlphaValueToNumber('a1')), 'hsla(36, 69%, 54%, 0.63)');
//     assert.equal(getHSLColorStr('hex', '#7b3', convertHEXAlphaValueToNumber('dd')), 'hsla(90, 57%, 47%, 0.87)');
//     assert.equal(getHSLColorStr('rgb', [255, 255, 255], 0.85), 'hsla(0, 0%, 100%, 0.85)');
//     assert.equal(getHSLColorStr('keyword', 'red', 1), 'hsla(0, 100%, 50%, 1)');
//   });

//   it('Color must be correct converted to hex', function () {
//     assert.equal(getHEXColorStr('rgb', [255, 255, 255]), '#ffffff');
//     assert.equal(getHEXColorStr('rgb', [55, 55, 55]), '#373737');
//     assert.equal(getHEXColorStr('hsl', [317, 54, 57]), '#cd56ab');
//     assert.equal(getHEXColorStr('keyword', 'red'), '#ff0000');
//   });

//   it('Color must be correct converted to hexa', function () {
//     assert.equal(getHEXColorStr('rgb', [255, 255, 255], 0.5), '#ffffff80');
//     assert.equal(getHEXColorStr('hsl', [36, 69, 54], 0.63), '#db9a39a1');
//     assert.equal(getHEXColorStr('keyword', 'red', 1), '#ff0000ff');
//   });

//   it('Color must be correct converted to hexa', function () {
//     assert.equal(convertNumberAlphaValueToHEX(0), '00');
//     assert.equal(convertNumberAlphaValueToHEX(0.5), '80');
//     assert.equal(convertNumberAlphaValueToHEX(1), 'ff');
//   });
// });

describe('Test color-convert functions', function () {
  it('Color must be correct converted to hex', function () {
    assert.equal(convert.rgb.hex(0, 0, 0), '000000');
    // assert.equal(convert.rgb.oklch(205, 25, 55), '0.5445 0.2075 20.77');
    // assert.equal(convert.oklch.rgb(54, 21, 21), '205, 25, 55'); //плохая точность
    // assert.equal(formatRgb('oklch(0.5445 0.2075 20.77)'), 'rgb(205, 25, 55)');
    // assert.equal(formatCss(oklch('rgb(205, 25, 55)', 'oklch'), ), 'oklch(0.5445 0.2075 20.77)');
    assert.equal(formatCss(oklch('#cce200', 'oklch'), ), 'oklch(0.8662 0.1991 116.65)');
  });
});

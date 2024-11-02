import { describe, it, expect } from 'vitest';
import { getRGBColorStr, getHSLColorStr, getHEXColorStr, convertHEXAlphaValueToNumber, convertNumberAlphaValueToHEX } from '../src/utils.js';

describe('Test convert functions', function () {
  it('Color must be correct converted to rgb', function () {
    expect(getRGBColorStr('hex', '#ffffff')).toBe('rgb(255, 255, 255)');
    expect(getRGBColorStr('hex', '#CC55AA')).toBe('rgb(204, 85, 170)');
    expect(getRGBColorStr('hex', '#37b')).toBe('rgb(51, 119, 187)');
    expect(getRGBColorStr('hsl', [0, 0, 100])).toBe('rgb(255, 255, 255)');
    expect(getRGBColorStr('keyword', 'red')).toBe('rgb(255, 0, 0)');
  });

  it('Color must be correct converted to rgba', function () {
    expect(getRGBColorStr('hex', '#ffffff', convertHEXAlphaValueToNumber('ff'))).toBe('rgba(255, 255, 255, 1)');
    expect(getRGBColorStr('hex', '#60cd56', convertHEXAlphaValueToNumber('7e'))).toBe('rgba(96, 205, 86, 0.49)');
    expect(getRGBColorStr('hex', '#93b', convertHEXAlphaValueToNumber('66'))).toBe('rgba(153, 51, 187, 0.4)');
    expect(getRGBColorStr('hsl', [0, 0, 100], 0.4)).toBe('rgba(255, 255, 255, 0.4)');
    expect(getRGBColorStr('keyword', 'red', 1)).toBe('rgba(255, 0, 0, 1)');
  });

  it('Color must be correct converted to hsl', function () {
    expect(getHSLColorStr('hex', '#ffffff')).toBe('hsl(0, 0%, 100%)');
    expect(getHSLColorStr('hex', '#CC55AA')).toBe('hsl(317, 54%, 57%)');
    expect(getHSLColorStr('hex', '#3b6')).toBe('hsl(143, 57%, 47%)');
    expect(getHSLColorStr('rgb', [255, 255, 255])).toBe('hsl(0, 0%, 100%)');
    expect(getHSLColorStr('keyword', 'red')).toBe('hsl(0, 100%, 50%)');
  });

  it('Color must be correct converted to hsla', function () {
    expect(getHSLColorStr('hex', '#ffffff', convertHEXAlphaValueToNumber('ff'))).toBe('hsla(0, 0%, 100%, 1)');
    expect(getHSLColorStr('hex', '#db9a39', convertHEXAlphaValueToNumber('a1'))).toBe('hsla(36, 69%, 54%, 0.63)');
    expect(getHSLColorStr('hex', '#7b3', convertHEXAlphaValueToNumber('dd'))).toBe('hsla(90, 57%, 47%, 0.87)');
    expect(getHSLColorStr('rgb', [255, 255, 255], 0.85)).toBe('hsla(0, 0%, 100%, 0.85)');
    expect(getHSLColorStr('keyword', 'red', 1)).toBe('hsla(0, 100%, 50%, 1)');
  });

  it('Color must be correct converted to hex', function () {
    expect(getHEXColorStr('rgb', [255, 255, 255])).toBe('#ffffff');
    expect(getHEXColorStr('rgb', [55, 55, 55])).toBe('#373737');
    expect(getHEXColorStr('hsl', [317, 54, 57])).toBe('#cd56ab');
    expect(getHEXColorStr('keyword', 'red')).toBe('#ff0000');
  });

  it('Color must be correct converted to hexa', function () {
    expect(getHEXColorStr('rgb', [255, 255, 255], 0.5)).toBe('#ffffff80');
    expect(getHEXColorStr('hsl', [36, 69, 54], 0.63)).toBe('#db9a39a1');
    expect(getHEXColorStr('keyword', 'red', 1)).toBe('#ff0000ff');
  });

  it('Color must be correct converted to hexa', function () {
    expect(convertNumberAlphaValueToHEX(0)).toBe('00');
    expect(convertNumberAlphaValueToHEX(0.5)).toBe('80');
    expect(convertNumberAlphaValueToHEX(1)).toBe('ff');
  });
});

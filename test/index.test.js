const postcss = require('postcss')
const { assert } = require('chai')

const plugin = require('../index')

/* eslint-disable prefer-arrow-callback */

describe('postcss-color-converter', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css
  }

  it('Input color should not be converted', function () {
    assert.equal(transform(
      'body: { color: #ffffff; }',
      {}
    ), 'body: { color: #ffffff; }')
  })

  it('Input color must be converted to rgb', function () {
    assert.equal(transform(
      'body: { color: #ffffff; }',
      { outputColorFormat: 'rgb' }
    ), 'body: { color: rgb(255, 255, 255); }')
  })
})

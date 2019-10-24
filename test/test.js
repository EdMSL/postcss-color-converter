const postcss = require('postcss')

const plugin = require('../index')

function transform (source, opts) {
  return postcss([plugin(opts)]).process(source).css
}

transform('body: { color: #ffffff; }', {outputColorFormat: 'rgb'})

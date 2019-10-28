const postcss = require('postcss')
const valueParser = require('postcss-values-parser')
const convert = require('color-convert')

const regexpHEX = /#([a-f\d]{3}|[a-f\d]{6})/i

const defaultOptions = {
  syntax: '',
  outputColorFormat: ''
}

module.exports = postcss.plugin('postcss-color-converter', (opts = {}) => {
  let currentOptions = {
    ...defaultOptions,
    ...opts
  }

  return style => {
    style.walkDecls(decl => {
      let value = decl.value

      if (value) {
        let newColor = valueParser.parse(value)

        if (regexpHEX.test(value) && currentOptions.outputColorFormat === 'rgb') {
          newColor.walk(node => {
            if (node.type === 'word') {
              node.value = `rgb(${ convert.hex.rgb(node.value).join(', ') })`
            }
          })
        }
        decl.value = newColor.toString()
      }
    })
  }
})

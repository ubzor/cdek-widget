import postcssPrefixSelector from 'postcss-prefix-selector'

export default {
    plugins: [
        ...(process.env.NODE_ENV === 'production'
            ? [
                  postcssPrefixSelector({
                      prefix: '.cdek-widget', // adjust the prefix as needed
                      transform: function (prefix, selector, prefixedSelector) {
                          // Optionally avoid prefixing keyframes or root selectors
                          if (selector.startsWith('@')) return selector
                          return prefixedSelector
                      }
                  })
              ]
            : [])
    ]
}

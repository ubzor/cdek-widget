import postcssPrefixSelector from 'postcss-prefix-selector'
import postcssSafeImportant from 'postcss-safe-important'

export default {
    plugins: [
        ...(process.env.NODE_ENV === 'production'
            ? [
                  postcssSafeImportant(),
                  postcssPrefixSelector({
                      prefix: '.cdek-widget', // adjust the prefix as needed
                      transform: function (_prefix, selector, prefixedSelector) {
                          // Optionally avoid prefixing keyframes or root selectors
                          if (
                              selector.startsWith('@') ||
                              selector.includes(':root') ||
                              selector.includes(':host')
                          )
                              return selector
                          return prefixedSelector
                      }
                  })
              ]
            : [])
    ]
}

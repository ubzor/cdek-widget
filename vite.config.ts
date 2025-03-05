import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
    return {
        server: {
            fs: {
                allow: [process.cwd()]
            }
        },
        build: {
            lib: {
                entry: 'src/lib/index.ts',
                fileName: 'index',
                cssFileName: 'style',
                formats: ['es']
            }
        },
        resolve: {
            alias: {
                '@': '/src',
                '#': '/types'
            }
        },
        plugins: [
            ...(mode === 'development' ? [sveltekit()] : []),
            ...(mode === 'production' ? [svelte()] : []),
            tailwindcss()
        ]
    }
})

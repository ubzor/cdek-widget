import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig(({ mode }) => {
    return {
        build: {
            lib: {
                entry: 'src/lib/index.ts',
                fileName: 'index',
                cssFileName: 'style',
                formats: ['es']
            }
        },
        plugins: [
            ...(mode === 'development' ? [sveltekit()] : []),
            ...(mode === 'production' ? [svelte()] : [])
        ]
    }
})

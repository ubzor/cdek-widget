import type { ComponentProps } from 'svelte'

import type YandexMap from '@/lib/YandexMap.svelte'

declare global {
    interface Window {
        ymaps3: typeof ymaps3
    }
}

declare module 'cdek-widget' {
    export class CdekWidget {
        widget: ComponentProps<YandexMap>

        constructor(target: HTMLElement)
    }
}

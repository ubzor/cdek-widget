import type { ComponentProps } from 'svelte'

import type YandexMap from '@/lib/YandexMap.svelte'

export declare class CdekWidget {
    widget: ComponentProps<YandexMap>

    constructor(target: HTMLElement)
}

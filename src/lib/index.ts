import { mount } from 'svelte'

import YandexMap from '@/components/YandexMap.svelte'

export class CdekWidget {
    #widget: YandexMap

    constructor(target: HTMLElement, yandexMapsApiKey: string) {
        this.#widget = mount(YandexMap, {
            target,
            props: { yandexMapsApiKey }
        })
    }
}

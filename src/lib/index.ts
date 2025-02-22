import { mount, type ComponentProps } from 'svelte'

import YandexMap from './YandexMap.svelte'

export class CdekWidget {
    widget: ComponentProps<YandexMap> & { $set?: any; $on?: any }

    constructor(target: HTMLElement) {
        this.widget = mount(YandexMap, {
            target
        })
    }
}

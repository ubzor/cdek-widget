import { mount } from 'svelte'

import App from '@/components/App.svelte'

export class CdekWidget {
    #widget: App

    constructor(target: HTMLElement, apiUrl: string, yandexMapsApiKey: string) {
        this.#widget = mount(App, {
            target,
            props: { apiUrl, yandexMapsApiKey }
        })
    }
}

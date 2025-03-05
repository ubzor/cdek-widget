import { mount } from 'svelte'

import App from '@/components/App.svelte'

import type { CdekWidgetOptions } from '#/index.d'

export class CdekWidget {
    #widget: App

    constructor(target: HTMLElement, options: CdekWidgetOptions) {
        this.#widget = mount(App, {
            target,
            props: options
        })
    }

    clearSelection = () => {
        // TODO: ...
    }
}

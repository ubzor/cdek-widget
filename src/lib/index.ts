import { mount } from 'svelte'

import App from '@/components/App.svelte'

import type { CdekWidget as CdekWidgetInterface, CdekWidgetOptions } from '#/index.d'

// Объявление класса CdekWidget, реализующего интерфейс CdekWidgetInterface.
// Этот класс служит оболочкой для Svelte-компонента App,
// предоставляя API для взаимодействия с виджетом.
export class CdekWidget implements CdekWidgetInterface {
    // Приватное поле, содержащее экземпляр компонента App.
    #widget: App

    // Конструктор принимает HTML-элемент (target) для монтирования компонента
    // и объект с опциями (options) для настройки виджета.
    // Здесь используется функция mount из Svelte для инициализации компонента.
    constructor(target: HTMLElement, options: CdekWidgetOptions) {
        this.#widget = mount(App, {
            target,
            props: options
        })
    }

    // Метод для выбора пункта доставки по уникальному коду.
    // Делегирует вызов методу компонента, отвечающему за выбор пункта доставки.
    selectDeliveryPointByCode = (code: string) => {
        this.#widget.selectDeliveryPointByCode(code)
    }

    // Метод для очистки текущего выбора пункта доставки.
    clearSelection = () => {
        this.#widget.clearSelection()
    }

    // Метод для прокрутки к разделу, относящемуся к конкретному городу.
    // Передаёт управление Svelte-компоненту, который выполняет анимацию прокрутки.
    scrollToCity = (city: string) => {
        this.#widget.scrollToCity(city)
    }
}

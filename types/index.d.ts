import type { CdekDeliveryPoint } from '#/api.d'

export interface CdekWidgetOptions {
    apiUrl: string
    yandexMapsApiKey: string

    onReady?: () => void
    onDeliveryPointSelected?: (deliveryPoint: CdekDeliveryPoint) => void
}

export declare class CdekWidget {
    constructor(target: HTMLElement, options: CdekWidgetOptions)

    scrollToCity(city: string): void
    selectDeliveryPointByCode(code: string): void
    clearSelection: () => void
}

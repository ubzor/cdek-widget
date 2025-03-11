// TODO: получать типы из cdek-backend

import { CdekDeliveryPointType } from '#/api'

export interface CdekFilters {
    isPickupPoint: boolean
    isPostamat: boolean

    hasCash: boolean
    hasCard: boolean

    hasFittingRoom: boolean
}

export interface CdekCoordinates {
    deliveryPointId: string
    latitude: number
    longitude: number
}

export interface CdekDeliveryPoint {
    uuid: string
    code: string

    location: {
        city: string
        address: string

        latitude?: number
        longitude?: number
    }

    type: keyof typeof CdekDeliveryPointType
    workTime: string
    addressComment?: string

    haveCash?: boolean
    haveCashless?: boolean
    isDressingRoom?: boolean
}

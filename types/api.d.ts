// TODO: получать типы из cdek-backend

import { CdekDeliveryPointType } from '#/api'

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
    }
    type: keyof typeof CdekDeliveryPointType
    workTime: string
}

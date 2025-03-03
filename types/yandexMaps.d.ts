import type { Feature } from '@yandex/ymaps3-clusterer'

export interface ExpandedFeature extends Feature {
    deliveryPointId: string
}

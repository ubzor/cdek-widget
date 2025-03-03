<script lang="ts">
    import CdekApi from '@/components/CdekApi.svelte'
    import YandexMap from '@/components/YandexMap.svelte'
    import YandexMapLoader from '@/components/YandexMapLoader.svelte'

    import type { LngLatBounds } from 'ymaps3'
    import type { CdekCoordinates } from '#/api'

    let { apiUrl, yandexMapsApiKey }: { apiUrl: string; yandexMapsApiKey: string } =
        $props()

    let cdekApiComponent: CdekApi
    let yandexMapComponent: YandexMap

    let deliveryPoints: CdekCoordinates[] = $state([])
    let bounds: LngLatBounds | undefined = $state()
</script>

<div>
    <CdekApi
        bind:this={cdekApiComponent}
        bind:deliveryPoints
        {apiUrl}
        {bounds}
        onAddedDeliveryPoints={yandexMapComponent.addDeliveryPoints}
        onRemovedDeliveryPoints={yandexMapComponent.removeDeliveryPoints}
    />
    <YandexMapLoader {yandexMapsApiKey} onLoaded={yandexMapComponent.initMap} />
    <YandexMap
        bind:this={yandexMapComponent}
        bind:bounds
        {deliveryPoints}
        onGetDeliveryPointsInBoundingBox={cdekApiComponent.getDeliveryPointsInBoundingBox}
    />
</div>

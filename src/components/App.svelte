<script lang="ts">
    import CdekApi from '@/components/CdekApi.svelte'
    import YandexMap from '@/components/YandexMap.svelte'
    import YandexMapLoader from '@/components/YandexMapLoader.svelte'

    import type { CdekCoordinates } from '#/api'

    let { apiUrl, yandexMapsApiKey }: { apiUrl: string; yandexMapsApiKey: string } =
        $props()

    let cdekApiComponent: CdekApi
    let yandexMapComponent: YandexMap

    let deliveryPoints: CdekCoordinates[] = []
</script>

<div>
    <CdekApi bind:this={cdekApiComponent} {apiUrl} />
    <YandexMapLoader {yandexMapsApiKey} onLoaded={() => yandexMapComponent.initMap()} />
    <YandexMap
        bind:this={yandexMapComponent}
        {deliveryPoints}
        onGetDeliveryPointsInBoundingBox={cdekApiComponent.getDeliveryPointsInBoundingBox}
    />
</div>

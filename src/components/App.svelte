<script lang="ts">
    import CdekApi from '@/components/CdekApi.svelte'
    import YandexMap from '@/components/YandexMap.svelte'
    import YandexMapLoader from '@/components/YandexMapLoader.svelte'

    import type { CdekCoordinates } from '#/api'

    let { apiUrl, yandexMapsApiKey }: { apiUrl: string; yandexMapsApiKey: string } =
        $props()

    let cdekApiComponent: CdekApi
    let yandexMapComponent: YandexMap

    let yandexMapsApiIsLoaded = $state(false)
    let deliveryPoints: CdekCoordinates[] = $state([])
    let bounds: number[][] | undefined = $state()
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
    <YandexMapLoader
        {yandexMapsApiKey}
        onLoaded={() => {
            yandexMapsApiIsLoaded = true
        }}
    />
    {#if yandexMapsApiIsLoaded}
        <YandexMap
            bind:this={yandexMapComponent}
            bind:bounds
            onGetDeliveryPointsInBoundingBox={cdekApiComponent.getDeliveryPointsInBoundingBox}
        />
    {/if}
</div>

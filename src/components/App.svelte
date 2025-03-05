<script lang="ts">
    import CdekApiCoordinates from '@/components/CdekApiCoordinates.svelte'
    import CdekApiDeliveryPoints from '@/components/CdekApiDeliveryPoints.svelte'
    import YandexMap from '@/components/YandexMap.svelte'
    import YandexMapLoader from '@/components/YandexMapLoader.svelte'
    import Sidebar from '@/components/Sidebar.svelte'
    import DeliveryPoint from './DeliveryPoint.svelte'
    import DeliveryPointsList from './DeliveryPointsList.svelte'

    import type { CdekCoordinates, CdekDeliveryPoint } from '#/api.d'
    import type { CdekWidgetOptions } from '#/index.d'

    import '@/app.css'

    let {
        apiUrl,
        yandexMapsApiKey,
        onReady,
        onDeliveryPointSelected
    }: CdekWidgetOptions = $props()

    let cdekApiCoordinatesComponent: CdekApiCoordinates | undefined = $state()
    let cdekApiDeliveryPointsComponent: CdekApiDeliveryPoints | undefined = $state()
    let yandexMapComponent: YandexMap | undefined = $state()

    let yandexMapsApiIsLoaded = $state(false)
    let deliveryPointsCoordinates: CdekCoordinates[] = $state([])
    let bounds: number[][] | undefined = $state()

    let sidebarIsOpened = $state(false)
    let activeDeliveryPoint: CdekDeliveryPoint | undefined = $state()
    let selectedDeliveryPointId: string | undefined = $state()

    export const clearSelection = () => {
        selectedDeliveryPointId = undefined
    }
</script>

<div class="w-[100%] h-[400px]">
    <CdekApiCoordinates
        bind:this={cdekApiCoordinatesComponent}
        bind:deliveryPointsCoordinates
        {apiUrl}
        {bounds}
        onAddedDeliveryPoints={yandexMapComponent?.addDeliveryPoints}
        onRemovedDeliveryPoints={yandexMapComponent?.removeDeliveryPoints}
    />
    <CdekApiDeliveryPoints
        bind:this={cdekApiDeliveryPointsComponent}
        {apiUrl}
        onGetDeliveryPointById={(deliveryPoint) => {
            activeDeliveryPoint = deliveryPoint
            sidebarIsOpened = true
        }}
    />
    <YandexMapLoader
        {yandexMapsApiKey}
        onLoaded={() => {
            yandexMapsApiIsLoaded = true
        }}
    />
    {#if yandexMapsApiIsLoaded}
        <div class="flex w-full h-full">
            <YandexMap
                bind:this={yandexMapComponent}
                bind:bounds
                onGetDeliveryPointsInBoundingBox={cdekApiCoordinatesComponent?.getDeliveryPointsInBoundingBox}
                onGetDeliveryPointById={cdekApiDeliveryPointsComponent?.getDeliveryPointById}
                {onReady}
            />
            {#if sidebarIsOpened}
                <Sidebar>
                    {#if activeDeliveryPoint}
                        <DeliveryPoint
                            bind:activeDeliveryPoint
                            bind:selectedDeliveryPointId
                            bind:sidebarIsOpened
                            {onDeliveryPointSelected}
                        />
                    {:else if false}
                        <DeliveryPointsList />
                    {/if}
                </Sidebar>
            {/if}
        </div>
    {/if}
</div>

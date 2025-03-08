<script lang="ts">
    import CdekApiCoordinates from '@/components/CdekApiCoordinates.svelte'
    import CdekApiDeliveryPoints from '@/components/CdekApiDeliveryPoints.svelte'
    import Geocoder from '@/components/Geocoder.svelte'

    import YandexMap from '@/components/YandexMap.svelte'
    import YandexMapLoader from '@/components/YandexMapLoader.svelte'

    import FiltersIcon from '@/components/FiltersIcon.svelte'
    import ListIcon from '@/components/ListIcon.svelte'
    import Loading from '@/components/Loading.svelte'

    import Sidebar from '@/components/Sidebar.svelte'
    import DeliveryPoint from '@/components/DeliveryPoint.svelte'
    import DeliveryPointsList from '@/components/DeliveryPointsList.svelte'

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
    let geocoderComponent: Geocoder | undefined = $state()
    let deliveryPointsListComponent: DeliveryPointsList | undefined = $state()

    let yandexMapsApiIsLoaded = $state(false)
    let bounds: number[][] | undefined = $state()
    let deliveryPointsCoordinates: CdekCoordinates[] = $state([])

    let deliveryPointsListComponentIsVisible = $state(false)
    let deliveryPointsInList: CdekDeliveryPoint[] = $state([])

    let deliveryPointComponentIsVisible = $state(false)
    let activeDeliveryPoint: CdekDeliveryPoint | undefined = $state()
    let selectedDeliveryPointId: string | undefined = $state()

    export const selectDeliveryPointByCode = async (code: string) => {
        await cdekApiDeliveryPointsComponent?.getDeliveryPointByCode(code)

        activeDeliveryPoint?.location.latitude &&
            activeDeliveryPoint?.location.longitude &&
            yandexMapComponent?.setMapCenterAndZoom(
                [
                    activeDeliveryPoint.location.latitude,
                    activeDeliveryPoint.location.longitude
                ],
                17
            )

        deliveryPointComponentIsVisible = true
        selectedDeliveryPointId = activeDeliveryPoint?.uuid

        onDeliveryPointSelected &&
            activeDeliveryPoint &&
            onDeliveryPointSelected(activeDeliveryPoint)
    }

    export const clearSelection = () => {
        deliveryPointComponentIsVisible = false
        selectedDeliveryPointId = undefined
    }

    export const scrollToCity = (city: string) => {
        geocoderComponent?.getCityBoundingBox(city)
    }
</script>

<div class="w-[100%] h-[400px]">
    <YandexMapLoader bind:yandexMapsApiIsLoaded {yandexMapsApiKey} />

    {#if yandexMapsApiIsLoaded}
        <CdekApiCoordinates
            bind:this={cdekApiCoordinatesComponent}
            bind:deliveryPointsCoordinates
            {apiUrl}
            {bounds}
            onAddedDeliveryPoints={yandexMapComponent?.addDeliveryPoints}
            onRemovedDeliveryPoints={(removed) => {
                deliveryPointsInList = []
                yandexMapComponent?.removeDeliveryPoints(removed)
                deliveryPointsListComponent &&
                    cdekApiDeliveryPointsComponent?.loadMoreDeliveryPoints()
            }}
        />

        <CdekApiDeliveryPoints
            bind:this={cdekApiDeliveryPointsComponent}
            bind:activeDeliveryPoint
            bind:deliveryPointComponentIsVisible
            bind:deliveryPointsInList
            bind:deliveryPointsCoordinates
            {apiUrl}
        />

        <Geocoder
            bind:this={geocoderComponent}
            {yandexMapsApiKey}
            onGetCityBoundingBox={(bounds) => {
                yandexMapComponent?.setMapBounds(bounds)
            }}
        />

        <div class="flex w-full h-full">
            <div class="h-full w-full min-w-0 shrink-1 overflow-hidden relative">
                <YandexMap
                    bind:this={yandexMapComponent}
                    bind:bounds
                    onGetDeliveryPointsInBoundingBox={cdekApiCoordinatesComponent?.getDeliveryPointsInBoundingBox}
                    onGetDeliveryPointById={cdekApiDeliveryPointsComponent?.getDeliveryPointById}
                    {onReady}
                />

                <FiltersIcon />

                {#if !deliveryPointComponentIsVisible && !deliveryPointsListComponentIsVisible}
                    <ListIcon bind:deliveryPointsListComponentIsVisible />
                {/if}
            </div>
            {#if deliveryPointComponentIsVisible || deliveryPointsListComponentIsVisible}
                <Sidebar
                    bind:activeDeliveryPoint
                    bind:deliveryPointComponentIsVisible
                    bind:deliveryPointsListComponentIsVisible
                >
                    {#if activeDeliveryPoint}
                        <DeliveryPoint
                            bind:activeDeliveryPoint
                            bind:selectedDeliveryPointId
                            bind:deliveryPointComponentIsVisible
                            {onDeliveryPointSelected}
                        />
                    {:else if deliveryPointsListComponentIsVisible}
                        <DeliveryPointsList
                            bind:this={deliveryPointsListComponent}
                            bind:deliveryPointsCoordinates
                            bind:deliveryPointsInList
                            onLoadMore={cdekApiDeliveryPointsComponent.loadMoreDeliveryPoints}
                        />
                    {/if}
                </Sidebar>
            {/if}
        </div>
    {/if}
</div>

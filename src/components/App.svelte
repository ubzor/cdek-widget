<script lang="ts">
    import CdekApiCoordinates from '@/components/CdekApiCoordinates.svelte'
    import CdekApiDeliveryPoints from '@/components/CdekApiDeliveryPoints.svelte'
    import Geocoder from '@/components/Geocoder.svelte'

    import YandexMap from '@/components/YandexMap.svelte'
    import YandexMapLoader from '@/components/YandexMapLoader.svelte'

    import Sidebar from '@/components/Sidebar.svelte'
    import DeliveryPoint from '@/components/DeliveryPoint.svelte'
    import DeliveryPointsList from '@/components/DeliveryPointsList.svelte'
    import Filters from '@/components/Filters.svelte'
    import Loading from '@/components/Loading.svelte'

    import type { CdekCoordinates, CdekDeliveryPoint, CdekFilters } from '#/api.d'
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
    let deliveryPointComponentIsVisible = $state(false)
    let filtersComponentIsVisible = $state(false)

    let deliveryPointsInList: CdekDeliveryPoint[] = $state([])

    let activeDeliveryPoint: CdekDeliveryPoint | undefined = $state()
    let selectedDeliveryPointId: string | undefined = $state()

    let filters: CdekFilters = $state({
        isPickupPoint: true,
        isPostamat: true,
        hasCash: true,
        hasCard: true,
        hasFittingRoom: false
    })

    let cdekApiCoordinatesIsLoading = $state(false)

    export const selectDeliveryPointByCode = async (code: string) => {
        await cdekApiDeliveryPointsComponent?.getDeliveryPointByCode(code, true)

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
        deliveryPointsListComponentIsVisible = false
        filtersComponentIsVisible = false
        selectedDeliveryPointId = undefined
    }

    export const scrollToCity = (city: string) => {
        geocoderComponent?.getCityBoundingBox(city)
    }
</script>

<div class="cdek-widget">
    <YandexMapLoader bind:yandexMapsApiIsLoaded {yandexMapsApiKey} />

    {#if yandexMapsApiIsLoaded}
        <CdekApiCoordinates
            bind:this={cdekApiCoordinatesComponent}
            bind:deliveryPointsCoordinates
            bind:cdekApiCoordinatesIsLoading
            {apiUrl}
            {bounds}
            {filters}
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
            {filters}
            {apiUrl}
        />

        <Geocoder
            bind:this={geocoderComponent}
            {yandexMapsApiKey}
            onGetCityBoundingBox={(bounds) => {
                yandexMapComponent?.setMapBounds(bounds)
            }}
        />

        <div class="cdek-widget__map">
            <YandexMap
                bind:this={yandexMapComponent}
                bind:bounds
                bind:deliveryPointComponentIsVisible
                bind:deliveryPointsListComponentIsVisible
                bind:filtersComponentIsVisible
                onUpdateDeliveryPoints={cdekApiCoordinatesComponent?.getDeliveryPoints}
                onGetDeliveryPointById={cdekApiDeliveryPointsComponent?.getDeliveryPointById}
                {onReady}
            />
            {#if cdekApiCoordinatesIsLoading}
                <Loading />
            {/if}
        </div>

        {#if deliveryPointComponentIsVisible || deliveryPointsListComponentIsVisible || filtersComponentIsVisible}
            <Sidebar
                onClose={() => {
                    activeDeliveryPoint = undefined
                    deliveryPointComponentIsVisible = false
                    deliveryPointsListComponentIsVisible = false
                    filtersComponentIsVisible = false
                }}
            >
                {#if deliveryPointComponentIsVisible && activeDeliveryPoint}
                    <DeliveryPoint
                        {selectedDeliveryPointId}
                        {activeDeliveryPoint}
                        onSelectDeliveryPoint={async (deliveryPointId) => {
                            selectedDeliveryPointId = deliveryPointId
                            await cdekApiDeliveryPointsComponent?.getDeliveryPointById(
                                deliveryPointId,
                                true
                            )
                            activeDeliveryPoint &&
                                onDeliveryPointSelected &&
                                onDeliveryPointSelected(activeDeliveryPoint)
                        }}
                    />
                {:else if deliveryPointsListComponentIsVisible}
                    <DeliveryPointsList
                        bind:this={deliveryPointsListComponent}
                        bind:deliveryPointsCoordinates
                        bind:deliveryPointsInList
                        onLoadMore={cdekApiDeliveryPointsComponent.loadMoreDeliveryPoints}
                        onSetActiveDeliveryPoint={async (id) => {
                            cdekApiDeliveryPointsComponent?.getDeliveryPointById(id)

                            const deliveryPoint = deliveryPointsCoordinates.find(
                                ({ deliveryPointId }) => deliveryPointId === id
                            )
                            deliveryPoint &&
                                yandexMapComponent?.setMapCenterAndZoom(
                                    [deliveryPoint.latitude, deliveryPoint.longitude],
                                    17
                                )
                        }}
                    />
                {:else if filtersComponentIsVisible}
                    <Filters
                        bind:filters
                        onUpdateDeliveryPoints={cdekApiCoordinatesComponent?.getDeliveryPoints}
                    />
                {/if}
            </Sidebar>
        {/if}
    {/if}
</div>

<style lang="postcss">
    @import 'tailwindcss';

    /* TODO: понять как сделать nested-правила */
    /* TODO: нормально минифицировать стили */

    .cdek-widget {
        @apply flex w-full h-full border border-gray-300 rounded shadow overflow-hidden;
    }

    .cdek-widget__map {
        @apply h-full w-full min-w-0 shrink-1 overflow-hidden relative;
    }
</style>

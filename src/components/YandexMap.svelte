<script lang="ts">
    import { getBoundsForArrayOfCoordinates } from '@/utils/getBoundsForArrayOfCoordinates'

    import type { YMap, LngLatBounds, LngLat } from 'ymaps3'
    import type { YMapClusterer, IClusterMethod } from '@yandex/ymaps3-clusterer'
    import type { CdekCoordinates } from '#/api'
    import type { ExpandedFeature } from '#/yandexMaps'

    let {
        bounds = $bindable(),
        deliveryPoints,
        onGetDeliveryPointsInBoundingBox
    }: {
        bounds?: LngLatBounds
        deliveryPoints: CdekCoordinates[]
        onGetDeliveryPointsInBoundingBox: (bounds: LngLatBounds) => void
    } = $props()

    let mapContainer: HTMLDivElement
    let map: YMap
    let cluster: YMapClusterer
    let clusterByGrid: ({ gridSize }: { gridSize: number }) => IClusterMethod

    let count = $state(0)

    const getPoints = $derived(
        deliveryPoints.map(
            ({ deliveryPointId, latitude, longitude }, index): ExpandedFeature => ({
                type: 'Feature',
                id: index.toString(),
                deliveryPointId,
                geometry: { coordinates: [longitude, latitude], type: 'Point' },
                properties: {}
            })
        )
    )

    const marker = (feature: ExpandedFeature) => {
        const { YMapMarker } = window.ymaps3

        const markerContainerElement = document.createElement('div')
        markerContainerElement.classList.add('marker-container')

        // const markerText = document.createElement('div')
        // markerText.id = feature.id
        // markerText.classList.add('marker-text', 'hidden')
        // markerText.innerText = feature.deliveryPointId

        // markerContainerElement.onmouseover = () => {
        //     markerText.classList.replace('hidden', 'visible')
        // }

        // markerContainerElement.onmouseout = () => {
        //     markerText.classList.replace('visible', 'hidden')
        // }

        const markerElement = document.createElement('div')
        markerElement.classList.add('marker')

        const markerImage = document.createElement('img')
        markerImage.src = '/marker.svg'
        markerImage.classList.add('image')
        markerImage.width = 16
        markerImage.height = 16

        markerElement.appendChild(markerImage)

        // markerContainerElement.appendChild(markerText)
        markerContainerElement.appendChild(markerElement)

        return new YMapMarker(
            {
                coordinates: feature.geometry.coordinates
            },
            markerContainerElement
        )
    }

    const circle = (count: number) => {
        const circle = document.createElement('div')
        circle.classList.add('circle')
        circle.innerHTML = `
                        <div class="circle-content">
                            <span class="circle-text">${count}</span>
                        </div>
                    `
        return circle
    }

    const createCluster = (coordinates: LngLat, features: ExpandedFeature[]) => {
        const { YMapMarker } = window.ymaps3

        return new YMapMarker(
            {
                coordinates,
                onClick() {
                    const bounds = getBoundsForArrayOfCoordinates(
                        features.map(
                            (feature: ExpandedFeature) => feature.geometry.coordinates
                        )
                    )
                    map.update({
                        location: { bounds, easing: 'ease-in-out', duration: 2000 }
                    })
                }
            },
            circle(features.length).cloneNode(true) as HTMLElement
        )
    }

    export const initMap = async () => {
        await window.ymaps3.ready

        const { YMapClusterer, clusterByGrid: ymaps3clusterByGrid } =
            await window.ymaps3.import('@yandex/ymaps3-clusterer@0.0.1')

        clusterByGrid = ymaps3clusterByGrid

        // @ts-ignore
        cluster = new YMapClusterer({
            method: clusterByGrid({ gridSize: 64 }),
            features: getPoints,
            // @ts-ignore
            marker,
            // @ts-ignore
            cluster: createCluster
        })

        map = new window.ymaps3.YMap(
            mapContainer,
            {
                location: {
                    center: [37.588144, 55.733842],
                    zoom: 10
                }
            },
            [
                new window.ymaps3.YMapDefaultSchemeLayer({}),
                new window.ymaps3.YMapDefaultFeaturesLayer({}),
                new window.ymaps3.YMapListener({
                    layer: 'any',
                    onUpdate: async ({
                        location: { bounds: updatedBounds },
                        mapInAction
                    }) => {
                        if (!mapInAction) {
                            bounds = updatedBounds
                            onGetDeliveryPointsInBoundingBox(bounds)
                        }
                    }
                })
            ]
        )

        map.addChild(cluster)

        onGetDeliveryPointsInBoundingBox(map.bounds)
    }

    export const addDeliveryPoints = (deliveryPoints: CdekCoordinates[]) => {
        count += deliveryPoints.length
        console.log(
            `add ${deliveryPoints.length} delivery points to map, total: ${count}`
        )

        cluster.update({
            method: clusterByGrid({ gridSize: 64 }),
            features: getPoints,
            // @ts-ignore
            marker,
            // @ts-ignore
            cluster: createCluster
        })
    }

    export const removeDeliveryPoints = (deliveryPoints: CdekCoordinates[]) => {
        count -= deliveryPoints.length
        console.log(
            `remove ${deliveryPoints.length} delivery points from map, total: ${count}`
        )
    }

    export const setLocation = (location: string) => {
        console.log(`set location to ${location}`)
    }
</script>

<div bind:this={mapContainer} class="map"></div>

<style>
    .map {
        width: 100%;
        height: 400px;
    }
</style>

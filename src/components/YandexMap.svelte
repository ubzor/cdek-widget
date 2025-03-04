<script lang="ts">
    import { onMount } from 'svelte'

    import type { Map, ObjectManager } from 'yandex-maps'
    import type { CdekCoordinates } from '#/api'

    let {
        bounds = $bindable(),
        onGetDeliveryPointsInBoundingBox
    }: {
        bounds?: number[][]
        onGetDeliveryPointsInBoundingBox: (bounds: number[][]) => void
    } = $props()

    let mapContainer: HTMLDivElement
    let map: Map
    let objectManager: ObjectManager

    let count = $state(0)

    export const initMap = async () => {
        map = new window.ymaps.Map(mapContainer, {
            center: [55.733842, 37.588144],
            zoom: 10,
            controls: []
        })

        objectManager = new window.ymaps.ObjectManager({
            clusterize: true,
            geoObjectOpenBalloonOnClick: false
        })

        map.geoObjects.add(objectManager)

        map.events.add('actionend', (event) => {
            bounds = map.getBounds()
            onGetDeliveryPointsInBoundingBox(bounds)
        })

        onGetDeliveryPointsInBoundingBox(map.getBounds())
    }

    export const addDeliveryPoints = (deliveryPoints: object[]) => {
        objectManager.add(deliveryPoints)
    }

    export const removeDeliveryPoints = (deliveryPoints: string[]) => {
        objectManager.remove(deliveryPoints)
    }

    export const setLocation = (location: string) => {
        console.log(`set location to ${location}`)
    }

    onMount(() => {
        window.ymaps.ready(initMap)
    })
</script>

<div bind:this={mapContainer} class="map"></div>

<style>
    .map {
        width: 100%;
        height: 400px;
    }
</style>

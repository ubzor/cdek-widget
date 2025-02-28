<script lang="ts">
    import type { YMap, LngLatBounds } from 'ymaps3'
    import type { CdekCoordinates } from '#/api'

    let {
        deliveryPoints = [],
        onGetDeliveryPointsInBoundingBox
    }: {
        deliveryPoints: CdekCoordinates[]
        onGetDeliveryPointsInBoundingBox: (bounds: LngLatBounds) => void
    } = $props()

    let mapContainer: HTMLDivElement
    let map: YMap

    export const initMap = async () => {
        await window.ymaps3.ready

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
                new window.ymaps3.YMapListener({
                    layer: 'any',
                    onUpdate: async ({ location: { bounds }, mapInAction }) => {
                        if (!mapInAction) {
                            onGetDeliveryPointsInBoundingBox(bounds)
                        }
                    }
                })
            ]
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

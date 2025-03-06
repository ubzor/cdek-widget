<script lang="ts">
    import { onMount } from 'svelte'

    import type { Map, ObjectManager } from 'yandex-maps'

    import type { CdekWidgetOptions } from '#/index.d'

    let {
        bounds = $bindable(),
        onGetDeliveryPointsInBoundingBox,
        onGetDeliveryPointById,
        onReady
    }: {
        bounds?: number[][]
        onGetDeliveryPointsInBoundingBox: (bounds: number[][]) => void
        onGetDeliveryPointById?: (deliveryPointId: string) => void
        onReady: CdekWidgetOptions['onReady']
    } = $props()

    let mapContainer: HTMLDivElement
    let map: Map
    let objectManager: ObjectManager

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

        map.events.add('actionend', (_event) => {
            bounds = map.getBounds()
            onGetDeliveryPointsInBoundingBox(bounds)
        })

        map.geoObjects.events.add('click', async (event) => {
            const deliveryPointId = event.get('objectId')

            if (!deliveryPointId || deliveryPointId?.startsWith('__cluster__')) return

            map.setCenter(
                // @ts-ignore
                objectManager.objects.getById(deliveryPointId)?.geometry.coordinates
            )
            map.setZoom(17)

            onGetDeliveryPointById && onGetDeliveryPointById(deliveryPointId)
        })

        onGetDeliveryPointsInBoundingBox(map.getBounds())

        onReady && onReady()
    }

    export const addDeliveryPoints = (deliveryPoints: object[]) => {
        objectManager.add(deliveryPoints)
    }

    export const removeDeliveryPoints = (deliveryPoints: string[]) => {
        objectManager.remove(deliveryPoints)
    }

    export const setMapCenterAndZoom = (center: number[], zoom: number) => {
        map.setCenter(center)
        map.setZoom(zoom)
    }

    export const setMapBounds = (bounds: number[][]) => {
        map.setBounds(bounds)
    }

    onMount(() => {
        window.ymaps.ready(initMap)

        new ResizeObserver(() => {
            map?.container.fitToViewport()
        }).observe(mapContainer)
    })
</script>

<div bind:this={mapContainer} class="h-full w-full"></div>

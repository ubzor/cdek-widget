<script lang="ts">
    import { onMount } from 'svelte'

    import type { Map, ObjectManager, control } from 'yandex-maps'

    import type { CdekWidgetOptions } from '#/index.d'

    import filtersIcon from '@/images/filters-icon.svg?raw'
    import listIcon from '@/images/list-icon.svg?raw'

    let {
        bounds = $bindable(),
        deliveryPointComponentIsVisible = $bindable(),
        deliveryPointsListComponentIsVisible = $bindable(),
        filtersComponentIsVisible = $bindable(),
        onUpdateDeliveryPoints,
        onGetDeliveryPointById,
        onReady
    }: {
        bounds?: number[][]
        deliveryPointComponentIsVisible: boolean
        deliveryPointsListComponentIsVisible: boolean
        filtersComponentIsVisible: boolean
        onUpdateDeliveryPoints: () => void
        onGetDeliveryPointById?: (deliveryPointId: string) => void
        onReady: CdekWidgetOptions['onReady']
    } = $props()

    let mapContainer: HTMLDivElement
    let map: Map
    let objectManager: ObjectManager
    let listButton: control.Button
    let filtersButton: control.Button

    const initGeoManager = () => {
        objectManager = new window.ymaps.ObjectManager({
            clusterize: true,
            geoObjectOpenBalloonOnClick: false,
            clusterIconLayout: 'default#pieChart',
            // @ts-ignore
            clusterIconPieChartRadius: ([{ weight }]: {
                weight: number
                color: string
            }[]) => {
                return weight.toString().length * 2.5 + 12.5
            },
            clusterIconPieChartCoreRadius: ([{ weight }]: {
                weight: number
                color: string
            }[]) => {
                return weight.toString().length * 2.5 + 7.5
            }
        })

        objectManager.events.add('click', async (event) => {
            const deliveryPointId = event.get('objectId')

            if (!deliveryPointId || deliveryPointId?.startsWith('__cluster__')) return

            map.setCenter(
                // @ts-ignore
                objectManager.objects.getById(deliveryPointId)?.geometry.coordinates
            )
            map.setZoom(17)

            onGetDeliveryPointById && onGetDeliveryPointById(deliveryPointId)
        })

        map.geoObjects.add(objectManager)
    }

    const initListButton = () => {
        listButton = new window.ymaps.control.Button({
            data: {
                title: 'Показать список пунктов выдачи',
                content: `<div class="!m-[5px]">${listIcon}</div>`
            },
            options: { selectOnClick: false }
        })

        listButton.events.add('click', () => {
            deliveryPointComponentIsVisible = false
            deliveryPointsListComponentIsVisible = true
            filtersComponentIsVisible = false
        })

        map.controls.add(listButton, { float: 'right' })
    }

    const initFiltersButton = () => {
        filtersButton = new window.ymaps.control.Button({
            data: {
                title: 'Фильтры',
                content: `<div class="!m-[5px]">${filtersIcon}</div>`
            },
            options: { selectOnClick: false }
        })

        filtersButton.events.add('click', () => {
            deliveryPointComponentIsVisible = false
            deliveryPointsListComponentIsVisible = false
            filtersComponentIsVisible = true
        })

        map.controls.add(filtersButton, { float: 'right' })
    }

    const initMap = async () => {
        map = new window.ymaps.Map(mapContainer, {
            center: [55.733842, 37.588144],
            zoom: 10,
            controls: ['geolocationControl', 'zoomControl']
        })

        initGeoManager()
        initListButton()
        initFiltersButton()

        map.events.add('actionend', (_event) => {
            bounds = map.getBounds()
            onUpdateDeliveryPoints()
        })

        bounds = map.getBounds()
        onUpdateDeliveryPoints()

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

<div bind:this={mapContainer} class="map-container h-full w-full"></div>

<style lang="postcss">
    @import 'tailwindcss';

    .map-container {
        :global {
            .ymaps-2-1-79-ground-pane {
                @apply grayscale;
            }

            .ymaps-2-1-79-float-button-text {
                @apply !p-0;
            }
        }
    }
</style>

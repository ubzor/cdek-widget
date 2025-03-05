<script lang="ts">
    import { onMount } from 'svelte'

    import { PUBLIC_API_URL, PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public'

    import { CdekWidget } from '@/lib'

    let mapContainer: HTMLDivElement
    let widget: CdekWidget

    onMount(() => {
        widget = new CdekWidget(mapContainer, {
            apiUrl: PUBLIC_API_URL,
            yandexMapsApiKey: PUBLIC_YANDEX_MAPS_API_KEY,
            onReady: () => {
                console.log('Widget is ready')
            },
            onDeliveryPointSelected: (deliveryPoint) => {
                console.log('Delivery point selected:', deliveryPoint)
            }
        })
    })
</script>

<main class="p-4">
    <div bind:this={mapContainer}></div>
</main>

<script lang="ts">
    import { onMount } from 'svelte'

    import { PUBLIC_API_URL, PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public'

    import { CdekWidget } from '@/lib'

    let mapContainer: HTMLDivElement
    let widget: CdekWidget

    onMount(() => {
        widget = new CdekWidget(mapContainer, PUBLIC_API_URL, PUBLIC_YANDEX_MAPS_API_KEY)
    })
</script>

<main>
    <div bind:this={mapContainer}></div>
</main>

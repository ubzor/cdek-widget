<script lang="ts">
    import { onMount } from 'svelte'

    import { CdekWidget } from '@/lib'

    let mapContainer: HTMLDivElement
    let widget: CdekWidget

    onMount(() => {
        widget = new CdekWidget(mapContainer)
    })
</script>

<main>
    <div bind:this={mapContainer}></div>
</main>
